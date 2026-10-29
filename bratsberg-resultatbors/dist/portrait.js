const portraitEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const portraitNumber=(value,fallback,min,max)=>typeof value==='number'&&Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
const portraitErrorEvents=new WeakSet();
const portraitErrorRoots=new WeakSet();

/** Accept remote HTTPS images and embedded raster images, never executable URLs. */
export function safePortraitUrl(value){
  if(typeof value!=='string'||!value.trim())return '';
  try{
    const url=new URL(value);
    if(url.protocol==='https:'&&!url.username&&!url.password)return url.href;
    if(/^data:image\/(?:png|jpe?g|webp|gif|avif);base64,[a-z0-9+/=\s]+$/i.test(value))return value;
  }catch{}
  return '';
}

/** Framing remains in the shared photo record, not in an individual race. */
export function renderPortraitImage(photo,{width=96,height=120}={}){
  const requested=safePortraitUrl(photo?.src);
  const fallback=safePortraitUrl(photo?.fallbackSrc);
  const src=requested||fallback;
  if(!src)return '';
  const crop=requested?photo?.crop:null;
  const x=portraitNumber(crop?.x,50,0,100),y=portraitNumber(crop?.y,50,0,100),zoom=portraitNumber(crop?.zoom,1,1,4);
  const w=Math.round(portraitNumber(width,96,1,2000)),h=Math.round(portraitNumber(height,120,1,2000));
  return `<img data-portrait src="${portraitEscape(src)}"${requested&&fallback&&fallback!==requested?` data-fallback-src="${portraitEscape(fallback)}"`:''} width="${w}" height="${h}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="object-position:${x}% ${y}%;transform:scale(${zoom});transform-origin:${x}% ${y}%">`;
}

export function handlePortraitError(event){
  const image=event?.target;
  if(!image||image.tagName!=='IMG'||!image.hasAttribute('data-portrait')||portraitErrorEvents.has(event))return;
  // A document handler and a nested relay handler can see the same captured error.
  portraitErrorEvents.add(event);
  const fallback=safePortraitUrl(image.getAttribute('data-fallback-src'));
  image.removeAttribute('data-fallback-src');
  if(fallback&&fallback!==image.src){
    image.style.objectPosition='50% 50%';
    image.style.transform='none';
    image.style.transformOrigin='50% 50%';
    image.src=fallback;
    return;
  }
  image.hidden=true;
}

export function installPortraitErrors(root=document){
  if(!root||portraitErrorRoots.has(root))return;
  portraitErrorRoots.add(root);
  root.addEventListener('error',handlePortraitError,true);
}
