# Data Arithmatic

Basic data gymnastics.  String olympics, number formatting, simple token parsing/counting -- small functions that are reused throughout various libraries.  Some of these are even available in newer javascript environments.

However our code needs to run in the least capable runtime.  Which is the qt browser, unfortunately.

Completely dependency free.  Minified to 4kb.

# Installation

```
npm i --save data-arithmatic
```

# Usage

```
const libDataArithmatic = require('data-arithmatic');

let _DataArithmatic = new libDataArithmatic();

// The insecureStringHash function generates stable hashes based on a passed-in string
// You can define a custom prefix string, but it defaults to HSH
let tmpHash = _DataArithmatic.insecureStringHash('Dogs');

// tmpHash equals 'HSH2135767'
console.log(tmpHash);
```

# Examples

The `./test/` folder of this repository includes so many exercises of the functions available in this library.