/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Fable-UUID.js');

if ((typeof(window) === 'object') && !('FableUUID' in window))
{
	window.FableUUID = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;