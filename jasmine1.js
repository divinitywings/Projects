window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("calc-form");
    if (form) {
      setupIntialValues();
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        update();
      });
    }
  });
  
  function getCurrentUIValues() {
    return {
      amount: +(document.getElementById("loan-amount").value),
      years: +(document.getElementById("loan-years").value),
      rate: +(document.getElementById("loan-rate").value),
    }
  }
  
  function setupIntialValues() {
    const values  = { amount: 10000, years: 10, rate: 4.5 };
    const amountUI = document.getElementById("loan-amount");
    amountUI.value = values.amount;
    const yearsUI = document.getElementById("loan-years");
    yearsUI.value = values.years;
    const rateUI = document.getElementById("loan-rate");
    rateUI.value = values.rate;
    update();
  }
  
  function update() {
    const currentUIValues = getCurrentUIValues();
    updateMonthly(calculateMonthlyPayment(currentUIValues));
  }
  
  function calculateMonthlyPayment(values) {
    const monthlyRate = (values.rate / 100) / 12;
    const n = Math.floor(values.years * 12);
    return (
      (monthlyRate * values.amount) /
      (1 - Math.pow((1 + monthlyRate), -n))
    ).toFixed(2);
  }
  
  function updateMonthly(monthly) {
    const monthlyUI = document.getElementById("monthly-payment");
    monthlyUI.innerText = "$" + monthly;
  }

  it('should calculate the monthly rate correctly', function() {
    // ...
    const values = {
      amount: 10000,
      years: 8,
      rate: 5.8
    };
    expect(calculateMonthlyPayment(values)).toEqual('130.44');
  });
  
  
  it("should return a result with 2 decimal places", function() {
    const values = {
      amount: 10043,
      years: 8,
      rate: 5.8
    };
    expect(calculateMonthlyPayment(values)).toEqual('131.00');
  });
  
  it("should handle terribly high interest rates", function() {
    const values = {
      amount: 1000,
      years: 40,
      rate: 99
    };
    expect(calculateMonthlyPayment(values)).toEqual('82.50');
  });
  