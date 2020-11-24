/********** Slate Code *************/
/* ================ MODULES ================ */
window.theme = window.theme || {};


this.Shopify.theme = this.Shopify.theme || {};
this.Shopify.theme.cart = (function (exports) {
  'use strict';

  function getDefaultRequestConfig() {
    return JSON.parse(
      JSON.stringify({
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        }
      })
    );
  }

  function fetchJSON(url, config) {
    return fetch(url, config).then(function(response) {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    });
  }

  function cart() {
    return fetchJSON('/cart.js', getDefaultRequestConfig());
  }

  function cartAdd(id, quantity, properties) {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify({
      id: id,
      quantity: quantity,
      properties: properties
    });

    return fetchJSON('/cart/add.js', config);
  }

  function cartAddFromForm(formData) {
    var config = getDefaultRequestConfig();
    delete config.headers['Content-Type'];

    config.method = 'POST';
    config.body = formData;

    return fetchJSON('/cart/add.js', config);
  }

  function cartChange(line, options) {
    var config = getDefaultRequestConfig();

    options = options || {};

    config.method = 'POST';
    config.body = JSON.stringify({
      line: line,
      quantity: options.quantity,
      properties: options.properties
    });

    return fetchJSON('/cart/change.js', config);
  }

  function cartClear() {
    var config = getDefaultRequestConfig();
    config.method = 'POST';

    return fetchJSON('/cart/clear.js', config);
  }

  function cartUpdate(body) {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify(body);

    return fetchJSON('/cart/update.js', config);
  }

  function cartShippingRates() {
    return fetchJSON('/cart/shipping_rates.json', getDefaultRequestConfig());
  }

  function key(key) {
    if (typeof key !== 'string' || key.split(':').length !== 2) {
      throw new TypeError(
        'Theme Cart: Provided key value is not a string with the format xxx:xxx'
      );
    }
  }

  function quantity(quantity) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new TypeError(
        'Theme Cart: An object which specifies a quantity or properties value is required'
      );
    }
  }

  function id(id) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new TypeError('Theme Cart: Variant ID must be a number');
    }
  }

  function properties(properties) {
    if (typeof properties !== 'object') {
      throw new TypeError('Theme Cart: Properties must be an object');
    }
  }

  function form(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
    }
  }

  function options(options) {
    if (typeof options !== 'object') {
      throw new TypeError('Theme Cart: Options must be an object');
    }

    if (
      typeof options.quantity === 'undefined' &&
      typeof options.properties === 'undefined'
    ) {
      throw new Error(
        'Theme Cart: You muse define a value for quantity or properties'
      );
    }

    if (typeof options.quantity !== 'undefined') {
      quantity(options.quantity);
    }

    if (typeof options.properties !== 'undefined') {
      properties(options.properties);
    }
  }

  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */

  /**
   * Returns the state object of the cart
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function getState() {
    return cart();
  }

  /**
   * Returns the index of the cart line item
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the index number of the line item
   */
  function getItemIndex(key$$1) {
    key(key$$1);

    return cart().then(function(state) {
      var index = -1;

      state.items.forEach(function(item, i) {
        index = item.key === key$$1 ? i + 1 : index;
      });

      if (index === -1) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }

      return index;
    });
  }

  /**
   * Fetches the line item object
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function getItem(key$$1) {
    key(key$$1);

    return cart().then(function(state) {
      var lineItem = null;

      state.items.forEach(function(item) {
        lineItem = item.key === key$$1 ? item : lineItem;
      });

      if (lineItem === null) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }

      return lineItem;
    });
  }

  /**
   * Add a new line item to the cart
   * @param {number} id The variant's unique ID
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function addItem(id$$1, options$$1) {
    options$$1 = options$$1 || {};

    id(id$$1);

    return cartAdd(id$$1, options$$1.quantity, options$$1.properties);
  }

  /**
   * Add a new line item to the cart from a product form
   * @param {object} form DOM element which is equal to the <form> node
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  function addItemFromForm(form$$1) {
    form(form$$1);

    var formData = new FormData(form$$1);
    id(parseInt(formData.get('id'), 10));

    return cartAddFromForm(formData);
  }

  /**
   * Changes the quantity and/or properties of an existing line item.
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function updateItem(key$$1, options$$1) {
    key(key$$1);
    options(options$$1);

    return getItemIndex(key$$1).then(function(line) {
      return cartChange(line, options$$1);
    });
  }

  /**
   * Removes a line item from the cart
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function removeItem(key$$1) {
    key(key$$1);

    return getItemIndex(key$$1).then(function(line) {
      return cartChange(line, { quantity: 0 });
    });
  }

  /**
   * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  function clearItems() {
    return cartClear();
  }

  /**
   * Gets all cart attributes
   * @returns {Promise} Resolves with the cart attributes object
   */
  function getAttributes() {
    return cart().then(function(state) {
      return state.attributes;
    });
  }

  /**
   * Sets all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  function updateAttributes(attributes) {
    return cartUpdate({ attributes: attributes });
  }

  /**
   * Clears all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  function clearAttributes() {
    return getAttributes().then(function(attributes) {
      for (var key$$1 in attributes) {
        attributes[key$$1] = '';
      }
      return updateAttributes(attributes);
    });
  }

  /**
   * Gets cart note
   * @returns {Promise} Resolves with the cart note string
   */
  function getNote() {
    return cart().then(function(state) {
      return state.note;
    });
  }

  /**
   * Sets cart note
   * @returns {Promise} Resolves with the cart state object
   */
  function updateNote(note) {
    return cartUpdate({ note: note });
  }

  /**
   * Clears cart note
   * @returns {Promise} Resolves with the cart state object
   */
  function clearNote() {
    return cartUpdate({ note: '' });
  }

  /**
   * Get estimated shipping rates.
   * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
   */
  function getShippingRates() {
    return cartShippingRates();
  }

  exports.getState = getState;
  exports.getItemIndex = getItemIndex;
  exports.getItem = getItem;
  exports.addItem = addItem;
  exports.addItemFromForm = addItemFromForm;
  exports.updateItem = updateItem;
  exports.removeItem = removeItem;
  exports.clearItems = clearItems;
  exports.getAttributes = getAttributes;
  exports.updateAttributes = updateAttributes;
  exports.clearAttributes = clearAttributes;
  exports.getNote = getNote;
  exports.updateNote = updateNote;
  exports.clearNote = clearNote;
  exports.getShippingRates = getShippingRates;

  return exports;

}({}));

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

