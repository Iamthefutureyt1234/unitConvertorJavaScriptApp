// Initialize HTML elements
const converterForm = document.getElementById('converterForm');
const inputValue = document.getElementById('inputValue');
const conversionType = document.getElementById('conversionType');
const inputUnit = document.getElementById('inputUnit');
const outputUnit = document.getElementById('outputUnit');
const result = document.getElementById('result');
const resetButton = document.getElementById('resetButton');
const conversionList = document.getElementById('conversionList');
const clearHistoryButton = document.getElementById('clearHistoryButton');

const unitTypes = {
    length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    mass: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
    temperature: ['c', 'f', 'k'],
    volume: ['ml', 'l', 'gal', 'pt', 'qt'],
    speed: ['m/s', 'km/h', 'mph']
};

const conversions = {
    length: {
        mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    },
    mass: {
        mg: 0.000001, g: 0.001, kg: 1, oz: 0.028349523125, lb: 0.45359237, ton: 1000
    },
    volume: {
        ml: 0.001, l: 1, gal: 3.78541, pt: 0.473176, qt: 0.946353
    },
    speed: {
        'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704
    }
};

function populateUnitSelects() {
    const units = unitTypes[conversionType.value];
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';
    units.forEach(unit => {
        inputUnit.add(new Option(unit, unit));
        outputUnit.add(new Option(unit, unit));
    });
}

function convertUnits(value, from, to, type) {
    if (from === to) return value;
    if (type === 'temperature') {
        if (from === 'c' && to === 'f') return (value * 9/5) + 32;
        if (from === 'f' && to === 'c') return (value - 32) * 5/9;
        if (from === 'c' && to === 'k') return value + 273.15;
        if (from === 'k' && to === 'c') return value - 273.15;
        if (from === 'f' && to === 'k') return (value - 32) * 5/9 + 273.15;
        if (from === 'k' && to === 'f') return (value - 273.15) * 9/5 + 32;
    }
    return value * conversions[type][to] / conversions[type][from];
}

function loadConversionHistory() {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    conversionList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        conversionList.appendChild(li);
    });
}

function saveConversion(conversionText) {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    history.unshift(conversionText);
    if (history.length > 10) history.pop();
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    loadConversionHistory();
}

conversionType.addEventListener('change', populateUnitSelects);

converterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    try {
        const value = parseFloat(inputValue.value);
        if (isNaN(value)) throw new Error('Invalid input value');
        
        const from = inputUnit.value;
        const to = outputUnit.value;
        const type = conversionType.value;
        
        const convertedValue = convertUnits(value, from, to, type);
        const roundedValue = Math.round(convertedValue * 1000) / 1000;
        
        const resultText = `${value} ${from} = ${roundedValue} ${to}`;
        result.textContent = `Result: ${resultText}`;
        
        saveConversion(resultText);
    } catch (error) {
        result.textContent = `Error: ${error.message}`;
    }
});

resetButton.addEventListener('click', function() {
    converterForm.reset();
    result.textContent = '';
    populateUnitSelects();
});

clearHistoryButton.addEventListener('click', function() {
    localStorage.removeItem('conversionHistory');
    loadConversionHistory();
});

// Initialize the form
populateUnitSelects();
loadConversionHistory();