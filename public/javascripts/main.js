$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#scroll").fadeIn();
    } else {
      $("#scroll").fadeOut();
    }
  });
  $("#scroll").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });
});

//Get the button
const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Get the modal
// const modal = document.getElementById("myModal");

// // Get the image and insert it inside the modal - use its "alt" text as a caption
// const click = document.getElementById("imgClick");
// const img = document.getElementById("myImg");
// const modalImg = document.getElementById("img01");
// const captionText = document.getElementById("caption");
// img.onclick = function () {
//   modal.style.display = "block";
//   modalImg.src = this.src;
//   captionText.innerHTML = this.alt;
// };

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// This function will show the image in the lightbox
let zoomImg = function () {
  // Create evil image clone
  const clone = this.cloneNode();
  clone.classList.remove("zoomD");

  // Put evil clone into lightbox
  let lb = document.getElementById("lb-img");
  lb.innerHTML = "";
  lb.appendChild(clone);

  // Show lightbox
  lb = document.getElementById("lb-back");
  lb.classList.add("show");
};

window.addEventListener("load", function () {
  // Attach on click events to all .zoomD images
  const images = document.getElementsByClassName("zoomD");
  if (images.length > 0) {
    for (let img of images) {
      img.addEventListener("click", zoomImg);
    }
  }

  // Click event to hide the lightbox
  document.getElementById("lb-back").addEventListener("click", function () {
    this.classList.remove("show");
  });
});
