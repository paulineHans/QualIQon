/**
* Fable Logging Service
*/

const libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;

const libPackage = require('../package.json');

class FableLog extends libFableServiceProviderBase
{
	constructor(pSettings, pServiceHash)
	{
		super(pSettings, pServiceHash);

		this.serviceType = 'Logging';
		/** @type {Object} */
		this._Package = libPackage;

		let tmpSettings = (typeof(pSettings) === 'object') ? pSettings : {}
		this._Settings = tmpSettings;

		this._Providers = require('./Fable-Log-DefaultProviders-Node.js');

		this._StreamDefinitions = (('LogStreams' in tmpSettings)) ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');

		this.logStreams = [];

		// This object gets decorated for one-time instantiated providers that
		//  have multiple outputs, such as bunyan.
		this.logProviders = {};

		// A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
		this.activeLogStreams = {};

		this.logStreamsTrace = [];
		this.logStreamsDebug = [];
		this.logStreamsInfo = [];
		this.logStreamsWarn = [];
		this.logStreamsError = [];
		this.logStreamsFatal = [];

		this.datumDecorator = (pDatum) => pDatum;

		this.uuid = (typeof(tmpSettings.Product) === 'string') ? tmpSettings.Product : 'Default';
	}

	addLogger(pLogger, pLevel)
	{
		// Bail out if we've already created one.
		if (pLogger.loggerUUID in this.activeLogStreams)
		{
			return false;
		}

		// Add it to the streams and to the mutex
		this.logStreams.push(pLogger);
		this.activeLogStreams[pLogger.loggerUUID] = true;

		// Make sure a kosher level was passed in
		switch (pLevel)
		{
			case 'trace':
				this.logStreamsTrace.push(pLogger);
			case 'debug':
				this.logStreamsDebug.push(pLogger);
			case 'info':
				this.logStreamsInfo.push(pLogger);
			case 'warn':
				this.logStreamsWarn.push(pLogger);
			case 'error':
				this.logStreamsError.push(pLogger);
			case 'fatal':
				this.logStreamsFatal.push(pLogger);
				break;
		}

		return true;
	}

	setDatumDecorator(fDatumDecorator)
	{
		if (typeof(fDatumDecorator) === 'function')
		{
			this.datumDecorator = fDatumDecorator;
		}
		else
		{
			this.datumDecorator = (pDatum) => pDatum;
		}
	}

	trace(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsTrace.length; i++)
		{
			this.logStreamsTrace[i].trace(pMessage, tmpDecoratedDatum);
		}
	}

	debug(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsDebug.length; i++)
		{
			this.logStreamsDebug[i].debug(pMessage, tmpDecoratedDatum);
		}
	}

	info(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsInfo.length; i++)
		{
			this.logStreamsInfo[i].info(pMessage, tmpDecoratedDatum);
		}
	}

	warn(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsWarn.length; i++)
		{
			this.logStreamsWarn[i].warn(pMessage, tmpDecoratedDatum);
		}
	}

	error(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsError.length; i++)
		{
			this.logStreamsError[i].error(pMessage, tmpDecoratedDatum);
		}
	}

	fatal(pMessage, pDatum)
	{
		const tmpDecoratedDatum = this.datumDecorator(pDatum);
		for (let i = 0; i < this.logStreamsFatal.length; i++)
		{
			this.logStreamsFatal[i].fatal(pMessage, tmpDecoratedDatum);
		}
	}

	initialize()
	{
		// "initialize" each logger as defined in the logging parameters
		for (let i = 0; i < this._StreamDefinitions.length; i++)
		{
			let tmpStreamDefinition = Object.assign({loggertype:'default',streamtype:'console',level:'info'},this._StreamDefinitions[i]);

			if (!(tmpStreamDefinition.loggertype in this._Providers))
			{
				console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);
			}
			else
			{
				this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
			}
		}

		// Now initialize each one.
		for (let i = 0; i < this.logStreams.length; i++)
		{
			this.logStreams[i].initialize();
		}
	}

	logTime(pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time';
		let tmpTime = new Date();
		this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`, pDatum);
	}

	// Get a timestamp
	getTimeStamp()
	{
		return +new Date();
	}

	getTimeDelta(pTimeStamp)
	{
		let tmpEndTime = +new Date();
		return tmpEndTime-pTimeStamp;
	}

	// Log the delta between a timestamp, and now with a message
	logTimeDelta(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';
		let tmpDatum = (typeof(pDatum) === 'object') ? pDatum : {};

		let tmpEndTime = +new Date();

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`, pDatum);
	}

	logTimeDeltaHuman(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';

		let tmpEndTime = +new Date();

		let tmpMs = parseInt(pTimeDelta%1000);
		let tmpSeconds = parseInt((pTimeDelta/1000)%60);
		let tmpMinutes = parseInt((pTimeDelta/(1000*60))%60);
		let tmpHours = parseInt(pTimeDelta/(1000*60*60));

		tmpMs = (tmpMs < 10) ? "00"+tmpMs : (tmpMs < 100) ? "0"+tmpMs : tmpMs;
		tmpSeconds = (tmpSeconds < 10) ? "0"+tmpSeconds : tmpSeconds;
		tmpMinutes = (tmpMinutes < 10) ? "0"+tmpMinutes : tmpMinutes;
		tmpHours = (tmpHours < 10) ? "0"+tmpHours : tmpHours;

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`, pDatum);
	}

	logTimeDeltaRelative(pStartTime, pMessage, pDatum)
	{
		this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}

	logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum)
	{
		this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}
}

module.exports = FableLog;
module.exports.LogProviderBase = require('./Fable-Log-BaseLogger.js');
module.exports.LogProviderConsole = require('./Fable-Log-Logger-Console.js');
module.exports.LogProviderFlatfile = require('./Fable-Log-Logger-SimpleFlatFile.js');
