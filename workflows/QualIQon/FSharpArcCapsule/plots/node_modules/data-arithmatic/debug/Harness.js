const libFable = require('fable');
const libDataArithmatic = require('../source/DataArithmatic.js');

let _Fable = new libFable();
let _DataArithmatic = new libDataArithmatic(_Fable);

// The insecureStringHash function generates stable hashes based on a passed-in string
// You can define a custom prefix string, but it defaults to HSH
let tmpHash = _DataArithmatic.insecureStringHash('Dogs');

// tmpHash equals 'HSH2135767'
console.log(tmpHash);