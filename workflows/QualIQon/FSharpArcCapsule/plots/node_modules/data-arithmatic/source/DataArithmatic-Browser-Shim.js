/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* DataArithmatic browser shim loader
*/

// Load the data arithmatic module into the browser global automatically.
var libDataArithmatic = require('./DataArithmatic.js');

if (typeof(window) === 'object') window.DataArithmatic = libDataArithmatic;

module.exports = libDataArithmatic;