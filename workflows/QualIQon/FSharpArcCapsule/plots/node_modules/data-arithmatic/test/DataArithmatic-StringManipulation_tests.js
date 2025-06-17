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
	'DataArithmatic String',
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
					'Reverse a String',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringReverse('Dogs'))
							.to.equal('sgoD');
						Expect(_DataArithmatic
							.stringReverse('Florence and the Machine'))
							.to.equal('enihcaM eht dna ecnerolF');
						return fTestComplete();
					}
				)
				test
				(
					'Insecure String Hash',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.insecureStringHash('Dogs'))
							.to.equal('HSH2135767');
						Expect(_DataArithmatic
							.insecureStringHash('Dogs1'))
							.to.equal('HSH66208826');
						Expect(_DataArithmatic
							.insecureStringHash('This string is longer'))
							.to.equal('HSH53260210');
						// This repeat is intentional, to ensure stable hash generation after multiple runs.
						Expect(_DataArithmatic
							.insecureStringHash('Dogs'))
							.to.equal('HSH2135767');
						return fTestComplete();
					}
				)
				test
				(
					'Clean wrapping characters from a valid enclosure.',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						// Test the enclosure cleaning function
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('`', '`Dogs`'))
							.to.equal('Dogs');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '`Cats`'))
							.to.equal('`Cats`');
						// Tests a cleaning where the enclosure is not wrapped with the expected character
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '"Dogs"'))
							.to.equal('Dogs');
						// Test cleaning an enclosure with multiple enclosures of the same type which are expected to stay intact
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('[', '[Array[with]weird other] Dogs in it['))
							.to.equal('Array[with]weird other] Dogs in it');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', '"Dogs'))
							.to.equal('"Dogs');
						// Test cleaning a string where the enclosure character is on one side but not the other
						Expect(_DataArithmatic
							.cleanEnclosureWrapCharacters('"', 'Dogs"'))
							.to.equal('Dogs"');
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string starts with a given substring - Javascript Engine startsWith',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string starts with a given substring - Internal startsWith',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						_DataArithmatic._UseEngineStringStartsWith = false;
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Do'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
							.stringStartsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string ends with a given substring - Javascript Engine endsWith',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test if a string ends with a given substring - Internal endsWith',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						_DataArithmatic._UseEngineStringEndsWith = false;
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'gs'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Bats', 'Bats'))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Dogs are cool'))
							.to.equal(false);
						// We should be able to tell it a midpoint to "end" the string at
						Expect(_DataArithmatic
							.stringEndsWith('Start from a median point', 'median', 19))
							.to.equal(true);
						Expect(_DataArithmatic
							.stringEndsWith('Start from a median point', 'median', 20))
							.to.equal(false);
						Expect(_DataArithmatic
							.stringEndsWith('Dogs', 'Cats'))
							.to.equal(false);
						return fTestComplete();
					}
				);
				test
				(
					'Test cleaning nonalpha characters from a string',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs'))
							.to.equal('Dogs');
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool'))
							.to.equal('Dogs_are_cool');
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogs_are_cool_');
						// Test cleaning with no character
						_DataArithmatic._Value_Clean_formatterCleanNonAlpha = '';
						Expect(_DataArithmatic
							.cleanNonAlphaCharacters('Dogs are cool!'))
							.to.equal('Dogsarecool');
						return fTestComplete();
					}
				);
				test
				(
					'Pad the beginning of a string',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						// The usual use case (e.g. for zero padding dates)
						Expect(_DataArithmatic.stringPadStart('9', 2, '0'))
							.to.equal('09');
						Expect(_DataArithmatic.stringPadStart('11', 2, '0'))
							.to.equal('11');
						// Try some longer paddings
						Expect(_DataArithmatic.stringPadStart('8675309', 20, '0'))
							.to.equal('00000000000008675309');
						// Should not be destructive
						Expect(_DataArithmatic.stringPadStart('8675309', 1, '0'))
							.to.equal('8675309');
						// Pad with a longer filler string with shifting data
						Expect(_DataArithmatic.stringPadStart('ning', 20, 'aaaaw'))
							.to.equal('aaaawaaaawaaaawaning');
						// Table of contents?
						Expect(_DataArithmatic.stringPadStart('Chapter 1', 20, '.'))
							.to.equal('...........Chapter 1');

						return fTestComplete();
					}
				);
				test
				(
					'Pad the end of a string',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						// The usual use case (e.g. for left justifying text in fixed-width scenarios)
						Expect(_DataArithmatic.stringPadEnd('Bob', 10, ' '))
							.to.equal('Bob       ');

						return fTestComplete();
					}
				)
			}
		);
	}
);
