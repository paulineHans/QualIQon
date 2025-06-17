let libFableLog = require('../source/Fable-Log.js');

let tmpLog = new libFableLog(
	{
		LogStreams:
		[
			{
				//loggertype:'console',
				loggertype:'simpleflatfile',
				outputloglinestoconsole: true,
				showtimestamps: true,
				formattedtimestamps: true,
				level:'trace',
				streamtype:'prettystream'
			}
		]
	});

tmpLog.initialize();

tmpLog.info('test');

let tmpTimeStamp = tmpLog.getTimeStamp();
let tmpTimeDelta = 500;

for (let i = 0; i < 500000; i++)
{
	tmpLog.trace(`Core is at ${i} KELVINS`);
	if (i % 383)
	{
		setTimeout(
			()=>
			{
				tmpLog.logTimeDeltaRelative(tmpTimeStamp, `Test Delta of ${tmpTimeDelta} ms at ${i} KELVINS...`);
				tmpLog.logTimeDeltaRelativeHuman(tmpTimeStamp);
			}, tmpTimeDelta);
	}
}