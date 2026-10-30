/** A layout-independent countdown. Pauses retain progress; reset is explicit. */
export function createCarouselClock(duration=20000) {
  let elapsed=0;
  return {
    advance(delta,blocked=false){
      if(!blocked)elapsed+=Math.max(0,Number.isFinite(delta)?delta:0);
      const due=elapsed>=duration;
      if(due)elapsed=0;
      return {due,progress:elapsed/duration,remaining:Math.ceil((duration-elapsed)/1000)};
    },
    reset(){elapsed=0;},
    read(){return {progress:elapsed/duration,remaining:Math.ceil((duration-elapsed)/1000)};}
  };
}
