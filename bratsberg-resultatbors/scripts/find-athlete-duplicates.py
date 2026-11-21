#!/usr/bin/env python3
"""Report possible duplicate athlete IDs without modifying any project data.

Run from any directory:
    python3 scripts/find-athlete-duplicates.py
    python3 scripts/find-athlete-duplicates.py --output /tmp/athlete-matches.json

Names and aliases are compared across all pairs. Name similarity proposes a
review candidate, never an identity or a merge. Existing birth years, gender,
age classes and race entries are included as evidence or conflict warnings.
"""

import argparse
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from itertools import combinations
import json
from pathlib import Path
import re
import unicodedata


def normalize(value):
    value = value.casefold().translate(str.maketrans({"ø": "o", "æ": "ae"}))
    value = "".join(c for c in unicodedata.normalize("NFKD", value)
                    if not unicodedata.combining(c))
    return " ".join(re.sub(r"[^a-z0-9]+", " ", value).split())


def distance_one(a, b):
    if abs(len(a) - len(b)) > 1:
        return False
    if len(a) == len(b):
        return sum(x != y for x, y in zip(a, b)) == 1
    if len(a) > len(b):
        a, b = b, a
    return any(b[:i] + b[i + 1:] == a for i in range(len(b)))


def name_match(a, b):
    """Conservative proposal rules: do not match on a surname alone."""
    left, right = normalize(a).split(), normalize(b).split()
    if min(len(left), len(right)) < 2:
        return None
    if left == right:
        return "normalized_name_or_alias"
    if Counter(left) == Counter(right):
        return "reordered_name"
    if left[0] == right[0] and left[-1] == right[-1]:
        if len(left) == len(right) and distance_one(" ".join(left), " ".join(right)):
            return "one_character_spelling"
        shorter, longer = sorted((left, right), key=len)
        iterator = iter(longer)
        if all(any(token == other for other in iterator) for token in shorter):
            return "missing_middle_name"
        return "same_first_and_last_name"
    if left[:-1] == right[:-1] and min(len(left[-1]), len(right[-1])) >= 5:
        if distance_one(left[-1], right[-1]):
            return "one_character_spelling"
    return None


def age_interval(category):
    # Only explicit numeric ranges; do not infer an exact age from Senior/MH.
    match = re.search(r"(\d{1,2})\s*[-–]\s*(\d{1,2})", category or "")
    if match:
        return tuple(map(int, match.groups()))
    return None


def compare_evidence(a, b, entries):
    support, warnings = [], []
    ay, by = a.get("birthYear"), b.get("birthYear")
    if ay and by:
        (support if ay == by else warnings).append(
            f"birth_year_match:{ay}" if ay == by else f"birth_year_conflict:{ay}/{by}")
    ea, eb = entries[a["id"]], entries[b["id"]]
    ga = {x["gender"] for x in ea if x.get("gender")}
    gb = {x["gender"] for x in eb if x.get("gender")}
    if ga and gb and ga.isdisjoint(gb):
        warnings.append("gender_conflict")
    compatible_age = False
    for x in ea:
        for y in eb:
            ix, iy = age_interval(x.get("category")), age_interval(y.get("category"))
            if ix and iy and x["date"][:4] == y["date"][:4]:
                if max(ix[0], iy[0]) <= min(ix[1], iy[1]):
                    compatible_age = True
                else:
                    warnings.append("nonoverlapping_age_categories_same_year")
            if (x["raceId"], x["date"], x.get("distance")) == (
                    y["raceId"], y["date"], y.get("distance")):
                if x.get("sourceBib") and x.get("sourceBib") == y.get("sourceBib"):
                    support.append("same_event_and_bib")
                else:
                    warnings.append("both_ids_in_same_event_requires_review")
    if compatible_age:
        support.append("compatible_age_categories_same_year")
    if not ea or not eb:
        warnings.append("one_or_both_ids_have_no_individual_race_entries")
    if not ay or not by:
        warnings.append("birth_year_missing_for_one_or_both_ids")
    return sorted(set(support)), sorted(set(warnings))


