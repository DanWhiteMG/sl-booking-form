document.getElementById('tenancy-duration').addEventListener("change", getWeeklyCost);
document.getElementById('booking-type').addEventListener("change", getWeeklyCost);
document.getElementById('payment-options').addEventListener("change", getWeeklyCost);

document.getElementById('weekly-cost').readOnly = true;
document.getElementById('annual-cost').readOnly = true;

// Add energy charge field and populate with cost

const ENERGY_CHARGE = "£99";

document.getElementById('energy-charge').readOnly = true;
document.getElementById('energy-charge').value = ENERGY_CHARGE;

function getTenancyRef() {

    var tenancyRef = 0;

    // Get references to form <select> values
    var selectedTenancyDuration = document.getElementById('tenancy-duration').value;

    // Associated array for tenancy lengths
    var tenancy_duration = new Array();
        tenancy_duration["46 Weeks"] = 0;
        tenancy_duration["50 Weeks"] = 15;

    // Capture array reference and pass to variable
    tenancyRef = tenancy_duration[selectedTenancyDuration];

    return tenancyRef;

}

function getBookingRef() {

    var bookingRef = 0;

    // Get references to form <select> values
    var selectedBookingType = document.getElementById('booking-type').value;

    // Associated array for first booker / rebooker
    var booking_type = new Array();
        booking_type["First Booking"] = 10;
        booking_type["Rebooker"] = 20;

    // Capture selected form values
    bookingRef = booking_type[selectedBookingType];

    return bookingRef;
}

function getPaymentOption() {

    var paymentOption = 0;

    // Get references to form <select> values
    var selectedPaymentOption = document.getElementById('payment-options').value;

    // Associated array for payment options
    var payment_option = new Array();
        payment_option["One-off payment"] = 10;
        payment_option["Monthly instalments"] = 20;
        payment_option["Termly instalments"] = 30;

    // Capture selected form values
    paymentOption = payment_option[selectedPaymentOption];

    return paymentOption;
}

function getWeeklyCost() {

    var weeklyCost = 0;
    var costNumber = 0;

    // Set variables for weekly costs to display based on chosen form options
    var first46 = document.getElementById('label-wc-46').textContent;
    var first50 = document.getElementById('label-wc-50').textContent;
    var rebooker46 = document.getElementById('label-wc-50-r').textContent;
    var rebooker50 = document.getElementById('label-wc-46-r').textContent;

    // Calculate weeklyCost by adding array references for tenancy duration and
    // booking type together
    var weeklyCost = getTenancyRef() + getBookingRef();

    // Set actual £ cost value of 'weekly-cost' input from possible prices
    // determined in Webflow CMS
    if (weeklyCost == 10) {
        document.getElementById('weekly-cost').value = `£${first46}`;
        costNumber = first46;
    } else if (weeklyCost == 25) {
        document.getElementById('weekly-cost').value = `£${first50}`;
        costNumber = first50;
    } else if (weeklyCost == 20) {
        document.getElementById('weekly-cost').value = `£${rebooker46}`;
        costNumber = rebooker46;
    } else {
        document.getElementById('weekly-cost').value = `£${rebooker50}`;
        costNumber = rebooker50;
    }

    return costNumber;

};

document.getElementById("msl-next").addEventListener("click", getAnnualCost);

function getAnnualCost() {

    var annualCost = 0;

    var weeklyCost = getWeeklyCost();

    var tenancyRef = getTenancyRef();

    // Convert weeklyCost from a string to integer for calculations
    parseInt(weeklyCost);

    // Calculate annual cost by multiplying weekly cost by number of weeks
    if (tenancyRef == 0) {
        annualCost = weeklyCost * 46;
    } else {
        annualCost = weeklyCost * 50;
    }

    // Set actual £ cost value of 'annual-cost' input
    document.getElementById('annual-cost').value = `£${annualCost}`;

    return annualCost;

};

document.getElementById('msl-next').addEventListener("click", getInstalmentPlan);

