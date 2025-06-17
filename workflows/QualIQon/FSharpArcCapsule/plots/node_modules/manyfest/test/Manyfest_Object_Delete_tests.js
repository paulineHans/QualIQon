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

let _SampleDataArchiveOrgFrankenberry = JSON.parse(JSON.stringify(require('./Data-Archive-org-Frankenberry.json')));

suite
(
	'Manyfest Object Property Delete',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Delete',
			()=>
			{
				test
				(
					'It should be trivial to delete subproperties without a schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not in schema:
						Expect(_Manyfest.deleteValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'metadata.title'))
							.to.equal(true);
						Expect(_SampleDataArchiveOrgFrankenberry.metadata.title)
							.to.equal(undefined);
						fTestComplete();
					}
				);
				test
				(
					'It should be trivial to delete subproperties with a schema by hash.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpDeleted = _Manyfest.deleteValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(_SampleDataArchiveOrgFrankenberry.metadata.creator)
							.to.equal(undefined);
						Expect(tmpDeleted)
							.to.equal(true);
						fTestComplete();
					}
				);
				test
				(
					'Nothing bad should happen deleting a non existant property.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose)." },
										"Type": { "Description":"Whether or not the animal is wild, domesticated, agricultural, in a research lab or a part of a zoo.." },
										"MedicalStats":
											{
												"Name":"Medical Statistics", "Description":"Basic medical statistics for this animal"
											},
										"MedicalStats.Temps.MinET": { "Name":"Minimum Environmental Temperature", "NameShort":"MinET", "Description":"Safest minimum temperature for this animal to survive in."},
										"MedicalStats.Temps.MaxET": { "Name":"Maximum Environmental Temperature", "NameShort":"MaxET", "Description":"Safest maximum temperature for this animal to survive in."},
										"MedicalStats.Temps.CET":
											{
												"Name":"Comfortable Environmental Temperature",
												"NameShort":"Comf Env Temp",
												"Hash":"ComfET",
												"Description":"The most comfortable temperature for this animal to survive in.",
												"Default": "96.8"
											}
									}
							});

							Expect(animalManyfest.deleteValueAtAddress({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.HighETBUTIDONTEXISTDOI'))
								.to.equal(true);

						fTestComplete();
					}
				);
			}
		);
	}
);
