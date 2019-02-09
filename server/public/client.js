$(document).ready(onReady);

let operator;

function onReady() {
    console.log('jquery is running');

    // get the current content from 'calculations' array of objects on the server and append to DOM
    getCalculation();

    // will store the current calculation operator to variable 'operator' based on button clicked on DOM
    $('.operator-btn').on('click', function () {
        console.log('calc operator is:', $(this).text());
        operator = $(this).text();
        $(this).css('background-color', '#5c918c');
    });

    // will run upon click of the equals button on DOM
    $('#equals-submit-btn').on('click', submitCalculation);

    // clear user input fields when 'C' button is clicked
    $('#clear-btn').on('click', function () {
        $('#calc-input-row input').val('');
        $('button').css('background-color', 'white');
    })
}



// will send to server the inputs from calculator on DOM
function submitCalculation() {
    console.log('equals/submit button clicked');

    $.ajax({
        method: 'POST',
        url: '/post-calculation',
        data: {
            inputFirst: $('#number-first-input').val(),
            operator: operator,
            inputSecond: $('#number-second-input').val()
        }
    }).then(function () {
        // get the current content from 'calculations' array of objects on the server and append to DOM
        getCalculation();
    })

    $('#calc-input-row input').val('');
    $('button').css('background-color', 'white');
}



// get the current content from 'calculations' array of objects on the server and append to DOM
function getCalculation() {
    $.ajax({
        method: 'GET',
        url: '/get-calculation'
    }).then(function (response) {

        $('#calc-output-list').empty();
        console.log(response);

        response.forEach(function (calculations) {
            $('#calc-output-number').empty();
            $('#calc-output-number').append(`${calculations.calcTotal}
        `)
            $('#calc-output-list').append(`
        <li>${calculations.inputFirst} ${calculations.operator} ${calculations.inputSecond} &#x0003D ${calculations.calcTotal} 
        `);

        });
    })
}