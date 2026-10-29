import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPortraitImage,safePortraitUrl,handlePortraitError,installPortraitErrors} from '../dist/portrait.js';

test('portraits accept safe raster sources and cannot inject crop styles',()=>{
  for(const src of ['javascript:alert(1)','http://example.com/a.jpg','data:image/svg+xml;base64,PHN2Zz4=','https://user:pass@example.com/a.jpg']){
    assert.equal(safePortraitUrl(src),'');
    assert.equal(renderPortraitImage({src}),'');
  }
  assert.equal(safePortraitUrl('data:image/png;base64,AA=='),'data:image/png;base64,AA==');
  const html=renderPortraitImage({src:'https://example.com/a.jpg?x=1&y=2',crop:{x:-10,y:500,zoom:20}});
  assert.match(html,/x=1&amp;y=2/);
  assert.match(html,/object-position:0% 100%;transform:scale\(4\);transform-origin:0% 100%/);
  assert.match(renderPortraitImage({src:'https://example.com/a.jpg',crop:{x:'0;display:none',y:NaN,zoom:Infinity}}),/object-position:50% 50%;transform:scale\(1\)/);
});

test('a failed primary image tries its fallback once, then exposes initials',()=>{
  const attributes=new Map([['data-portrait',''],['data-fallback-src','https://example.com/old.jpg']]);
  const img={tagName:'IMG',src:'https://example.com/new.jpg',style:{},hidden:false,
    hasAttribute:name=>attributes.has(name),getAttribute:name=>attributes.get(name),removeAttribute:name=>attributes.delete(name)};
  const firstError={target:img};
  handlePortraitError(firstError);
  assert.equal(img.src,'https://example.com/old.jpg');
  assert.equal(img.style.transform,'none');
  assert.equal(img.hidden,false);
  handlePortraitError(firstError); // Both document and relay root capture the same event.
  assert.equal(img.hidden,false);
  handlePortraitError({target:img});
  assert.equal(img.hidden,true);
});

test('fallback alone uses default framing and error listeners install once',()=>{
  const html=renderPortraitImage({src:'javascript:void(0)',fallbackSrc:'https://example.com/old.jpg',crop:{x:1,y:2,zoom:4}});
  assert.match(html,/src="https:\/\/example.com\/old.jpg"/);
  assert.match(html,/object-position:50% 50%;transform:scale\(1\)/);
  assert.doesNotMatch(html,/data-fallback-src/);
  let count=0;
  const root={addEventListener:()=>count++};
  installPortraitErrors(root);installPortraitErrors(root);
  assert.equal(count,1);
});
