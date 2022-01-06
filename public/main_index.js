$(document).ready(function () {
  $(".readmore").click(function () {
    var elem = $(".rmtext").text();
    if (elem == "READ MORE") {
      //Stuff to do when btn is in the read more state
      $(".rmtext").text("READ LESS");
      $(".abouttext").slideDown();
      $(".readmore svg").css({ transform: "rotate(-180deg)" });
    } else {
      //Stuff to do when btn is in the read less state
      $(".rmtext").text("READ MORE");
      $(".abouttext").slideUp();
      $(".readmore svg").css({ transform: "rotate(0deg)" });
    }
  });

  try {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: 1,
      arrows: true,
      draggable: true,
      spaceBetween: 16,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        550: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
      },
    });
  } catch {}

  $(".navbar-toggler").click(function () {
    $(".navbar").toggleClass("clicked");
    if ($(".navbar").hasClass("clicked"))
      $(".navbarlogo").attr("src", "assets/images/logocolored.png");
    else if (!$(".navbarContainer").hasClass("scrolled"))
      $(".navbarlogo").attr("src", "assets/images/logo.png");
  });
});

$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $(".navbarContainer").addClass("scrolled");
    $(".navbarlogo").attr("src", "assets/images/logocolored.png");
  } else {
    $(".navbarContainer").removeClass("scrolled");
    $(".navbarlogo").attr("src", "assets/images/logo.png");
  }
  if ($(this).scrollTop() > 1000) {
    $(".probitPopup").removeClass("showit");
  }
});

function metamaskrefresh() {
  alert("Open Metamask and referesh page");
}
