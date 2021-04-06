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

function renderImc(person) {
  document.getElementById('imc').innerHTML = parseFloat(person.imc).toFixed(2) + ' ' + person.imcDescription;
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

  calculateImcAPI(dietician);
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
}
