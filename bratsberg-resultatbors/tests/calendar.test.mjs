import test from 'node:test';
import assert from 'node:assert/strict';
import {applyAthleteRegistry} from '../dist/athlete-registry.js';
import {renderCalendarParticipant,renderParticipantPreview} from '../dist/calendar.js';

test('calendar and collapsed preview use the shared resolved profile and crop',()=>{
  const data=applyAthleteRegistry({
    athletes:{athletes:[{id:'runner',name:'Markus Valås Hagen',aliases:['Markus Hagen'],photo:{src:'https://example.com/runner.jpg',fallbackSrc:'https://example.com/old.jpg',crop:{x:27,y:36,zoom:1.6}}}]},
    upcoming:[{id:'jessheim',participants:[{name:'Markus Hagen',distance:'Halvmaraton'}]}]
  });
  const person=data.upcoming[0].participants[0];
  assert.equal(person.athleteId,'runner');
  for(const html of [renderCalendarParticipant(person,data.portraits),renderParticipantPreview([person],data.portraits)]){
    assert.match(html,/src="https:\/\/example.com\/runner.jpg"/);
    assert.match(html,/data-fallback-src="https:\/\/example.com\/old.jpg"/);
    assert.match(html,/object-position:27% 36%;transform:scale\(1.6\)/);
    assert.match(html,/data-portrait/);
  }
  const card=renderCalendarParticipant(person,data.portraits);
  assert.match(card,/Markus Valås Hagen/);
  assert.match(card,/Halvmaraton/);
  assert.match(card,/width="80" height="100"/);
});

test('a profile photo update reaches calendar entries without changing the event',()=>{
  const person={athleteId:'runner',name:'Ane Gangås Bromset',distance:'Maraton'};
  const portraits={runner:{src:'https://example.com/before.jpg'}};
  assert.match(renderCalendarParticipant(person,portraits),/before.jpg/);
  portraits.runner.src='https://example.com/after.jpg';
  assert.match(renderCalendarParticipant(person,portraits),/after.jpg/);
  assert.equal(person.athleteId,'runner');
});

test('missing or unsafe photos leave initials while names and distances are escaped',()=>{
  const person={athleteId:'missing',name:'<Ane> & Julie',distance:'<Maraton>'};
  const html=renderCalendarParticipant(person,{missing:{src:'javascript:alert(1)'}});
  assert.doesNotMatch(html,/<img\b|<Ane>|<Maraton>|javascript:/);
  assert.match(html,/&lt;Ane&gt; &amp; Julie/);
  assert.match(html,/&lt;Maraton&gt;/);
  assert.match(html,/calendar-person-photo/);
  assert.doesNotMatch(renderCalendarParticipant({...person,athleteId:null},{missing:{src:'https://example.com/wrong.jpg'}}),/wrong.jpg/);
});

test('previews are bounded, decorative and empty-safe',()=>{
  const people=Array.from({length:10},(_,i)=>({athleteId:String(i),name:'Løper '+i}));
  const html=renderParticipantPreview(people);
  assert.equal((html.match(/class="participant-preview-photo"/g)||[]).length,3);
  assert.match(html,/aria-hidden="true"/);
  assert.equal(renderParticipantPreview([]),'');
  assert.equal(renderParticipantPreview(undefined),'');
  assert.equal(renderParticipantPreview(people,{}, {limit:0}),'');
  assert.equal((renderParticipantPreview(people,{}, {limit:100}).match(/class="participant-preview-photo"/g)||[]).length,6);
});
