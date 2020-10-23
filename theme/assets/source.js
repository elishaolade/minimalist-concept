$(document).ready(function(){

  var self = this;
  var cartDrawer = $('[data-dummy-cart]');
  var productForm = $('[data-product-form]');
  var cartItems = $('[data-cart-items]');
  var cartItem = $('[data-cart-item]');
  var removeCartItem = $('[data-remove-cart-item]');
  var cartButton = $('[data-cart-button]');
  var cartItemQty = $('[data-cart-item-qty]');

  /** Beg. Navbar */
  
  /** End. Navbar */

  /** Beg. Cart Popup*/
  
  /** End. Cart Popup*/

  /** Beg. Cart Items */
  cartItem.on({
    mouseenter: function() {
      var self = $(this);
      $(this).find('button').addClass(function() { 
        let toggle = $(this).hasClass('d-none') ? 'd-block' : 'd-none';
        return toggle;
      });
    },
    mouseleave: function(){
      $(this).find('button').removeClass(function() { 
        let toggle = $(this).hasClass('d-none') ? 'd-block' : 'd-none';
        console.log(toggle);
        return toggle; 
      });
    }
  })
  /** End. Cart Items */

  /** Beg. Remove Cart Item */
  removeCartItem.each(function(){
    $(this).click(function(){
      let item = $(this).closest('[data-cart-item]');
      removeItem(item, cartItems);
    })
  });
  /** End. Remove Cart Item */
  

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
      console.log(cart);
      updateCartInstance(cartItems);
    })
    .fail(function(error){
      console.log(`Error ${error.status}: ${error}`);
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

function updateCartInstance(element) {
  $.ajax({
    url: '/cart.js',
    method:'GET'
  })
  .done(function(res){
    var cart = JSON.parse(res);
    updateCartList(cart, element);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  })
}

function updateCartList(state, element) {

  var currency = state.currency;

  var self = this;

  /* Clean out old list items */
  element.empty();

  /* Get each product in cart */
  var items = state.items;

  /* For each product in cart :
  
  */
  items.forEach(item => {
    
    /* Create a new item in html */ 
    let newItem = 
      $(`<li class="cart__item list-group-item d-flex justify-content-between lh-condensed" data-cart-item data-variant-id=${ item.variant_id }>
          <div class="d-flex">
            <div>
              <img class="mr-3" width="100" src="${ item.image }"/>
            </div>
            <div>
              <h6 class="my-0">${ item.title }</h6>
              <form action="">
                  <label class="text-muted d-block">
                      <span class="mr-2">Quantity</span>
                      <input type="number" name="quantity" value=${item.quantity} min="1" max="10"  data-cart-item-qty></input>
                  </label>
              </form>
              <span class="text-muted">$ ${ [item.final_line_price / 100] + " " + currency }</span>
              <button class="d-none btn mt-2" data-remove-cart-item>Remove</button>
            </div>
          </div>
        </li>`);
    
    /* Create event listener for hover */
    newItem.on({
      mouseenter: function() {
        $(this).find('button').addClass(function() { 
          let toggle = $(this).hasClass('d-none') ? 'd-block' : 'd-none';
          return toggle;
        });
      },
      mouseleave: function(){
        $(this).find('button').removeClass(function() { 
          let toggle = $(this).hasClass('d-none') ? 'd-block' : 'd-none';
          console.log(toggle);
          return toggle; 
        });
      }
    })

    /* Append new item to list */
    newItem.appendTo(element);

    /* This new item added to list */
    // var item = newItem;

    /* Add event listener*/
    newItem.find('button').click(function(){
      var itm = $(this).closest('[data-cart-item]');
      console.log(itm);
      removeItem(itm, element);
    });

    var oldQty = item.quantity;

    newItem.find('[data-cart-item-qty]').on("input", function(){

      var qty = $(this).val();
      console.log(qty);
      
      $.ajax({
        url: '/cart/change.js',
        method: 'POST',
        data: { id: item.variant_id, quantity: qty }
      })
      .done(function(response){
        var cart = JSON.parse(response);
        console.log(cart)
        updateCartList(cart,element);
      })
      .fail(function(error){
        console.log(`Error ${error.status}: ${error}`);
      })
    });

  });

}

function updateQty(variantId,qty){
  console.log(variantId);
  $.ajax({
    url: '/cart/update.js',
    method: 'POST',
    data: { id: variantId, quantity: qty }
  })
  .done(function(response){
    var cart = JSON.parse(response);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  })
}

function updateItem(qty, item ) {
  $.ajax({
    url: '/cart/update.js',
    method:'POST',
    data: { id: item.variant_id, quantity: qty  }
  })
  .done(function(res){
    var cart = JSON.parse(res);
    console.log(cart);
      // item.find('[data-cart-item-qty]').val(qty);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  })

}
function removeItem(item, element) {
  let variantId = item.attr('data-variant-id');
  console.log('removeItem: ' + variantId);

  $.ajax({
    url: '/cart/change.js',
    method:'POST',
    data: { id: variantId, quantity: 0 }
  })
  .done(function(res){
    var cart = JSON.parse(res);
    console.log(cart); 
    updateCartList(cart, element);
  })
  .fail(function(error){
    console.log(`Error ${error.status}: ${error}`);
  })
}
