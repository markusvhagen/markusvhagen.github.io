function sov(ms) {
    var tid = new Date().getTime();
    while (tid + ms >= new Date().getTime()) {}
}

window.onload = function () {
  var ting = document.getElementById("bilder");
  var flytt = 0;

  setInterval(function bevegelse() {
      flytt += 5;
      ting.style.left = "-" + flytt + "px";

      if (flytt == 1605) {
          sov(500);
          flytt = 0;
      }

      else if (flytt == 405) {
          sov(500);
      }

      else if (flytt == 805) {
          sov(500);
      }

      else if (flytt == 1205) {
          sov(500);
      }

  }, 16);
 }
