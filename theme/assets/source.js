$(document).ready(function(){

  var cart = $('[data-dummy-cart]');
  var productForm = $('[data-product-form]');

  productForm.on('submit',function(event){
    var form = $(this);
    var formData = form.serialize();
    
    event.preventDefault();

    /* Log Test */
    console.log(formData);
    
    $.ajax({
      url: '/cart/add.js',
      method:'POST',
      contentType: 'application/x-www-form-urlencoded',
      context: form,
      data: formData
    })
    .done(function(res){
      var cart = JSON.parse(res);
      createCartInstance(cart)
    })
    .fail(function(error){
      console.log(`Error ${error.status}: ${error.statusText}`);
    })
    .always(function(){
      event.preventDefault();
    });

  });


  /* hero section */
  var carouselItem = document.querySelector('.carousel-item');
  carouselItem.classList.toggle('active');
  $('.carousel').carousel({
    interval: 2000
  });
  /* hero section */

  /* featured products section */
  var featuredProductsSection = document.querySelector('.featured-collection-section');
  var featuredProducts = featuredProductsSection.querySelectorAll('.product');
  featuredProducts.forEach( product => {
    let img = product.querySelector('img');
    let overlay = product.querySelector('.overlay');
    product.addEventListener('mouseleave',function(){
      overlay.style.bottom = null;
    });
    img.addEventListener('mouseover', function(){
      console.log(product);
      overlay.style.bottom = '0px';
    });
    img.addEventListener('mouseleave', function(){
      overlay.style.bottom = null;
    });
    overlay.addEventListener('mouseover', function(){
      overlay.style.bottom = '0px';
    });
  });
  /* featured products section */

  /** Product Display Carousel */
  var productDisplay = document.querySelector('.product-display');
  var productCarouselItem = productDisplay.querySelector('.carousel-item');
  var square = productDisplay.querySelector(".square");
  square.style.width = `${square.parentElement.offsetWidth}px`;
  // var content = square.querySelector('.content');
  content.style.height = `${square.offsetWidth}px`;
  productCarouselItem.classList.toggle('active');
  /** Product Display Carousel */
  $('.square .carousel').carousel({
    interval: 2000
  });

});

function createCartInstance(){
  $.ajax({
    url: '/cart.js',
    method: 'GET',
    dataType: 'json'
  })
  .done(function(state){
    state.items.forEach(item => console.log(item));
  })
}

function createCartItem() {
  
}


