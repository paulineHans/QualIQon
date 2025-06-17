/**
* Unit tests for Manyfest
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

let libManyfest = require('../source/Manyfest.js');

suite
(
	'Manyfest Basic',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Object Sanity',
			()=>
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({});
						Expect(_Manyfest)
							.to.be.an('object', 'Manyfest should initialize as an object with no parameters.');
						fTestComplete();
					}
				);
				test
				(
					'The class should print an error message with a bad manifest.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({Scope:'BadManifest', Descriptors:'BadDescriptors'});
						Expect(_Manyfest)
							.to.be.an('object', 'Manyfest should initialize as an object with no parameters.');
						fTestComplete();
					}
				);
				test
				(
					'Default properties should be automatically set.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						Expect(_Manyfest.scope)
							.to.be.a('string', 'Manyfest should have a scope.');
						Expect(_Manyfest.scope)
							.to.equal('DEFAULT', 'Manyfest should default to the Scope DEFAULT.');
						fTestComplete();
					}
				);
				test
				(
					'Exercise the default logging.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						_Manyfest.logError('Error...');
						_Manyfest.logInfo('Info...');
						_Manyfest.logInfo();

						fTestComplete();
					}
				);
			}
		);
	}
);
