/**
* Unit tests for the Fable UUID Wrappers
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

const libFableUUID = require('../source/Fable-UUID.js');

// Create mock settings and logging objects
var _MockSettings = (
{
	Product: 'FableUUID',
	ProductVersion: '0.0.0'
});

suite
(
	'Fable-UUID',
	() =>
	{
		setup
		(
			() =>
			{
			}
		);

		suite
		(
			'Object Sanity',
			() =>
			{
				test
				(
					'initialize should build a happy little object',
					() =>
					{
						const tmpFableUUID = new libFableUUID();
						Expect(tmpFableUUID).to.be.an('object', 'Fable-UUID should initialize as an object directly from the require statement.');

						Expect(tmpFableUUID._PackageFableServiceProvider).to.be.an('object', 'Fable should have a _PackageFableServiceProvider object.');
						Expect(tmpFableUUID._PackageFableServiceProvider.name).equal('fable-serviceproviderbase', 'Fable _PackageFableServiceProvider.package.name should be set.');
						Expect(tmpFableUUID._Package).to.be.an('object', 'Fable should have a _Package object.');
						Expect(tmpFableUUID._Package.name).to.equal('fable-uuid', 'Fable _Package.package.name should be set.');
					}
				);
				test
				(
					'legacy new() initialization should build a happy little object',
					() =>
					{
						const tmpFableUUID = libFableUUID.new();
						Expect(tmpFableUUID)
							.to.be.an('object', 'Fable-UUID should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					() =>
					{
						const tmpFableUUID = new libFableUUID();
						Expect(tmpFableUUID).to.be.an('object');
					}
				);
			}
		);
		suite
		(
			'Generation',
			() =>
			{
				test
				(
					'Generating a UUID',
					() =>
					{
						const tmpFableUUID = new libFableUUID();
						const tmpUUID = tmpFableUUID.getUUID();
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Bad settings object',
					() =>
					{
						const tmpFableUUID = new libFableUUID();
						const tmpUUID = tmpFableUUID.getUUID();
						console.log(`Standard UUID Generated: [${tmpUUID}]`);
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Settings object without a UUID definition',
					() =>
					{
						const tmpFableUUID = new libFableUUID();
						const tmpUUID = tmpFableUUID.getUUID();
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Settings object with a bad UUID definition',
					() =>
					{
						const tmpFableUUID = new libFableUUID({UUID: {DataCenter:'BAD',Worker:'JOB'}});
						const tmpUUID = tmpFableUUID.getUUID();
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Random bytes',
					() =>
					{
						const tmpFableUUID = new libFableUUID({UUIDModeRandom: true});
						const tmpUUID = tmpFableUUID.getUUID();
						console.log(`Random UUID Generated: [${tmpUUID}]`);
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Random bytes with length check',
					() =>
					{
						const tmpFableUUID = new libFableUUID({UUIDModeRandom: true, UUIDLength: 5});
						const tmpUUID = tmpFableUUID.getUUID();
						console.log(`Very short Random UUID Generated: [${tmpUUID}]`);
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpUUID.length)
							.to.equal(5);
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
				test
				(
					'Random bytes custom dictionary',
					() =>
					{
						const tmpFableUUID = new libFableUUID({UUIDModeRandom: true, UUIDLength: 50, UUIDDictionary: 'ab'});
						const tmpUUID = tmpFableUUID.getUUID();
						console.log(`Long Random UUID Generated with custom dictionary: [${tmpUUID}]`);
						Expect(tmpUUID)
							.to.be.a('string')
							.that.is.not.empty;
						Expect(tmpUUID.indexOf('a'))
							.to.not.equal(-1);
						Expect(tmpUUID.length)
							.to.equal(50);
						Expect(tmpFableUUID.getUUID())
							.to.be.a('string')
							.to.not.equal(tmpUUID);
					}
				);
			}
		);
	}
);