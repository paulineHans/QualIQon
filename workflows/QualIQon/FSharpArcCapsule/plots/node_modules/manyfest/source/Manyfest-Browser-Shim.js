/**
* @author <steven@velozo.com>
*/

/**
* Manyfest browser shim loader
*/

// Load the manyfest module into the browser global automatically.
var libManyfest = require('./Manyfest.js');

if (typeof(window) === 'object') window.Manyfest = libManyfest;

module.exports = libManyfest;