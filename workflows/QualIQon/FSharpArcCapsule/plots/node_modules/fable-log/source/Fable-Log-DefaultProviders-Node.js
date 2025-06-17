/**
* Default Logger Provider Function
*
*
* @author Steven Velozo <steven@velozo.com>
*/

// Return the providers that are available without extensions loaded
const getDefaultProviders = () =>
{
	let tmpDefaultProviders = {};

	tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
	tmpDefaultProviders.simpleflatfile = require('./Fable-Log-Logger-SimpleFlatFile.js');

	tmpDefaultProviders.default = tmpDefaultProviders.console;

	return tmpDefaultProviders;
}

module.exports = getDefaultProviders();