function getInstalmentPlan() {

    // Gives 46 or 50 weeks tenancy duration
    var tenancyRef = getTenancyRef();

    // Gives one-off payment (1), monthly (8 or 10) or termly (4)
    var paymentOption = getPaymentOption();

    // Calculate instalmentPlan by adding array references for tenancy duration
    // and payment option together
    var instalmentPlan = tenancyRef + paymentOption;

    console.log(`No. of instalments ref:${instalmentPlan}`);

    // Calculate no. of instalments based on value of instalmentPlan
    var noOfInstalments = 0;

    if (instalmentPlan == 10 || instalmentPlan == 25) {
        noOfInstalments = 1;
    } else if (instalmentPlan == 30 || instalmentPlan == 45) {
        noOfInstalments = 4;
    } else if (instalmentPlan == 20) {
        noOfInstalments = 8;
    } else {
        noOfInstalments = 10;
    }

    console.log(`No of instalments:${noOfInstalments}`);

    return noOfInstalments;

};

document.getElementById('payment-options').addEventListener("change", generateInstalmentPlan);
document.getElementById('tenancy-duration').addEventListener("change", generateInstalmentPlan);

function generateInstalmentPlan() {

    // Receive instalments number from getInstalmentPlan() function;

    var noOfInstalments = getInstalmentPlan();

    var annualCost = getAnnualCost();

    console.log(`No of instalments (passed from func):${noOfInstalments}`);

    // As below function is fired each time 'payment-options' <select> is changed, check
    // to see if inputs have already been created, then remove existing inputs

    var c = document.getElementById('instalment-grid');

    while (c.hasChildNodes()) {
        c.removeChild(c.firstChild);
    }

    // Create <input> for each instalment and add below values as applicable

    // Calculate amounts for each instalment
    // Types of instalment plan:
    // One-off payment = 1 instalment @ 100%
    // Termly instalments = 4 instalments @ 15%, 33%, 30%, 22%
    // Monthly instalments = 8 instalments @ 12.5% each or
    // 10 instalments @ 10% each (depending on 46 or 50 weeks)

    var oneInstalment = [];
    oneInstalment.push(annualCost);

    var fourInstalments = [];
    fourInstalments.push(annualCost * 0.15);
    fourInstalments.push(annualCost * 0.33);
    fourInstalments.push(annualCost * 0.30);
    fourInstalments.push(annualCost * 0.22);

    var eightInstalments = [];
        for (let i = 1; i<= noOfInstalments; i++) {
            eightInstalments.push(annualCost * 0.125);
        }

    var tenInstalments = [];
    for (let i = 1; i<= noOfInstalments; i++) {
        tenInstalments.push(annualCost * 0.1);
    }

    function createInputs(number, arrayName) {

        for (let i = 1; i <= number; i++) {
            var instalmentList = document.getElementById('instalment-grid');
            instalmentList.insertAdjacentHTML('beforeend', `<div class="field-wrapper"><label for="Instalment-${i}" class="booking-field-label booking name">INSTALMENT&nbsp;${i}</label><input type="text" maxlength="256" name="Instalment-${i}" data-name="Instalment ${i}" id="instalment-${i}" class="instalment w-input" readonly=""></div>`);
            var instalment = arrayName[i-1];
            var instalmentTwoDecimals = instalment.toFixed(2);
            console.log(instalmentTwoDecimals);
            document.getElementById(`instalment-${i}`).value = `£${arrayName[i-1]}`;
        }
    }

    // Run createInputs() function and pass associated values into inputs
    // from above arrays based on number of instalments required

    if (noOfInstalments == 1) {
        createInputs(noOfInstalments, oneInstalment);
    } else if (noOfInstalments == 4) {
        createInputs(noOfInstalments, fourInstalments);
    } else if (noOfInstalments == 8) {
        createInputs(noOfInstalments, eightInstalments);
    } else {
        createInputs(noOfInstalments, tenInstalments);
    }

};