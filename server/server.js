const express = require('express');

const app = express();
let bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});



// array of objects that will hold the calculations
let calculations = [];


// receive the inputs of the calculator on the DOM
app.post('/post-calculation', (req, res) => {
    let calcInput = req.body;
    console.log(calcInput);
    calcInput.calcTotal = executeCalculation(calcInput);
    calculations.push(calcInput);
    res.sendStatus(201);
});


// send the current contents of 'calculations'
app.get('/get-calculation', (req, res) => {
    res.send(calculations);
});


// calculate the total of what was submitted
function executeCalculation(calcInput) {
    calcInput.inputFirst = Number(calcInput.inputFirst);
    calcInput.inputSecond = Number(calcInput.inputSecond);

    if (calcInput.operator == '+') {
        return calcInput.inputFirst + calcInput.inputSecond;
    }
    if (encodeURI(calcInput.operator) == '%E2%88%92') {
        return calcInput.inputFirst - calcInput.inputSecond;
    }
    if (encodeURI(calcInput.operator) == '%C3%97') {
        return calcInput.inputFirst * calcInput.inputSecond;
    }
    if (encodeURI(calcInput.operator) == "%C3%B7") {
        return calcInput.inputFirst / calcInput.inputSecond;
    }
}

// clear the contents from 'calculations'
app.delete('/delete-history', (req, res) => {
    calculations = [];
    res.send('history has been cleared on server');
});

console.log('calculations', calculations)