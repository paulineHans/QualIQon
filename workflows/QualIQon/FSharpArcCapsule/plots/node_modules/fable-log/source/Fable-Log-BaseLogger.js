/**
* Base Logger Class
*
*
* @author Steven Velozo <steven@velozo.com>
*/

const libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;

class BaseLogger extends libFableServiceProviderBase
{
	constructor(pLogStreamSettings, pLogStreamHash)
	{
		super(pLogStreamSettings, pLogStreamHash);
		// This should not possibly be able to be instantiated without a settings object
		this._Settings = (typeof(pLogStreamSettings) == 'object') ? pLogStreamSettings : {};

		this.serviceType = 'Logging-Provider';

		// The base logger does nothing but associate a UUID with itself
		// We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
		// to the same provider.
		this.loggerUUID = this.generateInsecureUUID();

		// Eventually we can use this array to ompute which levels the provider allows.
		// For now it's just used to precompute some string concatenations.
		this.levels = (
			[
				"trace",
				"debug",
				"info",
				"warn",
				"error",
				"fatal"
			]);
	}

	// This is meant to generate programmatically insecure UUIDs to identify loggers
	generateInsecureUUID()
	{
		let tmpDate = new Date().getTime();
		let tmpUUID = 'LOGSTREAM-xxxxxx-yxxxxx'.replace(/[xy]/g,
				(pCharacter) =>
				{
					// Funny algorithm from w3resource that is twister-ish without the deep math and security
					// ..but good enough for unique log stream identifiers
					let tmpRandomData = (tmpDate + Math.random()*16)%16 | 0;
					tmpDate = Math.floor(tmpDate/16);

					return (pCharacter =='x' ? tmpRandomData : (tmpRandomData&0x3|0x8)).toString(16);
				});
		return tmpUUID;
	}

	initialize()
	{
		// No operation.
	}

	trace(pLogText, pLogObject)
	{
		this.write("trace", pLogText, pLogObject);
	}

	debug(pLogText, pLogObject)
	{
		this.write("debug", pLogText, pLogObject);
	}

	info(pLogText, pLogObject)
	{
		this.write("info", pLogText, pLogObject);
	}

	warn(pLogText, pLogObject)
	{
		this.write("warn", pLogText, pLogObject);
	}

	error(pLogText, pLogObject)
	{
		this.write("error", pLogText, pLogObject);
	}

	fatal(pLogText, pLogObject)
	{
		this.write("fatal", pLogText, pLogObject);
	}

	write(pLogLevel, pLogText, pLogObject)
	{
		// The base logger does nothing.
		return true;
	}
}

module.exports = BaseLogger;
