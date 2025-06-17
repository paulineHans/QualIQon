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
	'Manyfest Schema Manipulation',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Address Mapping Resolution',
			()=>
			{
				test
				(
					'We should be able to remap properties in place.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" }
							});

						let tmpTranslationTable = (
							{
								"a": "CarrotCost",
								"b": "AppleCost"
							});

						Expect(tmpSchemaDescriptors.a.Hash).to.equal('a');

						let _Manyfest = new libManyfest();
						// Now remap the schema (in-place)
						_Manyfest.schemaManipulations.resolveAddressMappings(tmpSchemaDescriptors, tmpTranslationTable);

						// The schema should be fundamentally altered to point these addresses to the old hashes
						Expect(tmpSchemaDescriptors.CarrotCost.Hash).to.equal('a');
						Expect(tmpSchemaDescriptors.AppleCost.Hash).to.equal('b');

						fTestComplete();
					}
				);
				test
				(
					'We should be able to remap properties safely.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" }
							});

						let tmpTranslationTable = (
							{
								"a": "CarrotCost",
								"b": "AppleCost"
							});

						Expect(tmpSchemaDescriptors.a.Hash).to.equal('a');

						let _Manyfest = new libManyfest();
						// Now remap the schema (in-place)
						let tmpNewSchemaDescriptors = _Manyfest.schemaManipulations.safeResolveAddressMappings(tmpSchemaDescriptors, tmpTranslationTable);

						// The schema should be safe
						Expect(tmpSchemaDescriptors.a.Hash).to.equal('a');
						// And a new schema should have been created with the alterations
						Expect(tmpNewSchemaDescriptors.CarrotCost.Hash).to.equal('a');
						Expect(tmpNewSchemaDescriptors.AppleCost.Hash).to.equal('b');

						fTestComplete();
					}
				);
				test
				(
					'We should be able to merge properties safely.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" }
							});

						let tmpSchemaDescriptorsToMerge = (
							{
								"c": { "Hash": "c" },
								"d": { "Hash": "d" },
								"e": { "Hash": "e" },
								"a": { "Hash": "ARBUCKLE", "Type": "Number" }
							});

						Expect(tmpSchemaDescriptors.a.Hash).to.equal('a');

						let _Manyfest = new libManyfest();
						// Now remap the schema (in-place)
						let tmpNewSchemaDescriptors = _Manyfest.schemaManipulations.mergeAddressMappings(tmpSchemaDescriptors, tmpSchemaDescriptorsToMerge);

						// The schema should be safe
						Expect(tmpNewSchemaDescriptors.a.Hash).to.equal('a');
						// And a new schema should have been created with the alterations
						Expect(tmpNewSchemaDescriptors.b.Hash).to.equal('b');
						Expect(tmpNewSchemaDescriptors.c.Hash).to.equal('c');

						fTestComplete();
					}
				);
				test
				(
					'Cloning should work.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" }
							});

						let tmpTranslationTable = (
							{
								"a": "CarrotCost",
								"b": "AppleCost"
							});

						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator).to.equal('General Mills');
						let _ClonedManyfest = _Manyfest.clone();
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator')).to.equal('General Mills');

						fTestComplete();
					}
				);
				test
				(
					'Cloning should take into account translation.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" }
							});

						let tmpTranslationTable = (
							{
								"a": "CarrotCost",
								"b": "AppleCost"
							});

						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator).to.equal('General Mills');
						// Create a translation between "Creator" and "Director" as well as "Author"
						_Manyfest.hashTranslations.addTranslation({"Director":"Creator", "Author":"Creator", "Songwriter":"Creator"});
						Expect(tmpCreator).to.equal('General Mills');
						// Director should also work
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal('General Mills');
						// And Author!
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal('General Mills');
						// Now remove Director
						_Manyfest.hashTranslations.clearTranslations();
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal(undefined);
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal(undefined);
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Songwriter')).to.equal(undefined);
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator')).to.equal('General Mills');

						let _ClonedManyfest = _Manyfest.clone();
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal(undefined);
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal(undefined);
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Songwriter')).to.equal(undefined);
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator')).to.equal('General Mills');

						// New translations should not affect the old manyfest
						_ClonedManyfest.hashTranslations.addTranslation({"Director":"Creator", "Author":"Creator", "Songwriter":"Creator"});
						Expect(_ClonedManyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal('General Mills');
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal(undefined);

						fTestComplete();
					}
				);
				test
				(
					'Schema definition prototypes should be able to be generated from any JSON object shape.',
					(fTestComplete)=>
					{
						let tmpSchemaDescriptors = (
							{
								"a": { "Hash": "a", "Type": "Number" },
								"b": { "Hash": "b", "Type": "Number" },
								"TranslationTable":
								{
									"a": "CarrotCost",
									"b": "AppleCost",
									"c": null
								}
							});

						let _Manyfest = new libManyfest();
						// Now remap the schema (in-place)
						let tmpSchemaPrototype = _Manyfest.objectAddressGeneration.generateAddressses(tmpSchemaDescriptors);

						// The schema should be fundamentally altered to point these addresses to the old hashes
						Expect(tmpSchemaPrototype).to.be.an('object');

						Expect(tmpSchemaPrototype['TranslationTable.a'].DataType).to.equal('String');

						fTestComplete();
					}
				);
				test
				(
					'Make a much bigger schema prototype.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						// Now remap the schema (in-place)
						let tmpSchemaPrototype = _Manyfest.objectAddressGeneration.generateAddressses(_SampleDataArchiveOrgFrankenberry);

						// The schema should be fundamentally altered to point these addresses to the old hashes
						Expect(tmpSchemaPrototype).to.be.an('object');

						Expect(tmpSchemaPrototype['files_count'].Default).to.equal(17);
						Expect(tmpSchemaPrototype['files_count'].DataType).to.equal('Number');

						fTestComplete();
					}
				);
				test
				(
					'Iterate through elements of a schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
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

						let tmpSchemaAddresses = [];

						_Manyfest.eachDescriptor(
							(pDescriptor)=>
							{
								tmpSchemaAddresses.push(pDescriptor.Hash);
							})
						Expect(tmpSchemaAddresses.length).to.equal(7);
						Expect(tmpSchemaAddresses[6]).to.equal('ComfET');
						fTestComplete();
					}
				);
			}
		);
	}
);
