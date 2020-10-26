var selectors = {
  cartPopup: '[data-cart-popup]',
  cartItem: '[data-cart-item]',
  cartItemWrapper: '[data-cart-item-wrapper]',
  cartItemQty: '[data-cart-item-qty]'
}
$(document).ready(function(){
  var productForm = $('[data-product-form]');
  var cartItem = $('[data-cart-item]');
  var modal = $('#exampleModal');
  var cartItem = $(selectors.cartItem);
  productForm.on('submit',function(event){
    var form = $(this);
    var formData = form.serialize();
    event.preventDefault();
    modal.modal('show');
    addItem(formData,cartItem);
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

function createState(element){
  $.ajax({
    url: '/cart.js',
    method:'GET',
  })
  .done(function(res){
    var cart = JSON.parse(res);
    var currencyPlaceHolder = element.find('.currency');
    currencyPlaceHolder.html(cart.currency);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  })
}

function updateCartItem(item, targetElement){ 
  var title = item.title;
  var qty = item.quantity;
  var imageSrc = item.image;
  var unitPrice = item.price/100;
  var totalPrice = item.final_line_price/100;
  var item__wrapper = targetElement.find('[data-cart-item-wrapper]');
  item__wrapper.empty();
  var item__container = $('<div class="d-flex"></div>');
  var item__image = $('<div class="mr-3"><img width="100" src="'+ imageSrc +'"/></div>');
  var item__details = $('<div class="w-100"></div>');
  var details__header = $('<div class="details__header d-flex justify-content-between"></div>')
  var titleDisplay = $('<h5><b>'+title+'</b></h5>');
  var indPrice = $('<div><span class="price mr-2">'+ unitPrice +'</span>' + '<span class="currency"></span></div>');
  var itemTotalPrice = $('<div><b>Total:</b> '+ totalPrice +'<span class="currency ml-2" data-cart-currency></span></div></div>');

  item__wrapper.append(item__container);
  item__container.append(item__image);
  item__container.append(item__details);
  item__details.append(details__header);
  item__details.append(indPrice);
  item__details.append(itemTotalPrice);
  details__header.append(titleDisplay);
  details__header.append(indPrice);

  var inputContainer = $('<div class="input-container d-flex mt-2"></div>')
  var input = $('<input style="text-align: center; width: 50px;" type="number" min="1" max="9" step="1" value="' + qty + '" data-qty-input/>');
  var navBtns = $('<div class="navBtns"></div>');
  var btns = $('<div class="qty-btns top" data-qty-increment>+</div><div class="qty-btns bottom" data-qty-deincrement>-</div>');

  item__details.append(inputContainer);
  inputContainer.append(input);
  navBtns.insertAfter(input);
  navBtns.append(btns);
  createState(targetElement);
  $('.input-container').each(function(){
    var self = this;
    var spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('[data-qty-increment]'),
        btnDown = spinner.find('[data-qty-deincrement]'),
        min = input.attr('min'),
        max = input.attr('max');

      var value = input.val();
      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        value = newVal;
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        changeItem(item.variant_id, value, targetElement);
      });

      btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        value = newVal;
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
        changeItem(item.variant_id, value, targetElement);
      });
  });
}

function addItem(formData,targetElement) {
  $.ajax({
    url: '/cart/add.js',
    method:'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: formData
  })
  .done(function(response){
    var item = JSON.parse(response);
    targetElement.attr('[data-variant-id]');
    createState(targetElement);
    updateCartItem(item, targetElement);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  });
}

function changeItem(variantId, qty, targetElement) {
  $.ajax({
    url: '/cart/change.js',
    method:'POST',
    data: { id: variantId, quantity: qty }
  })
  .done(function(response){
    var cart = JSON.parse(response);
    $.each(cart.items , function(index, value){
      var itm = value;
      if (itm.variant_id === variantId)
        updateCartItem(itm, targetElement);
    });
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  });
}
