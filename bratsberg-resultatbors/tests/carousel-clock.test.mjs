import test from 'node:test';
import assert from 'node:assert/strict';
import {createCarouselClock} from '../dist/carousel-clock.js';

test('advances once at each complete twenty-second interval', () => {
  const clock = createCarouselClock();
  assert.equal(clock.advance(19999).due, false);
  assert.equal(clock.read().remaining, 1);
  assert.equal(clock.advance(1).due, true);
  assert.deepEqual(clock.read(), {progress: 0, remaining: 20});
  assert.equal(clock.advance(19999).due, false);
  assert.equal(clock.advance(1).due, true);
});

test('a pause retains progress and resumes from the remaining time', () => {
  const clock = createCarouselClock();
  clock.advance(3500);
  const pausedState = clock.read();
  for (let i = 0; i < 120; i++) {
    const state = clock.advance(1000, true);
    assert.equal(state.due, false);
    assert.equal(state.progress, pausedState.progress);
    assert.equal(state.remaining, pausedState.remaining);
  }
  assert.equal(clock.advance(16499).due, false);
  assert.equal(clock.advance(1).due, true);
});

test('explicit reset grants the newly selected race a complete interval', () => {
  const clock = createCarouselClock();
  clock.advance(19500);
  clock.reset();
  assert.deepEqual(clock.read(), {progress: 0, remaining: 20});
  assert.equal(clock.advance(500).due, false);
  assert.equal(clock.advance(19499).due, false);
  assert.equal(clock.advance(1).due, true);
});

test('render polling cannot restart the countdown', () => {
  const clock = createCarouselClock();
  clock.advance(5000);
  for (let i = 0; i < 1000; i++) {
    assert.deepEqual(clock.read(), {progress: 0.25, remaining: 15});
  }
  assert.equal(clock.advance(15000).due, true);
});

test('frame-sized advances trigger one change without drifting under polling', () => {
  const clock = createCarouselClock();
  let changes = 0;
  for (let frame = 0; frame < 2500; frame++) {
    changes += Number(clock.advance(16).due);
    clock.read();
  }
  assert.equal(changes, 2);
  assert.deepEqual(clock.read(), {progress: 0, remaining: 20});
});

test('invalid or negative frame deltas cannot reverse or poison progress', () => {
  const clock = createCarouselClock();
  clock.advance(3000);
  for (const delta of [-500, NaN, Infinity, -Infinity]) {
    assert.equal(clock.advance(delta).due, false);
    assert.deepEqual(clock.read(), {progress: 0.15, remaining: 17});
  }
  assert.equal(clock.advance(17000).due, true);
});
