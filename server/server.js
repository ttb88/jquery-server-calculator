const express = require('express');

const app = express();
let bodyParser = require('body-parser');
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});



// array of objects that will hold the calculations
let calculations = [];


// recieve the inputs of the calculator on the DOM
app.post('/post-calculation', (req, res) => {
    let calcInput = req.body;
    console.log(calcInput);
    calcInput.calcTotal = executeCalculation(calcInput);
    calculations.push(calcInput);
    res.sendStatus(201);
});


// send the current contents of the 'calculations' array of objects
app.get('/get-calculation', (req, res) => {
    res.send(calculations);
});


// calculate the total of what was inputed and submitted from calculator on DOM
function executeCalculation(calcInput) {
    calcInput.inputFirst = Number(calcInput.inputFirst);
    calcInput.inputSecond = Number(calcInput.inputSecond);

    if (calcInput.calcMethod == '+') {
        return calcInput.inputFirst + calcInput.inputSecond;
    }
    if (encodeURI(calcInput.calcMethod) == '%E2%88%92') {
        return calcInput.inputFirst - calcInput.inputSecond;
    }
    if (encodeURI(calcInput.calcMethod) == '%C3%97') {
        return calcInput.inputFirst * calcInput.inputSecond;
    }
    if (encodeURI(calcInput.calcMethod) == "%C3%B7") {
        return calcInput.inputFirst / calcInput.inputSecond;
    }
}