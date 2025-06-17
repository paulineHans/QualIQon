/**
* Unit tests for the Fable Log Simple Flat File Stream
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require("chai");
const Expect = Chai.expect;
const Assert = Chai.assert;

const libFS = require('fs');

const libFable = require('fable');
const _Fable = new libFable(
	{
		"Product": "Fable-Log-SimpleFlatFile-Tests",
		"ProductVersion": "1.0.0",

		"TestLogFileLocation": "./Fable-Log-Test.log"
	});

const libFableLog = require('../source/Fable-Log.js');

suite
(
	'Fable-Log-SimpleFlatFile',
	function()
	{
		setup (() => {});

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'create a simple flat file log',
					function(fDone)
					{
						let tmpFableLog;


						// We have to do this as a series, so we can ensure the connection is done before we start logging.
						_Fable.Utility.waterfall([
							(fStageComplete)=>
							{
								if (libFS.existsSync(_Fable.settings.TestLogFileLocation))
								{
									libFS.unlinkSync(_Fable.settings.TestLogFileLocation);
								}

								return fStageComplete();
							},
							(fStageComplete)=>
							{
								// Now instantiate the logger
								tmpFableLog = new libFableLog(
									{
										Product:'SimpleFlatFileTest',
										LogStreams:
											[
												{
													loggertype:'simpleflatfile',
													outputloglinestoconsole: false,
													showtimestamps: true,
													formattedtimestamps: true,
													level:'trace',
													path: _Fable.settings.TestLogFileLocation //'/tmp/Fable-Log-Test.log'
												}
											]
									});

								tmpFableLog.initialize();

								return fStageComplete();
							},
							(fStageComplete)=>
							{
								_Fable.settings.FuzzLogData = tmpFableLog.uuid;
								tmpFableLog.info(`Test log line should write to file for logger ${_Fable.settings.FuzzLogData}: Write Me!` );
								tmpFableLog.info(`Second test log line for logger ${_Fable.settings.FuzzLogData}.` );
								return fStageComplete();
							},
							(fStageComplete)=>
							{
								// This is a bold assumption that logStream 0 is the file logger....
								tmpFableLog.logStreams[0].flushBufferToLogFile(fStageComplete);
							},
							(fStageComplete)=>
							{
								tmpFableLog.logStreams[0].closeWriter(fStageComplete);
							},
							(fStageComplete)=>
							{
								let tmpLogFileExists = libFS.existsSync(_Fable.settings.TestLogFileLocation);

								Expect(tmpLogFileExists).to.equal(true);

								let tmpLogFileContents = libFS.readFileSync(_Fable.settings.TestLogFileLocation, 'utf8');

								console.log(`BEGIN ###< Simple Flat Log File Contents [${_Fable.settings.TestLogFileLocation}] ${tmpLogFileContents.length}b >####`);
								console.log(tmpLogFileContents);
								console.log(`END   ###< Simple Flat Log File Contents END [${_Fable.settings.TestLogFileLocation}] GUID ${_Fable.settings.FuzzLogData} >####`);

								let tmpFuzzMatch = tmpLogFileContents.indexOf(_Fable.settings.FuzzLogData);

								Expect(tmpFuzzMatch).to.be.greaterThan(0)

								return fStageComplete();
							}
						],
						(pError) =>
						{
							if (pError)
							{
								console.log(`Error testing the fable-log simpleflatfile log: ${pError}`);
								console.log(`Stack: ${pError.Stack}`);
							}
							return fDone();
						});
					}
				);
			}
		);
	}
);
