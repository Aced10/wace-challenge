const randomNumber = (minimo, maximo, decimales) => {
  var precision = Math.pow(10, decimales);
  minimo = minimo*precision;
  maximo = maximo*precision;
  return Math.floor(Math.random()*(maximo-minimo+1) + minimo) / precision;
}

module.exports = {
  randomNumber
}