def scan(data_dir):
    register = json.loads((data_dir / "athletes.json").read_text())
    athletes = register["athletes"]
    by_id = {a["id"]: a for a in athletes}
    if len(by_id) != len(athletes):
        raise ValueError("Repeated athlete IDs in register")
    entries = defaultdict(list)
    index = json.loads((data_dir / "index.json").read_text())
    for race_path in index["races"]:
        race = json.loads((data_dir.parent / race_path).read_text())
        for result in race.get("results", []):
            entry = {key: result[key] for key in (
                "distance", "time", "netTime", "gunTime", "status", "gender",
                "category", "sourceBib", "sourceUrl") if key in result}
            entry.update(raceId=race["id"], raceName=race["name"],
                         date=result.get("date", race["date"]))
            entry.setdefault("sourceUrl", race.get("sourceUrl"))
            entries[result["athleteId"]].append(entry)
    pairs = []
    adjacency = defaultdict(set)
    for a, b in combinations(athletes, 2):
        matches = []
        for an in [a["name"], *a.get("aliases", [])]:
            for bn in [b["name"], *b.get("aliases", [])]:
                rule = name_match(an, bn)
                if rule:
                    matches.append({"a": an, "b": bn, "rule": rule})
        if not matches:
            continue
        support, warnings = compare_evidence(a, b, entries)
        pairs.append({"athleteIds": [a["id"], b["id"]], "matches": matches,
                      "support": support, "warnings": warnings})
        adjacency[a["id"]].add(b["id"])
        adjacency[b["id"]].add(a["id"])
    groups, seen = [], set()
    for athlete_id in sorted(adjacency):
        if athlete_id in seen:
            continue
        pending, members = [athlete_id], set()
        while pending:
            current = pending.pop()
            if current in members:
                continue
            members.add(current)
            pending.extend(adjacency[current] - members)
        seen.update(members)
        groups.append({
            "athletes": [{"id": x, "name": by_id[x]["name"],
                          "aliases": by_id[x].get("aliases", []),
                          "birthYear": by_id[x].get("birthYear"),
                          "existingIdentityReview": by_id[x].get("identityReview"),
                          "results": entries[x]} for x in sorted(members)],
            "pairs": [p for p in pairs if set(p["athleteIds"]) <= members],
        })
    # Also expose raw high-similarity non-candidates for human review. They
    # include relatives and other people; a high score is not an identity.
    rejected_near_names = []
    pair_ids = {tuple(sorted(p["athleteIds"])) for p in pairs}
    for a, b in combinations(athletes, 2):
        if tuple(sorted((a["id"], b["id"]))) in pair_ids:
            continue
        ratio = SequenceMatcher(None, normalize(a["name"]), normalize(b["name"])).ratio()
        if ratio >= .75:
            rejected_near_names.append({"names": [a["name"], b["name"]],
                                       "similarity": round(ratio, 3)})
    return {
        "method": "Read-only candidate search; no automatic identity decision or merge",
        "athleteCount": len(athletes), "pairsCompared": len(athletes) * (len(athletes) - 1) // 2,
        "athletesWithRaceEntries": sum(bool(entries.get(x)) for x in by_id),
        "raceEntryCount": sum(map(len, entries.values())),
        "candidateGroupCount": len(groups), "candidatePairCount": len(pairs),
        "candidateAthleteCount": len(seen),
        "hypotheticalCountIfAllGroupsConfirmed": len(athletes) - sum(
            len(g["athletes"]) - 1 for g in groups),
        "groups": groups,
        "highSimilarityNamesNotAccepted": sorted(rejected_near_names,
                                                  key=lambda x: -x["similarity"]),
        "existingMergedAthleteIds": register.get("mergedAthleteIds", {}),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path,
                        default=Path(__file__).resolve().parents[1] / "dist" / "data")
    parser.add_argument("--output", type=Path, help="Optional JSON report outside the data directory")
    args = parser.parse_args()
    if args.output and args.output.resolve().is_relative_to(args.data_dir.resolve()):
        parser.error("Report output must not overwrite files inside the input data directory")
    report = json.dumps(scan(args.data_dir), ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(report, encoding="utf-8")
    else:
        print(report, end="")


if __name__ == "__main__":
    main()
