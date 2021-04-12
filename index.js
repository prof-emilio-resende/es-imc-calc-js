function createRequest() {
  var request = null;
  try {
    request = new XMLHttpRequest();
  } catch (tryMS) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (otherMS) {
      try {
      request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
        console.log('no way to create XMLHttpRequest object')
      }
    }
  }

  return request;
}

function calculateImcAPI(person) {
  var request = createRequest();
  if (!request) return null;

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        renderImc(JSON.parse(this.responseText));
      }
    }
  };
  request.open('POST', 'http://localhost:8080/imc/calculate', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({
    'height': person.height,
    'weight': person.weight
  }));
}

function calculateImcFetchAPI(person) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var request = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(person)
  };

  fetch('http://localhost:8080/imc/calculate', request)
    .then(rawResponse => rawResponse.json())
    .then(res => renderImc(res));
}

function callImcTableAPI() {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var request = {
    method: "GET",
    headers: myHeaders
  };

  fetch('http://localhost:8080/imc/table', request)
    .then(rawResponse => rawResponse.json())
    .then(res => renderTableImc(res));
}

function renderImc(person) {
  document.getElementById('imc').innerHTML = parseFloat(person.imc).toFixed(2) + ' ' + person.imcDescription;
}

function renderTableImc(tableData) {
  var table = document.getElementById('imcTable');

  Object.keys(tableData)
    .sort()
    .forEach(key => {
      var newTableRow = table.insertRow(-1);
      var keyCell = newTableRow.insertCell(0);
      var keyText = document.createTextNode(key);
      keyCell.appendChild(keyText);
      
      var valueCell = newTableRow.insertCell(1);
      var valueText = document.createTextNode(tableData[key]);
      valueCell.appendChild(valueText);

    });
}

function Person(height, weight) {
  if (typeof(height) !== 'number' || isNaN(height))
    throw Error('height is not a number!');

  if (typeof(weight) !== 'number' || isNaN(weight))
    throw Error('weight is not a number!');

  this.height = height;
  this.weight = weight;
}

function Dietician(height, weight) {
  Person.call(this, height, weight);
}

Dietician.prototype = Object.create(Person.prototype);
Dietician.prototype.constructor = Dietician;
console.log(Dietician.prototype.constructor);

function calculateImc(dietician) {
  console.log('dietician is a person?');
  console.log(dietician instanceof Person);

  calculateImcFetchAPI(dietician);
}

function buildCalculateImc() {
  var heightEl = document.getElementById('altura');
  var weightEl = document.getElementById('peso');

  return function(evt) {
    calculateImc(new Dietician(parseFloat(heightEl.value), parseFloat(weightEl.value)));
  }
}

window.onload = function() {
  var btn = document.querySelector('.data .form button');
  btn.addEventListener('click', buildCalculateImc());

  callImcTableAPI();
}
