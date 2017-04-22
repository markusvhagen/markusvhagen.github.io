function scrollTo(element) {
    $('html, body').animate({ scrollTop: $(element).offset().top }, 'slow');
      return false;
  }

window.onscroll = function () {
    var aboutpos = document.getElementById("about").offsetTop;
    var portfoliopos = document.getElementById("portfolio").offsetTop;
    var scrollPos = document.getElementsByTagName("body")[0].scrollTop;

    if(scrollPos >= aboutpos) {
        $("#nav").fadeIn("slow");
        $("#toTop").fadeIn("slow")
    }
    else {
        $("#nav").fadeOut("fast");
        $("#toTop").fadeOut("fast");
    }

    if (scrollPos > aboutpos && scrollPos < portfoliopos) {
        document.getElementById("about_link").className = "active_nav_about";
    }

    else {
        document.getElementById("about_link").className = "";
    }

    if (scrollPos >= portfoliopos) {
        document.getElementById("portfolio_link").className = "active_nav_portfolio";
    }

    else {
        document.getElementById("portfolio_link").className = "";
    }
  };

window.onload = function greeting() {
    var greetings = ["Salut.", "Ciao.", "Hi.", "Ahoj.", "Hej.", "Hola.", "Hei.", "Czesc.", "Kon`nichiwa.","Hallo."];
    var output = document.getElementById("greeting");
    let i = 0;

    setInterval(function() {
      $("#greeting").fadeOut(1000, function() {
          output.innerHTML = greetings[i]
          i++;
          if (i == (greetings.length - 1)) {
              i = 0;
          }
      });

      $("#greeting").fadeIn(1000);
      $("#greeting").delay(6000);
      }, 8000);
  }
