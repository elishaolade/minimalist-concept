$(document).ready(function(){
  var featured-products = document.querySelectorAll('.product');
  /* PRODUCT DISPLAY FUNCTIONALITY */
  var productPageRow = document.querySelector('.row');
  var square = document.querySelector(".square");

  square.style.width = `${square.parentElement.offsetWidth -50}px`;
  $('.carousel').carousel({
    interval: 2000
  })
  /* PRODUCT DISPLAY FUNCTIONALITY */

  var tinyScreenWidth = window.matchMedia("(max-width: 575.98px)");
  if(tinyScreenWidth.matches)
    square.style.width = null;

  /* featured-products FUNCTIONALITY */
  featured-products.forEach(product => {
    let img = product.querySelector('.product img');
    let overlay = product.querySelector('.overlay');
    product.addEventListener('mouseleave',function(){
      overlay.style.bottom = null;
    });
    img.addEventListener('mouseover', function(){
      overlay.style.bottom = '0px';
    });
    img.addEventListener('mouseleave', function(){
      overlay.style.bottom = null;
    });
    overlay.addEventListener('mouseover', function(){
      overlay.style.bottom = '0px';
    });
  });
  /* featured-products FUNCTIONALITY */


  /* CART FUNCTIONALITY */
  var addToCartBtn = document.querySelector('.add-to-cart');
  var cartSection = document.querySelector('.cart');
  var bgBackground = document.querySelector('.bg-overlay');
  var cart = document.querySelector('.cart');
  var cartExitBtn = document.querySelector('.cart__exit');
  var tl = gsap.timeline();
  tl.to('.cart-outer', { display: "block" })
    .to('.cart-outer', { backgroundColor: "rgba(0,0,0,.7)", duration: .2 }, "-=.1")
    .to('.cart', { transform: 'translateX(-100%)' , duration: .2 }, "+=.1");
  addToCartBtn.addEventListener('click',function(){
    clickHandler();
  });
  bgBackground.addEventListener('click',function(){
    clickHandler();
  });
  cartExitBtn.addEventListener('click', function(){
    clickHandler();
  });
  function clickHandler(){
    tl.reversed() ? tl.play():tl.reverse();
  }
  /* CART FUNCTIONALITY */


	
});
