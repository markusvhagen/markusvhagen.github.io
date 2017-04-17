// jQuery

function scrollTo(element) {
    $('html, body').animate({ scrollTop: $(element).offset().top }, 'slow');
      return false;
  }

window.onscroll = function () {
    var mydivpos = document.getElementById("about").offsetTop;
    var scrollPos = document.getElementsByTagName("body")[0].scrollTop;

    if(scrollPos >= mydivpos) {
        $("#nav").fadeIn("slow", function() {});
    }
    else {
        $("#nav").fadeOut("fast", function() {});
    }
  };

// Native

window.onload = function greeting() {
    var greetings = ["Salut.", "Ciao.", "Hi.", "Ahoj.", "Hej.", "Hola.", "Hei.", "Czesc.", "Kon`nichiwa.","Hallo."];
    var output = document.getElementById("greeting");
    let i = 0;
    setInterval(function() {
        output.innerHTML = greetings[i]
        i++;
        if (i == (greetings.length - 1)) {
            i = 0;
        }
    }, 5000);
}
