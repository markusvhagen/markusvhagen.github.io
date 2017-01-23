window.onload = function () {
  var ting = document.getElementById("bilder");
  var flytt = 0;
  var eine = setInterval(ein ,16);
  function ein(){
    flytt += 5;
    ting.style.left = "-" + flytt + "px";
    if (flytt == 1600) {
        flytt = 0;
    }
  }
}
