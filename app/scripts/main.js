/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  class Calcutip {
    constructor(){
      /**
       * Selectors for the total area
       */
      this.totalTip = document.querySelector(".total-tip");
      this.totalOverall = document.querySelector(".total-overall");
      this.totalTax = document.querySelector(".total-tax");
      this.totalTipTaxInc = document.querySelector(".total-tip-tax-inc");
      this.totalOverallTaxInc = document.querySelector(".total-overall-tax-inc");

      this.totalMoreBtn = document.querySelector(".total__more-btn");
      this.totalMoreArea = document.querySelector(".total__more-area");

      this.inputMoreBtn = document.querySelector(".input-area__more-btn");
      this.inputMoreArea = document.querySelector(".input-area__more-area");

      /**
       * Selectors for the input form
       */
      this.inputBillPrice = document.querySelector(".input-bill-price input");
      this.inputTipPct = document.querySelector(".input-tip-pct input");
      this.inputNumPeople = document.querySelector(".input-num-people input");
      this.inputSalesTax = document.querySelector(".input-sales-tax input");

      this.onLoad = this.onLoad();
      this.updateValues = this.updateValues.bind(this);
      this.toggleTotalHide = this.toggleTotalHide.bind(this);
      this.toggleInputHide = this.toggleInputHide.bind(this);

      this.addEventListeners();
    }

    addEventListeners() { 
      document.addEventListener("onload", this.onLoad);

      this.totalMoreBtn.addEventListener("click", this.toggleTotalHide);
      this.inputMoreBtn.addEventListener("click", this.toggleInputHide);

      this.inputBillPrice.addEventListener("input", this.updateValues);
      this.inputTipPct.addEventListener("input", this.updateValues);
      this.inputNumPeople.addEventListener("input", this.updateValues);
      this.inputSalesTax.addEventListener("input", this.updateValues);
    }

    onLoad() { 
      this.totalMoreArea.classList.toggle("hidden");
      this.inputMoreArea.classList.toggle("hidden");
      this.updateValues();
    }

    toggleTotalHide(evt) {
      this.totalMoreArea.classList.toggle("hidden");
      console.log("Clicking on toggle hide");
    }

    toggleInputHide(evt) {
      this.inputMoreArea.classList.toggle("hidden");
      console.log("input Clicking on toggle hide");
    }

    updateValues(evt) {
      let inputBillPriceVal = this.checkIsNaN(parseFloat(this.inputBillPrice.value));
      let inputTipPctVal = this.checkIsNaN(parseFloat(this.inputTipPct.value));
      let inputNumPeopleVal = this.checkIsNaN(parseFloat(this.inputNumPeople.value));
      let inputSalesTaxVal = this.checkIsNaN(parseFloat(this.inputSalesTax.value));

      //Determine if num of people is 0 to avoid dividing by 0
      inputNumPeopleVal = inputNumPeopleVal > 0 ? inputNumPeopleVal : 1;

      this.totalTip.innerHTML = this.calculateTotalTip(
        inputBillPriceVal,
        inputTipPctVal,
        inputNumPeopleVal,
        inputSalesTaxVal
      );

      this.totalOverall.innerHTML = this.calculateTotalOverall(
        inputBillPriceVal,
        inputTipPctVal,
        inputNumPeopleVal,
        inputSalesTaxVal
      );

      this.totalTax.innerHTML = this.calculateTotalTax(
        inputBillPriceVal,
        inputTipPctVal,
        inputNumPeopleVal,
        inputSalesTaxVal
      );

      this.totalTipTaxInc.innerHTML = this.calculateTotalTipTaxInc(
        inputBillPriceVal,
        inputTipPctVal,
        inputNumPeopleVal,
        inputSalesTaxVal
      );

      this.totalOverallTaxInc.innerHTML = this.calculateTotalOverallTaxInc(
        inputBillPriceVal,
        inputTipPctVal,
        inputNumPeopleVal,
        inputSalesTaxVal
      );
    }

    checkIsNaN(num){
      return isNaN(num) ? 0 : num;
    }

    calculateTotalTip(inputBillPriceVal, inputTipPctVal, inputNumPeopleVal, inputSalesTaxVal) {
      let tax = (inputBillPriceVal) - (inputBillPriceVal / ((inputSalesTaxVal * 0.01) + 1));
      let totalNoTax = inputBillPriceVal - tax;
      let finalTotalTip = (totalNoTax * (inputTipPctVal * 0.01)) / inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }
    calculateTotalOverall(inputBillPriceVal, inputTipPctVal, inputNumPeopleVal, inputSalesTaxVal) {
      let tax = (inputBillPriceVal) - (inputBillPriceVal / ((inputSalesTaxVal * 0.01) + 1));
      let totalNoTax = inputBillPriceVal - tax;
      let finalTotalTip = totalNoTax * (inputTipPctVal * 0.01);

      let finalTotal = (inputBillPriceVal + finalTotalTip) / inputNumPeopleVal;;
      
      return parseFloat(finalTotal).toFixed(2);
    }
    calculateTotalTax(inputBillPriceVal, inputTipPctVal, inputNumPeopleVal, inputSalesTaxVal) {
      let tax = (inputBillPriceVal) - (inputBillPriceVal / ((inputSalesTaxVal * 0.01) + 1));
      
      return parseFloat(tax).toFixed(2);
    }
    calculateTotalTipTaxInc(inputBillPriceVal, inputTipPctVal, inputNumPeopleVal, inputSalesTaxVal) {
      let finalTotalTip = (inputBillPriceVal * ((inputTipPctVal) * 0.01))/inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }
    calculateTotalOverallTaxInc(inputBillPriceVal, inputTipPctVal, inputNumPeopleVal, inputSalesTaxVal) {
      let finalTotalTip = (inputBillPriceVal * ( 1 + (inputTipPctVal) * 0.01))/inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }
  }
  /**
   * Create the object
   */
  let calcutipObj = new Calcutip();
})();
