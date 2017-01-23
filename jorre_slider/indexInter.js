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

      if (flytt == 1600) {
          flytt = 0;
      }

      if (flytt == 400) {
          sov(500);
      }
  }, 16);

 }