const moneyFormat = '${{amount}}';

/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} format - shop money_format setting
 * @return {String} value - formatted value
 */
function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || moneyFormat;

  function formatWithDelimiters(
    number,
    precision = 2,
    thousands = ',',
    decimal = '.'
  ) {
    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    );
    const centsAmount = parts[1] ? decimal + parts[1] : '';

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

/**********Theme Code *************/

var context = {
  cart: '/cart',
  products: '/products/',
  home: '/'
}

document.addEventListener('DOMContentLoaded', function(){

  var tspan = SVG.find('tspan');

  if(window.location.pathname.includes('/products/')){
    var form = document.querySelector('[data-product-form]');
    console.log(form);
    if(form.addEventListener){
      form.addEventListener("submit", 
      function(e){
        var self = this;
        e.preventDefault();
        Shopify.theme.cart.addItemFromForm(self).then(item => {
          Shopify.theme.cart.getState().then(state => {
            tspan.text(state.item_count + '');
          })
        })
      }, false); 
    }
  }

  if(window.location.pathname === context.cart) {
    var lineItems = document.querySelectorAll('[data-line-item]');
    lineItems.forEach(lineItem => {
      var key = lineItem.getAttribute('data-line-key');
      lineItem.querySelector('[data-cart-item-remove]')
      .addEventListener('click',function(e){
        e.preventDefault();
        Shopify.theme.cart.removeItem(key).then(state => { 
          tspan.text(state.item_count + '');
          cartSubtotal.textContent = 
            formatMoney(state.total_price) + " " + state.currency
          if(state.item_count == 0) {
            /* Initialize DOM elements */
            var page = document.querySelector('[data-cart-page]');
            var cartSummary = document.querySelector('.cart-content__summary');
            var checkoutSummary = document.querySelector('.cart-page__summary');

            /* Remove cart table and checkout summary */
            cartSummary.remove();
            checkoutSummary.remove();

            /** HEADING */
            var heading = document.createElement('h3');
            heading.className = 'mb-4';
            var text = 'Your shopping bag is empty';
            heading.textContent = text;

            /** LINK */
            var link = document.createElement('a');
            link.className = 'btn btn-outline-dark';
            link.setAttribute('href','/');
            var linkTextNode = document.createTextNode('Continue Shopping');
            link.appendChild(linkTextNode);

            /** CONTAINER */
            var container = document.createElement('div');
            container.className = 'cart-page__empty-content text-center';
            container.appendChild(heading);
            container.appendChild(link);

            /* Append container */
            page.appendChild(container);
          }
          else {
            lineItem.remove();
          }
        });
      });
    });
    var cartSubtotal = document.querySelector('[data-cart-total]');
    var inputs = document.querySelectorAll('[data-qty-input]');
    inputs.forEach(input => {
      var self = input;
      input.addEventListener('change', function(){
        var value = parseInt(this.value);
        var lineItem = self.closest('[data-line-item]');
        var key = lineItem.getAttribute('data-line-key');
        Shopify.theme.cart.updateItem(key, { quantity: value }).then(state => {
          /* Change bubble count */
          tspan.innerHTML = state.item_count;
          /* Find specific item */
          var item = state.items.find(item => item.key === key);
          /* Print quantity of specific item */
          console.log(`The item with key '${key}' now has quantity ${item.quantity}`);
          /* Update total */
          cartSubtotal.textContent = 
            formatMoney(state.total_price) + " " + state.currency;
          tspan.text(state.item_count + '')
        });
      });
    });
  }

  if(window.location.pathname === context.home || window.location.pathname.includes(context.products)) {
    var carouselItem = document.querySelector('.carousel-item');
    carouselItem.classList.toggle('active');
    $('.carousel').carousel({
      interval: 1500
    });
  }

  if(window.location.pathname.includes(context.products)) {
    var productDisplay = document.querySelector('.product-display');
    var productCarouselItem = productDisplay.querySelector('.carousel-item');
    var square = productDisplay.querySelector(".square");
    square.style.width = `${square.parentElement.offsetWidth}px`;
    content.style.height = `${square.offsetWidth}px`;
    productCarouselItem.classList.toggle('active');
    $('.square .carousel').carousel({
      interval: 2000
    });
  }

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
});

