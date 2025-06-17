/**
* Unit tests for DataArithmatic
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

const libFable = require('fable');
const _Fable = new libFable();
let libDataArithmatic = require('../source/DataArithmatic.js');

suite
(
	'DataArithmatic String Tokenization',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Manipulate Strings',
			()=>
			{
				test
				(
					'Test getting a string before a match',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringBeforeMatch('Dogs are cool', 'are'))
							.to.equal('Dogs ');
						Expect(_DataArithmatic
							.stringBeforeMatch('These.Are.All.Words', '.'))
							.to.equal('These');
						Expect(_DataArithmatic
							.stringBeforeMatch('These.Are.All.Words', 'NoMatchesHere'))
							.to.equal('These.Are.All.Words');
						return fTestComplete();
					}
				);
				test
				(
					'Test getting a string after a match',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringAfterMatch('Dogs are cool', 'are'))
							.to.equal(' cool');
						Expect(_DataArithmatic
							.stringAfterMatch('These.Are.All.Words', '.'))
							.to.equal('Are.All.Words');
						Expect(_DataArithmatic
							.stringAfterMatch('These.Are.All.Words', 'NoMatchesHere'))
							.to.equal('');
						return fTestComplete();
					}
				);
				test
				(
					'Test counting enclosures',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringCountEnclosures('Dogs (are) cool'))
							.to.equal(1);
						Expect(_DataArithmatic
							.stringCountEnclosures('Dogs are cool'))
							.to.equal(0);
						// It should not count nested enclosures.
						// Although with getEnclosureValueByIndex and recalling this, you can recursively get them.
						Expect(_DataArithmatic
							.stringCountEnclosures('There (are (many)) of these (things)'))
							.to.equal(2);
						Expect(_DataArithmatic
							.stringCountEnclosures('There [are (many)] of these (things)'))
							.to.equal(2);
						// You can also specify the enclosure characters
						Expect(_DataArithmatic
							.stringCountEnclosures('There [are (many)] of these (things)', '[', ']'))
							.to.equal(1);
						// It does not *require* a closing character and still counts the enclosure.
						// Hotly debated topic.  A setting could be added to change this behavior.
						Expect(_DataArithmatic
							.stringCountEnclosures('There [are (many) of these (things)', '[', ']'))
							.to.equal(1);
						return fTestComplete();
					}
				);
				test
				(
					'Test getting an enclosure value by index',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('Dogs (are) cool', 0))
							.to.equal('are');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('Dogs are cool', 0))
							.to.equal('');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('There (are (many)) of these (things)', 0))
							.to.equal('are (many)');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 1))
							.to.equal('things');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 2))
							.to.equal('');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('(This enclosure is the whole string)', 0))
							.to.equal('This enclosure is the whole string');
						// You can also specify the enclosure characters
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('There [are (many)] of these (things)', 0, '[', ']'))
							.to.equal('are (many)');
						Expect(_DataArithmatic
							.stringGetEnclosureValueByIndex('There [are (many) of these (things)', 0, '[', ']'))
							.to.equal('are (many) of these (things)');
						return fTestComplete();
					}
				);
				test
				(
					'Test removing an enclosure',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('Dogs (are) cool', 0))
							.to.equal('Dogs  cool');
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('Dogs are cool', 0))
							.to.equal('Dogs are cool');
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('There (are (many)) of these (things)', 0))
							.to.equal('There  of these (things)');
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 1))
							.to.equal('There [are (many)] of these ');
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 2))
							.to.equal('There [are (many)] of these (things)');
						// You can also specify the enclosure characters
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('There [are (many)] of these (things)', 0, '[', ']'))
							.to.equal('There  of these (things)');
						Expect(_DataArithmatic
							.stringRemoveEnclosureByIndex('There [are (many) of these (things)', 0, '[', ']'))
							.to.equal('There ');
						return fTestComplete();
					}
				);
			}
		);
	}
);
