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
let _SampleDataYahooWeather = require('./Data-Yahoo-Weather.json');

suite
(
	'Manyfest Object Read',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Read',
			()=>
			{
				test
				(
					'It should be trivial to access subproperties without a schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not in schema:
						let tmpTitle = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'metadata.title');
						Expect(tmpTitle)
							.to.equal('Franken Berry / Count Chocula : Tevevision Commercial 1971');
						Expect(tmpTitle)
							.to.equal(_SampleDataArchiveOrgFrankenberry.metadata.title);
						let tmpNoAddress = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, '');
						fTestComplete();
					}
				);
				test
				(
					'Javascript null values should not cause errors..',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org',	Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						let tmpNullSampleData = JSON.parse(JSON.stringify(_SampleDataArchiveOrgFrankenberry));
						tmpNullSampleData.Noel = null;
						let tmpNullValue = _Manyfest.getValueAtAddress(tmpNullSampleData, 'Noel');
						let tmpNullValueOneDeep = _Manyfest.getValueAtAddress(tmpNullSampleData, 'Noel.SomeChildValue');
						let tmpNullValueTwoDeep = _Manyfest.getValueAtAddress(tmpNullSampleData, 'Noel.SomeChildValue.SecondTier');
						let tmpNullValueTwoDeepObject = _Manyfest.getValueAtAddress(tmpNullSampleData, 'Noel.SomeChildValue[SecondTier]');
						let tmpNullValueTwoDeepArray = _Manyfest.getValueAtAddress(tmpNullSampleData, 'Noel.SomeChildValue.SecondTier[0]');
						Expect(tmpNullValue).to.equal(null);
						Expect(tmpNullValueOneDeep).to.equal(undefined);
						Expect(tmpNullValueTwoDeep).to.equal(undefined);
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
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(_SampleDataArchiveOrgFrankenberry.metadata.creator)
							.to.equal(tmpCreator);
						Expect(tmpCreator)
							.to.equal('General Mills');
						fTestComplete();
					}
				);
				test
				(
					'Return default values when none are supplied.',
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

							Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { CET:200 }},Name:'Froggy'}, 'ComfET')).to.equal(200);
							Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'ComfET')).to.equal('96.8');
							Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'CurrentTemperature')).to.equal(undefined);

							Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { CET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.CET')).to.equal(200);
							Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.CET')).to.equal('96.8');
							Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.HighET')).to.equal(undefined);

						fTestComplete();
					}
				);
			}
		);
		suite
		(
			'Advanced Read (with Arrays and Boxed Property and Backwards navigation addresses)',
			()=>
			{
				test
				(
					'Access relative objects',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						// Traverse a relative address
						let tmpVideoPointer = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'files[0]');
						Expect(tmpVideoPointer.original).to.equal('frankerberry_countchockula_1971.0001.mpg');
						// The .. means go back one level
						let tmpDir = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'files[0]..dir');
						Expect(tmpDir).to.equal("/7/items/FrankenberryCountChoculaTevevisionCommercial1971");
						fTestComplete();
					}
				);
				test
				(
					'Access relative objects complexly',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						Expect(_Manyfest.getValueAtAddress(_SampleDataYahooWeather, 'location.city')).to.equal('Sunnyvale');
						// The .. means go back one level
						Expect(_Manyfest.getValueAtAddress(_SampleDataYahooWeather, 'current_observation.wind...location.city')).to.equal('Sunnyvale');
						fTestComplete();
					}
				);
				test
				(
					'Access specific array elements',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpDog = _Manyfest.getValueAtAddress({Dogs:['Fido','Spot','Trinity']}, 'Dogs[1]');
						Expect(tmpDog)
							.to.equal('Spot');
						fTestComplete();
					}
				);
				test
				(
					'Access specific boxed properties',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpDog = _Manyfest.getValueAtAddress({Dogs:{RunnerUp:'Fido',Loser:'Spot',Winner:'Trinity'}}, 'Dogs["Winner"]');
						Expect(tmpDog)
							.to.equal('Trinity');
						fTestComplete();
					}
				);
				test
				(
					'Attempt to access specific boxed properties that do not exist',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpDog = _Manyfest.getValueAtAddress({Dogs:{RunnerUp:'Fido',Loser:'Spot',Winner:'Trinity'}}, 'Dogs["Disqualified"]');
						Expect(tmpDog)
							.to.be.an('undefined');
						let tmpWinner = _Manyfest.getValueAtAddress({Dogs:{RunnerUp:'Fido',Loser:'Spot',Winner:'Trinity'}}, 'Dogs["Winner"]');
						Expect(tmpWinner)
							.to.equal('Trinity');
						fTestComplete();
					}
				);
				test
				(
					'Access nested box properties',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpDog = _Manyfest.getValueAtAddress({Dogs:{RunnerUp:{Name:'Fido',Speed:100},Loser:{Name:'Spot'},Winner:{Name:'Trinity'}}}, 'Dogs["RunnerUp"].Name');
						Expect(tmpDog)
							.to.equal('Fido');
						fTestComplete();
					}
				);
				test
				(
					'Access nested array properties',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpDog = _Manyfest.getValueAtAddress({Kennel:[{Name:'Fido',Speed:100},{Name:'Spot'},{Name:'Trinity'}]}, 'Kennel[1].Name');
						Expect(tmpDog)
							.to.equal('Spot');
						fTestComplete();
					}
				);
				test
				(
					'Access Functions',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let tmpComplexObject = (
						{
							"Name": "Yadda",
							"TheFunction": (pValue) => { return `Value is: ${pValue}`; }
						});

						Expect(_Manyfest.getValueAtAddress(tmpComplexObject, 'Name'))
							.to.equal('Yadda');

						Expect(_Manyfest.getValueAtAddress(tmpComplexObject, 'TheFunction()'))
							.to.equal('Value is: undefined');

						Expect(_Manyfest.getValueAtAddress(tmpComplexObject, 'TheFunction(Name)'))
							.to.equal('Value is: Yadda');

						fTestComplete();
					}
				);
				test
				(
					'Complex Functions that Mutate State and deal with Parameters',
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
										"BrokenObject": function() { throw new Error('This is a thrown error message!'); },
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

						Expect(_Manyfest.getValueAtAddress(_MockObject, 'Name')).to.equal('Yadda');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'TheFunction()')).to.equal('Value is: undefined');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'TheFunction(Name)')).to.equal('Value is: Yadda');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'ComplexFunction(Name,Name)')).to.equal('Value is: Yadda and would output as Yadda');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'TheFunction("Barney")')).to.equal('Value is: Barney');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'TheFunction("0")')).to.equal('Value is: 0');

						// This is stupid but works
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'ComplexFunction(Name,TheFunction(Manyfest.Descriptors["metadata.creator"].Hash))'))
							.to.equal('Value is: Yadda and would output as Value is: Creator');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'ComplexFunction("Jim",TheFunction("Janet"))'))
							.to.equal('Value is: Jim and would output as Value is: Janet');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'ComplexFunction("Jet","Janet")'))
							.to.equal('Value is: Jet and would output as Janet');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'ComplexFunction("Jim",TheFunction(Manyfest.Descriptors["metadata.creator"].Hash))'))
							.to.equal('Value is: Jim and would output as Value is: Creator');

						Expect(_Manyfest.getValueAtAddress(_MockObject, 'Behaviors.Increment()'))
							.to.equal(1);

						Expect(_Manyfest.getValueAtAddress(_MockObject, 'Behaviors.SillyObject().Stores[0]')).to.equal('Aberdeen');
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'Behaviors.SillyFUNCTIONNOTFOUND().Stores[0]')).to.equal(false);
						Expect(_Manyfest.getValueAtAddress(_MockObject, 'Behaviors.BrokenObject().Stores[0]')).to.equal(false);

						fTestComplete();
					}
				);
			}
		);
	}
);
