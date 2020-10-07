$(document).ready(function(){



  $('#product-form').on('submit',function(event){
    event.preventDefault();
    var form = $(this);
    var formData = form.serialize();

    /* Log Test */
    console.log(formData);
    
    $.ajax({
      url: '/cart/add.js',
      method:'POST',
      contentType: 'application/x-www-form-urlencoded',
      context: form,
      data: formData
    })
    .done(function(result){
      console.log('success '+result.title);
    })
    .fail(function(error){
      console.log(`Error ${error.status}: ${error.statusText}`);
    })
    .always(function(){
      console.log('always');
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


