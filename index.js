function translateImc(imc) {
  if (isNaN(imc)) return 'N/A';

  if (imc < 18.5) return 'magreza';
  else if (imc < 24.9) return 'normal';
  else if (imc < 30) return 'sobrepeso';
  else return 'obesidade'
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

function calculateImc() {
  var height = parseFloat(document.getElementById('altura').value);
  var weight = parseFloat(document.getElementById('peso').value);

  var dietician = new Dietician(height, weight);

  console.log('dietician is a person?');
  console.log(dietician instanceof Person);

  var imc = dietician.imc();
  alert(parseFloat(imc).toFixed(2) + ' ' + translateImc(imc));
}

