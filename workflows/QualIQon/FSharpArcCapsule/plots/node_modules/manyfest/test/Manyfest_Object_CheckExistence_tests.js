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

let _SampleDataArchiveOrgFrankenberry = require('./Data-Archive-org-Frankenberry.json');

suite
(
	'Manyfest Object Check Element Existence',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Check Existence',
			()=>
			{
				test
				(
					'It should be easy to check if an element exists by address.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not in schema:
						let tmpTitleExists = _Manyfest.checkAddressExists(_SampleDataArchiveOrgFrankenberry, 'metadata.title');
						Expect(tmpTitleExists)
							.to.equal(true);
						fTestComplete();
					}
				);
				test
				(
					'If an element does not exist, checkAddressExists should return false.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not in schema:
						let tmpTitleExists = _Manyfest.checkAddressExists(_SampleDataArchiveOrgFrankenberry, 'metadata.someStrangeProperty');
						Expect(tmpTitleExists)
							.to.equal(false);
						fTestComplete();
					}
				);
				test
				(
					'It should be trivial to access subproperties with a schema by hash.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.checkAddressExistsByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator)
							.to.equal(true);
						fTestComplete();
					}
				);
				test
				(
					'Elements exist in function return values ... yiiiiikes.',
					(fTestComplete)=>
					{
						// Create a compmlex mock object to check metadata on.
						let _MockObject = (
							{
								"Name": "Yadda",
								"TheFunction": (pValue) => { return `Value is: ${pValue}`; },
								"ComplexFunction": (pValue, pOutput) => { return `Value is: ${pValue} and would output as ${pOutput}`; },
								"Behaviors": 
									{
										"Value": 0,
										"Increment": function () 
											{
												this.Value++; return this.Value;
											},
										"SillyObject": function()
										{
											return { Cost: 1.00, Name: 'Beanie Baby', Stores: ['Aberdeen', 'Seattle', 'Tacoma'] }
										},
										"FormatOutput": function () { return `My magic value is: ${this.Value}`; }
									},
								"Manyfest":
									{
										Scope:'Function.Mock',
										Descriptors:
											{
												"metadata.creator":
													{
														Name:'Creator',
														Hash:'Creator'
													}
											}
									},
								"Data": _SampleDataArchiveOrgFrankenberry
							});
						let _Manyfest = new libManyfest(_MockObject.Manyfest);

						// Function existence should just work
						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.SillyObject')).to.equal(true);
						// If it is a function we can ask manyfest if it's a function and it will be true
						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.SillyObject()')).to.equal(true);
						// Non functions will return false even if they exist.
						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.Value')).to.equal(true);
						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.Value()')).to.equal(false);

						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.SillyObject().Stores')).to.equal(true);
						Expect(_Manyfest.checkAddressExists(_MockObject, 'Behaviors.SillyObject().Stores[0]')).to.equal(true);

						fTestComplete();
					}
				);
			}
		);
	}
);
