$(document).ready(onReady);

let operator, inputFirst, inputSecond, currentTotal, calcDisplay;
let inputNumberConcatenate = '';


function onReady() {
    console.log('jquery is running');

    // get the current content from 'calculations' array of objects on the server and append to DOM
    getCalculation();

    // receives all operator buttons that are clicked on DOM and runs function 'operatorClicked'
    $('.operator-btn').on('click', operatorClicked);

    // receives all number buttons that are clicked on DOM and runs function 'numberClicked'
    $('.number-btn').on('click', numberClicked);

    // receives '=' button when clicked on DOM and runs function 'submitCalculation'
    $('#equals-submit-btn').on('click', submitCalculation);

    // clears user input fields when 'C' button is clicked on DOM
    $('#clear-btn').on('click', function () {
        $('#calc-display-text').empty();
        operator = ''
    });

    // upon click of 'Delete History' button on DOM the array of objects will be deleted on server
    $('#clear-history-btn').on('click', deleteHistory);

    // receives a list item when clicked on DOM and runs function rerunCalculation
    $('#calc-output-list').on('click', '.calc-list-item', rerunCalculation);
}



// receives number button clicked and runs through conditional 
function numberClicked() {
    console.log('number button clicked');
    calcDisplay = $('#calc-display-text')
    //alert displayed if number button is clicked while a prior calculation total is still in calulator display
    if (currentTotal == calcDisplay.text() && operator == '') {
        alert('Either click "C" to clear or an operator button to continue.')
    }
    //if calculator display is clear or an operator has been set the clicked number button will append to display
    else {
        inputNumberButton = $(this).text();
        calcDisplay.append(inputNumberButton);
        //each click concatenates and stores into the variable 'inputNumberConcatenate'
        inputNumberConcatenate += inputNumberButton;
        console.log(inputNumberConcatenate);
    }
}



// receive operator button clicked and run through series of conditionals
function operatorClicked() {
    let el = $(this).text();
    calcDisplay = $('#calc-display-text');
    console.log('calc operator is:', $(this).text());

    // if calculator display isn't empty 
    if (calcDisplay.text()) {
        // if calculator display contains previous total it will set 'currenTotal' to 'inputFirst (allows previous total to be futher calculated)
        if (inputNumberConcatenate == '') {
            inputFirst = currentTotal;
            appendOperator();
        }
        // prevents a second operator button from being captured
        else if (operator !== '') {
            alert('Please click the "=" button to complete calculation.')
        }
        // when NOT attempting to calculate on top of a previous total
        else {
            appendOperator();
            // sets current string of 'inputNumberConcatenate' to 'inputFirst'
            inputFirst = inputNumberConcatenate;
            //clears out 'inputNumberConcatenate' for next number input
            inputNumberConcatenate = '';
        }
    }
    // if calculator display is empty, an alert will display
    else {
        alert('Please enter a number first.')
    }

    

    // appends operator to calculator display
    function appendOperator() {
        operator = el;
        calcDisplay.append(`
        <span id="operator-text">
        ${operator}
        </span>`)
    }

}



// will send to server the inputs from calculator on DOM only if all information is included
function submitCalculation() {
    // if an operator or second number has NOT been set an alert will display
    if (operator == '' || inputNumberConcatenate == '') {
        alert('Your calculation is not complete.')
    }
    else {
        // sets current string of 'inputNumberConcatenate' to 'inputSecond'
        inputSecond = inputNumberConcatenate;
        console.log('equals/submit button clicked');

        $.ajax({
            method: 'POST',
            url: '/post-calculation',
            data: {
                inputFirst: inputFirst,
                operator: operator,
                inputSecond: inputSecond
            }
        }).then(function () {
            // get the current content from 'calculations' array of objects on the server and append to DOM
            getCalculation();
        })

    }
}



// get the current content from 'calculations' array of objects on the server and append to DOM
function getCalculation() {

    $.ajax({
        method: 'GET',
        url: '/get-calculation'
    }).then(function (response) {
        console.log('Calculations:', response);
        operator = '';
        inputNumberConcatenate = ''
        calcDisplay = $('#calc-display-text');
        
        $('#calc-output-list').empty();

        // for each loop through calculations array of objects and append to DOM
        response.forEach(function (calculations, i) {
            let calcTotalParsed = parseFloat(calculations.calcTotal.toFixed(2));
            let inputFirstParsed = parseFloat(calculations.inputFirst.toFixed(2));
            let inputSecondParsed = parseFloat(calculations.inputSecond.toFixed(2));
            calcDisplay.empty();

            calcDisplay.append(`${calcTotalParsed}`);

            $('#calc-output-list').append(`
            <li class="calc-list-item" data-index="${i}">${inputFirstParsed} ${calculations.operator} ${inputSecondParsed}</li>`);

            currentTotal = calculations.calcTotal;
        });
    })
}



// delete entire calcualtion history which is the 'calculations' array of objects on the server
function deleteHistory() {
    $.ajax({
        url: '/delete-history',
        type: 'DELETE',
    }).then(function (response) {
        console.log(response);
        $('#calc-display-text').empty();
        $('#calc-output-list').empty();
    })
}



// receives the index number from list item clicked using .data() and checks back with server to grab the proper calculation and display on DOM
function rerunCalculation() {
    let calcIndex = $(this).data().index;
    calcDisplay = $('#calc-display-text');
    $(this).css('color', '#00a59a');      
    $(this).siblings().css('color', 'black');
  
    $.ajax({
        method: 'GET',
        url: '/get-calculation'
    }).then(function (response) {
        calcDisplay.empty();
        let calcTotalParsed = parseFloat(response[calcIndex].calcTotal.toFixed(2));
        calcDisplay.append(`${calcTotalParsed}`);
    })
}
