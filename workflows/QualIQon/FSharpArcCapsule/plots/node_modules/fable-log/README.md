Fable Logging
=============

A simple package for enabling consistent logging across the Fable package set.  This wraps the excellent bunyan logging library.

[![Build Status](https://travis-ci.org/stevenvelozo/fable-log.svg?branch=master)](https://travis-ci.org/stevenvelozo/fable-log)

Why?
----

Although I have no interest in writing a logging framework, the effort to setup things like a consistent chain of event logging in an application is not trivial.  Want Mongodb logging in your production environment and console logging for unit tests?  Bleh more branching.  So this is a simple drop-in that uses a standard configuration settings object, and... finds a way.

How to Use This
---------------

You have to checkout the module from npm:

```
    $ npm install fable-log
```

Then everything should just work, without configuration, as a bunyan console logger:

```
    var fableLog = require('fable-log').new();
    fableLog.initialize();
    fableLog.trace('Testing object sending to Trace...',{Value:"Unlikely",Status:true});
    fableLog.debug('Testing object sending to Debug...',{Value:"Unlikely",Status:true});
    fableLog.info('Testing object sending to Info...',{Value:"Unlikely",Status:true});
    fableLog.warn('Testing object sending to Warning...',{Value:"Unlikely",Status:true});
    fableLog.error('Testing object sending to Error...',{Value:"Unlikely",Status:true});
    fableLog.fatal('Testing object sending to Fatal...',{Value:"Unlikely",Status:true});
```

Which should output the following garbage-looking content to the command-line:

```
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":10,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Trace...","time":"2015-04-03T16:18:36.551Z","v":0}
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":20,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Debug...","time":"2015-04-03T16:18:36.551Z","v":0}
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":30,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Info...","time":"2015-04-03T16:18:36.551Z","v":0}
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":40,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Warning...","time":"2015-04-03T16:18:36.551Z","v":0}
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":50,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Error...","time":"2015-04-03T16:18:36.551Z","v":0}
	{"name":"Fable","hostname":"Stevens-Mac-Pro.local","pid":58264,"level":60,"Source":"0x532004ec61800000","ver":"0.0.0","datum":{"Value":"Unlikely","Status":true},"msg":"Testing object sending to Fatal...","time":"2015-04-03T16:18:36.551Z","v":0}
```

But Those Log Entries are Unreadable!
-------------

Want console output to be pretty?  Install bunyan globally (may require sudo on some operating systems):

```
    $ npm install -g bunyan
```

And then pipe your console output through everybodies favorite lumberjack:

```
    $ node MyBestApplicationEver.js | bunyan
    [2015-04-03T16:20:43.435Z] TRACE: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Trace... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
    [2015-04-03T16:20:43.435Z] DEBUG: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Debug... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
    [2015-04-03T16:20:43.435Z]  INFO: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Info... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
    [2015-04-03T16:20:43.435Z]  WARN: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Warning... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
    [2015-04-03T16:20:43.435Z] ERROR: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Error... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
    [2015-04-03T16:20:43.435Z] FATAL: Fable/58284 on Stevens-Mac-Pro.local: Testing object sending to Fatal... (Source=0x532005684ac00000, ver=0.0.0)
        datum: {
          "Value": "Unlikely",
          "Status": true
        }
```

If that isn't exciting enough, on my computer these entries are in __all sorts of rainbow colors__!

So, you're sold on this and want to do something more complex, like say have the logs go in two places:

```
	var fableLogOptions = (
	        	{
        		Product:'Mongoooo',
        		LogStreams:
        			[
        			    {
        			    	level: 'trace',
        			    	streamtype:'process.stdout',
        			    },
        			    {
        			    	level: 'info',
        			    	path: './Logs/Fable.log'
        			    }
        			]
        	});
    var fableLog = require('fable-log').new(fableLogOptions);
    fableLog.initialize();
    fableLog.trace('I really like debugging my code.  Here are the fable options!', {Options: fableLogOptions});
    fableLog.info('This is really important info.');
```

Which will write the info line to both streams, and the trace line just to the console.

Stream Definitions
------------

A stream definition object has the following options (none are required, defaults are shown):

```
    {
        loggertype: 'console',
        streamtype: 'console',
        level: 'trace'
    }
```

Stream types can also have their own parameters -- for instance simpleflatfile and Bunyan have a path for the log file.

(note Bunyan is no longer bundled as a default)

```
    {
        loggertype: 'bunyan',
        streamtype: 'process.stdout',
        level: 'info'
    },
```



Scalable Functionality
------------

This logging framework is meant to scale well with log aggregation and multiple data centers, products and versions.  There are way more options, the ability to use config files, and other goodies.  Features are all covered in the unit tests until the documentation gets completed!

Unit Testing
------------

You can run the unit tests by executing:

    $ npm test

Or you can get the istanbul coverage report by executing:

    $ npm run coverage