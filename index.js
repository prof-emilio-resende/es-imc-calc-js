function translateImc(imc) {
  if (isNaN(imc)) return 'N/A';

  if (imc < 18.5) return 'magreza';
  else if (imc < 24.9) return 'normal';
  else if (imc < 30) return 'sobrepeso';
  else return 'obesidade';
}

function renderImc(person) {
  document.getElementById('imc').innerHTML = parseFloat(person.imc()).toFixed(2) + ' ' + translateImc(person.imc());
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
  this.imc = function() {
    return this.weight / this.height ** 2;
  }
}

Dietician.prototype = Object.create(Person.prototype);
Dietician.prototype.constructor = Dietician;
console.log(Dietician.prototype.constructor);

function calculateImc(dietician) {
  console.log('dietician is a person?');
  console.log(dietician instanceof Person);
  renderImc(dietician);
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
