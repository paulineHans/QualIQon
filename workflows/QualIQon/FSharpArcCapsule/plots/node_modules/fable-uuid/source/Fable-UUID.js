/**
* Fable UUID Generator
*/

const libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;0

const libRandomByteGenerator = require('./Fable-UUID-Random.js')

const libPackage = require('../package.json');

class FableUUID extends libFableServiceProviderBase
{
	constructor(pSettings, pServiceHash)
	{
		super(pSettings, pServiceHash);

		this.serviceType = 'UUID';
		/** @type {Object} */
		this._Package = libPackage;

		// Determine if the module is in "Random UUID Mode" which means just use the random character function rather than the v4 random UUID spec.
		// Note this allows UUIDs of various lengths (including very short ones) although guaranteed uniqueness goes downhill fast.
		this._UUIDModeRandom = (typeof(pSettings) === 'object') && ('UUIDModeRandom' in pSettings) ? (pSettings.UUIDModeRandom == true) : false;
		// These two properties are only useful if we are in Random mode.  Otherwise it generates a v4 spec
		// Length for "Random UUID Mode" is set -- if not set it to 8
		this._UUIDLength = (typeof(pSettings) === 'object') && ('UUIDLength' in pSettings) ? (pSettings.UUIDLength + 0) : 8;
		// Dictionary for "Random UUID Mode"
		this._UUIDRandomDictionary = (typeof(pSettings) === 'object') && ('UUIDDictionary' in pSettings) ? (pSettings.UUIDDictionary + 0) : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

		this.randomByteGenerator = new libRandomByteGenerator();

		// Lookup table for hex codes
		this._HexLookup = [];
		for (let i = 0; i < 256; ++i)
		{
			this._HexLookup[i] = (i + 0x100).toString(16).substr(1);
		}
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	bytesToUUID(pBuffer)
	{
		let i = 0;
		// join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
		return ([
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], 
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]]
				]).join('');
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	generateUUIDv4()
	{
		let tmpBuffer = new Array(16);
		var tmpRandomBytes = this.randomByteGenerator.generate();

		// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
		tmpRandomBytes[6] = (tmpRandomBytes[6] & 0x0f) | 0x40;
		tmpRandomBytes[8] = (tmpRandomBytes[8] & 0x3f) | 0x80;

		return this.bytesToUUID(tmpRandomBytes);
	}

	// Simple random UUID generation
	generateRandom()
	{
		let tmpUUID = '';

		for (let i = 0; i < this._UUIDLength; i++)
		{
			tmpUUID += this._UUIDRandomDictionary.charAt(Math.floor(Math.random() * (this._UUIDRandomDictionary.length-1)));
		}

		return tmpUUID;
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	getUUID()
	{
		if (this._UUIDModeRandom)
		{
			return this.generateRandom();
		}
		else
		{
			return this.generateUUIDv4();
		}
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableUUID(pSettings);
}


module.exports = FableUUID;
module.exports.new = autoConstruct;
