var libNPMModuleWrapper = require('./CacheTrax.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('CacheTrax'))
{
	window.CacheTrax = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;