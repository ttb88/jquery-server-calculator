$(document).ready(onReady);

let operator, inputFirst, inputSecond, currentTotal;
let inputNumberConcatenate = '';
// let inputFirst;
// let inputSecond;
// let currentTotal;

function onReady() {
    console.log('jquery is running');

    // get the current content from 'calculations' array of objects on the server and append to DOM
    getCalculation();

    // will store the current calculation operator to variable 'operator' based on button clicked on DOM
    $('.operator-btn').on('click', operatorClicked); 

    // recives all number buttons that are clicked
    $('.number-btn').on('click', numberClicked);

    // will run upon click of the equals button on DOM
    $('#equals-submit-btn').on('click', submitCalculation);

    // clear user input fields when 'C' button is clicked
    $('#clear-btn').on('click', function () {
        $('#calc-display-text').empty();
    });

    // up click of delete history button the array of objects will be deleted on server
    $('#clear-history-btn').on('click', deleteHistory);

}

// store each clicked number button to variable 'inputNumberConcatenate' and append to DOM
function numberClicked() {
    console.log('number button clicked');
    if (currentTotal == $('#calc-display-text').text() && operator == '') {
        alert('Either clear or click operator to continue.') 
    }
    else {
        inputButtonText = $(this).text();
        $('#calc-display-text').append(inputButtonText);
        inputNumberConcatenate += inputButtonText;
        console.log(inputNumberConcatenate);
    }
}

// store the clicked operator button to variable 'operator' and append to DOM
function operatorClicked () {
    operator = $(this).text();
    console.log('calc operator is:', $(this).text());

    if ($('#calc-display-text').text()) {
        if (inputNumberConcatenate == '') {
            inputFirst = currentTotal;
            appendOperator();
        }
        else {
            appendOperator();
            // sets current string of 'inputNumberConcatenate' to 'inputFirst'
            inputFirst = inputNumberConcatenate;
            //clears out 'inputNumberConcatenate' for next number input
            inputNumberConcatenate = '';
        }

        function appendOperator() {
            // appends operator to DOM
            $('#calc-display-text').append(`
        <span id="operator-text">
        ${operator}
        </span>`)
        } 

    }
    else {
        alert('Please enter a number first.') 
    }
    
}



// will send to server the inputs from calculator on DOM
function submitCalculation() {
    // if an operator or second number has NOT been chosen an alert will display
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

        $('#calc-display-text').empty();
        inputNumberConcatenate = ''  
    }
}



// get the current content from 'calculations' array of objects on the server and append to DOM
function getCalculation() {
    
    $.ajax({
        method: 'GET',
        url: '/get-calculation'
    }).then(function (response) {
        operator = '';
        console.log(currentTotal);

        $('#calc-output-list').empty();
        console.log(response);

        response.forEach(function (calculations) {
            $('#calc-display-text').empty();
            $('#calc-display-text').append(`${parseFloat(calculations.calcTotal.toFixed(5))}
        `)
            $('#calc-output-list').append(`
        <li>${calculations.inputFirst} ${calculations.operator} ${calculations.inputSecond} &#x0003D ${parseFloat(calculations.calcTotal.toFixed(5))} 
        `); 
            currentTotal = calculations.calcTotal;
            console.log(currentTotal);
        });
    })  
}


// delete array of objects on server
function deleteHistory() {
    $.ajax({
        url: '/delete-history',
        type: 'DELETE',
    }).then(function (response) {
        console.log(response);
        $('#calc-display-text').empty();
        console.log(currentTotal);
        $('#calc-output-list').empty();
    }) 
}
