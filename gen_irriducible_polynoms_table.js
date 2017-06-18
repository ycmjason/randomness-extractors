var rye = require('rye');

var gf2 = new rye.PrimeField(2);
var ring = new rye.PolynomRing(gf2);

var coefs_toLatex = (coefs) => {
  return coefs.map((c, i) => {
    if(c == 0) return ''
    if(i == 0) return c;
    var xi = `x^{${i}}`;
    if(c == 1) return xi;
    return c + xi;
  }).filter(c => c).reverse().join('+');
}

var coefss = [
  '10',
  '111',
  '1011',
  '10011',
  '100101',
  '1000011',
  '10000011',
  '100011011',
  '1000000011',
  '10000001001',
  '100000000101',
  '1000000001001',
  '10000000011011',
].map(c => c.split('').reverse());

console.log(['Degree', 'Coeffcicients', 'Polynomial'].join(' & '), '\\\\');
coefss.forEach((coefs, i) => {
  console.log([i+1, coefs.reverse().join(''), '$' + coefs_toLatex(coefs) + '$'].join(' & '), '\\\\');
});

