const libConsoleLog = require('./Fable-Log-Logger-Console.js');
const libFS = require('fs');
const libPath = require('path');

class SimpleFlatFileLogger extends libConsoleLog
{
	constructor(pLogStreamSettings, pFableLog)
	{
		super(pLogStreamSettings, pFableLog);

		// If a path isn't provided for the logfile, it tries to use the ProductName or Context
		this.logFileRawPath = (this._Settings.hasOwnProperty('path')) ? this._Settings.path : `./${this._ContextMessage}.log`;
		this.logFilePath = libPath.normalize(this.logFileRawPath);

		this.logFileStreamOptions = (this._Settings.hasOwnProperty('fileStreamoptions')) ? this._Settings.fileStreamOptions : (
			{
				"flags": "a",
				"encoding": "utf8"
			})

		this.fileWriter = libFS.createWriteStream(this.logFilePath, this.logFileStreamOptions);

		this.activelyWriting = false;

		this.logLineStrings = [];
		this.logObjectStrings = [];

		this.defaultWriteCompleteCallback = ()=>{};
		this.defaultBufferFlushCallback = ()=>{};
	}

	closeWriter(fCloseComplete)
	{
		let tmpCloseComplete = (typeof(fCloseComplete) == 'function') ? fCloseComplete : ()=>{};
		if (this.fileWriter)
		{
			this.fileWriter.end('\n');
			return this.fileWriter.once('finish', tmpCloseComplete.bind(this));
		}
	}

	completeBufferFlushToLogFile(fFlushComplete)
	{
		this.activelyWriting = false;
		let tmpFlushComplete = (typeof(fFlushComplete) == 'function') ? fFlushComplete : this.defaultBufferFlushCallback;

		if (this.logLineStrings.length > 0)
		{
			this.flushBufferToLogFile(tmpFlushComplete);
		}
		else
		{
			return tmpFlushComplete();
		}
	}

	flushBufferToLogFile(fFlushComplete)
	{
		if (!this.activelyWriting)
		{
			// Only want to be writing one thing at a time....
			this.activelyWriting = true;

			let tmpFlushComplete = (typeof(fFlushComplete) == 'function') ? fFlushComplete : this.defaultBufferFlushCallback;

			// Get the current buffer arrays.  These should always have matching number of elements.
			let tmpLineStrings = this.logLineStrings;
			let tmpObjectStrings = this.logObjectStrings;

			// Reset these to be filled while we process this queue...
			this.logLineStrings = [];
			this.logObjectStrings = [];

			// This is where we will put each line before writing it to the file...
			let tmpConstructedBufferOutputString = '';

			for (let i = 0; i < tmpLineStrings.length; i++)
			{
				// TODO: Windows Newline?   ....... yo no se!
				tmpConstructedBufferOutputString += `${tmpLineStrings[i]}\n`;
				if (tmpObjectStrings[i] !== false)
				{
					tmpConstructedBufferOutputString += `${tmpObjectStrings[i]}\n`;
				}
			}

			if (!this.fileWriter.write(tmpConstructedBufferOutputString, 'utf8'))
			{
				// If the streamwriter returns false, we need to wait for it to drain.
				this.fileWriter.once('drain', this.completeBufferFlushToLogFile.bind(this, tmpFlushComplete));
			}
			else
			{
				return this.completeBufferFlushToLogFile(tmpFlushComplete);
			}
		}
	}

	write(pLevel, pLogText, pObject)
	{
		let tmpLogLine = super.write(pLevel, pLogText, pObject);

		// Use a very simple array as the write buffer
		this.logLineStrings.push(tmpLogLine);

		// Write out the object on a separate line if it is passed in
		if (typeof(pObject) !== 'undefined')
		{
			this.logObjectStrings.push(JSON.stringify(pObject, null, 4));
		}
		else
		{
			this.logObjectStrings.push(false);
		}

		this.flushBufferToLogFile();
	}
}

module.exports = SimpleFlatFileLogger;