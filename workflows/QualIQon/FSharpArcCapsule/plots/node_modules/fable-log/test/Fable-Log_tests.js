/**
* Unit tests for the Fable Logging Wrappers
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require("chai");
const Expect = Chai.expect;
const Assert = Chai.assert;

const libFableLog = require('../source/Fable-Log.js');

suite
(
	'Fable-Log',
	function()
	{
		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						let tmpFableLog = new libFableLog();
						Expect(tmpFableLog)
							.to.be.an('object', 'Fable-Log should initialize as an object directly from the require statement.');
						Expect(tmpFableLog._PackageFableServiceProvider).to.be.an('object', 'Fable-Log should have a _PackageFableServiceProvider object.');
						Expect(tmpFableLog._PackageFableServiceProvider.name).equal('fable-serviceproviderbase', 'Fable-Log _PackageFableServiceProvider.package.name should be set.');
						Expect(tmpFableLog._Package).to.be.an('object', 'Fable-Log should have a _Package object.');
						Expect(tmpFableLog._Package.name).to.equal('fable-log', 'Fable-Log _Package.package.name should be set.');
					}
				);
				test
				(
					'old new object should still work',
					function()
					{
						let tmpFableLog = new libFableLog();
						Expect(tmpFableLog)
							.to.be.an('object', 'Fable-Log should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();
						Expect(tmpFableLog).to.have.a.property('_Settings')
							.that.is.a('object');
					}
				);
				test
				(
					'instantiate a base logger class',
					function()
					{
						let tmpFableLogBaseLogger = require('../source/Fable-Log-BaseLogger.js');

						let tmpBaseLogger = new tmpFableLogBaseLogger({});

						Expect(tmpBaseLogger)
							.to.be.an('object');
						Expect(tmpBaseLogger.write()).to.equal(true);
					}
				);
			}
		);
		suite
		(
			'Writing Events',
			function()
			{
				test
				(
					'writing to a log stream',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();
						tmpFableLog.info('Test');
						tmpFableLog.logTime();
						tmpFableLog.logTime('Time logged...', {With:'someobject'});
					}
				);
				test
				(
					'writing custom time events to a log stream',
					function(fNext)
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();

						let tmpTimeStamp = tmpFableLog.getTimeStamp();

						setTimeout(
							()=>
							{
								let tmpTimeDelta = tmpFableLog.getTimeDelta(tmpTimeStamp);
								tmpFableLog.logTimeDelta(tmpTimeDelta);
								tmpFableLog.logTimeDeltaHuman(tmpTimeDelta);
								tmpFableLog.logTimeDeltaRelative(tmpTimeStamp, 'Relative Deltas', {Some:'value'});
								tmpFableLog.logTimeDeltaRelativeHuman(tmpTimeStamp, 'Relative Deltas', {Some:'value'});
								fNext();
							}, 505);
					}
				);
				test
				(
					'shorter time spans',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();

						let tmpTimeStamp = tmpFableLog.getTimeStamp();

						tmpFableLog.logTimeDeltaHuman(1, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(10, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(100, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(1000, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(10000, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(100000, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(700000, 'Relative Deltas', {Some:'value'});
						tmpFableLog.logTimeDeltaHuman(144000000, 'Relative Deltas', {Some:'value'});
					}
				);
				test
				(
					'empty log streams array',
					function()
					{
						let tmpFableLog = new libFableLog({LogStreams:[]});
						tmpFableLog.initialize();
						tmpFableLog.info('Test');
					}
				);
				test
				(
					'writing to all log streams',
					function()
					{
						let tmpFableLog = new libFableLog({LogStreams:[{Context:'Testing Purposes', ShowTimeStamps:true, FormattedTimeStamps:false}]});
						tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'leveraging a custom datum decorator',
					function()
					{
						let tmpFableLog = new libFableLog({ LogStreams: [{ Context:'Testing Purposes' }]});
						tmpFableLog.setDatumDecorator((pDatum) =>
						{
							const decoratedDatum =
							{
								Size: 'large',
								Time: new Date().toISOString(),
							};
							if (pDatum && pDatum.LuggageCombination > 0)
							{
								decoratedDatum.Insecure = true;
							}
							Object.assign(decoratedDatum, pDatum);
							return decoratedDatum;
						});
						tmpFableLog.initialize();

						const tmpDatum = { LuggageCombination: 12345 };
						tmpFableLog.trace('Test of Trace', tmpDatum);
						tmpFableLog.debug('Test of Debug', tmpDatum);
						tmpFableLog.info('Test of Info', tmpDatum);
						tmpFableLog.warn('Test of Warning', tmpDatum);
						tmpFableLog.error('Test of Error', tmpDatum);
						tmpFableLog.fatal('Test of Fatal', tmpDatum);
					}
				);
				test
				(
					'writing to all log streams with a context',
					function()
					{
						let tmpFableLog = new libFableLog({LogStreams:[{Context:'Testing Purposes', ShowTimeStamps:true, FormattedTimeStamps:true}]});
						tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'writing objects to all log streams',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();
						tmpFableLog.trace('Testing object sending to Trace...',{Value:"Unlikely",Status:true});
						tmpFableLog.debug('Testing object sending to Debug...',{Value:"Unlikely",Status:true});
						tmpFableLog.info('Testing object sending to Info...',{Value:"Unlikely",Status:true});
						tmpFableLog.warn('Testing object sending to Warning...',{Value:"Unlikely",Status:true});
						tmpFableLog.error('Testing object sending to Error...',{Value:"Unlikely",Status:true});
						tmpFableLog.fatal('Testing object sending to Fatal...',{Value:"Unlikely",Status:true});
					}
				);
				test
				(
					'failing to write to all log streams',
					function()
					{
						let tmpFableLog = new libFableLog();
						//tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'trying to add a bad logger',
					function()
					{
						let tmpFableLog = new libFableLog({LogStreams:[{loggertype:'badmojo',StreamType:'process.stderr'}]});
						tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'logging empty values to all log streams',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();
						tmpFableLog.trace();
						tmpFableLog.debug();
						tmpFableLog.info();
						tmpFableLog.warn();
						tmpFableLog.error();
						tmpFableLog.fatal();
					}
				);
				test
				(
					'manual logging to bunyan',
					function()
					{
						let tmpFableLog = new libFableLog({LogStreams:[{level:'trace'}]});
						tmpFableLog.initialize();
						tmpFableLog.logStreamsTrace[0].trace('Test of manual Trace');
					}
				);
			}
		);
		suite
		(
			'Custom Streams',
			function()
			{
				test
				(
					'reading the data in streams',
					function()
					{
						let tmpFableLog = new libFableLog();
						tmpFableLog.initialize();
						tmpFableLog.info('Test 2');
						tmpFableLog.info('Currently the Parameters for this log are', tmpFableLog.parameters);
					}
				);
				test
				(
					'setting a UUID',
					function()
					{
						let tmpFableLog = new libFableLog({Product:'SetUUID'});
						tmpFableLog.uuid = 'SOMECRAZYID1000';
						tmpFableLog.initialize();
						tmpFableLog.info('Test UUID Set: '+tmpFableLog.uuid);
					}
				);
				test
				(
					'passing in a configuration file',
					function()
					{
						let tmpFableLog = new libFableLog({Product:'Paramset', ProductVersion:'9.8.7'});
						tmpFableLog.initialize('../test/Fable-Log-Parameters_test.json');
						tmpFableLog.info('Test with custom params: '+tmpFableLog.uuid);
					}
				);
			}
		);
	}
);
