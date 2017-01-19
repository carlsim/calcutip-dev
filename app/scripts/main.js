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

      /**
       * Member variables
       */
      this.inputBillPriceVal = 0;
      this.inputBillPriceVal = 0;
      this.inputTipPctVal = 0;
      this.inputNumPeopleVal = 0;
      this.inputSalesTaxVal = 0;
      this.taxVal = 0;

      /**
       * Member methods
       */
      this.onLoad = this.onLoad();
      this.updateValues = this.updateValues.bind(this);
      this.toggleTotalHide = this.toggleTotalHide.bind(this);
      this.toggleInputHide = this.toggleInputHide.bind(this);

      this.calculateTotalTip = this.calculateTotalTip.bind(this);
      this.calculateTotalOverall = this.calculateTotalOverall.bind(this);
      this.calculateTotalTax = this.calculateTotalTax.bind(this);
      this.calculateTotalTipTaxInc = this.calculateTotalTipTaxInc.bind(this);
      this.calculateTotalOverallTaxInc = this.calculateTotalOverallTaxInc.bind(this);

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
      if(this.totalMoreArea.classList.contains("hidden")){
        this.totalMoreBtn.innerHTML = 'Less Bill Info';
        this.totalMoreArea.classList.toggle("hidden");
      }else{
        this.totalMoreBtn.innerHTML = 'More Bill Info';
        this.totalMoreArea.classList.toggle("hidden");
      }
      console.log("Clicking on toggle hide");
    }

    toggleInputHide(evt) {
      if(this.inputMoreArea.classList.contains("hidden")){
        this.inputMoreBtn.innerHTML = 'Less Info';
        this.inputMoreArea.classList.toggle("hidden");
      }else{
        this.inputMoreBtn.innerHTML = 'More Info';
        this.inputMoreArea.classList.toggle("hidden");
      }
      console.log("input Clicking on toggle hide");
    }

    updateValues(evt) {
      this.inputBillPriceVal = this.checkIsNaN(parseFloat(this.inputBillPrice.value));
      this.inputTipPctVal = this.checkIsNaN(parseFloat(this.inputTipPct.value));
      this.inputNumPeopleVal = this.checkIsNaN(parseFloat(this.inputNumPeople.value));
      this.inputSalesTaxVal = this.checkIsNaN(parseFloat(this.inputSalesTax.value));

      //Determine if num of people is 0 to avoid dividing by 0
      this.inputNumPeopleVal = this.inputNumPeopleVal > 0 ? this.inputNumPeopleVal : 1;

      //Determine Tax
      this.taxVal = (this.inputBillPriceVal) - (this.inputBillPriceVal / ((this.inputSalesTaxVal * 0.01) + 1));

      //Do final calculations to find final values
      this.totalTip.innerHTML = this.calculateTotalTip();
      this.totalOverall.innerHTML = this.calculateTotalOverall();
      this.totalTax.innerHTML = this.calculateTotalTax();
      this.totalTipTaxInc.innerHTML = this.calculateTotalTipTaxInc();
      this.totalOverallTaxInc.innerHTML = this.calculateTotalOverallTaxInc();
    }

    checkIsNaN(num){
      return isNaN(num) ? 0 : num;
    }

    calculateTotalTip() {
      let totalNoTax = this.inputBillPriceVal - this.taxVal;
      let finalTotalTip = (totalNoTax * (this.inputTipPctVal * 0.01)) / this.inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }

    calculateTotalOverall() {
      let totalNoTax = this.inputBillPriceVal - this.taxVal;
      let finalTotalTip = totalNoTax * (this.inputTipPctVal * 0.01);

      let finalTotal = (this.inputBillPriceVal + finalTotalTip) / this.inputNumPeopleVal;
      
      return parseFloat(finalTotal).toFixed(2);
    }
    calculateTotalTax() {  
      return parseFloat(this.taxVal).toFixed(2);
    }
    calculateTotalTipTaxInc() {
      let finalTotalTip = (this.inputBillPriceVal * ((this.inputTipPctVal) * 0.01))/this.inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }
    calculateTotalOverallTaxInc() {
      let finalTotalTip = (this.inputBillPriceVal * ( 1 + (this.inputTipPctVal) * 0.01))/this.inputNumPeopleVal;
      
      return parseFloat(finalTotalTip).toFixed(2);
    }
  }
  /**
   * Create the object
   */
  let calcutipObj = new Calcutip();
})();
