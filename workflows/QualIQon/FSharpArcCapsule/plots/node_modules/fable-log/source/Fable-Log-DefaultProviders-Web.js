/**
* Default Logger Provider Function
*
*
* @author Steven Velozo <steven@velozo.com>
*/

// Return the providers that are available without extensions loaded
var getDefaultProviders = () =>
{
	let tmpDefaultProviders = {};

	tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');

	tmpDefaultProviders.default = tmpDefaultProviders.console;

	return tmpDefaultProviders;
}

module.exports = getDefaultProviders();