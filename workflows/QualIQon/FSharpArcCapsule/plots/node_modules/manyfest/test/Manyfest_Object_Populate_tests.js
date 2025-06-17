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
	'Manyfest Object Population',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Population',
			()=>
			{
				test
				(
					'Default properties should be auto created on populateDefaults.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Required":true, "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose).", "Default":"Jane Doe" }
									}
							});

						let tmpDefaultObject = animalManyfest.populateDefaults();

						Expect(tmpDefaultObject.Name)
							.to.equal('Jane Doe');
						Expect('IDAnimal' in tmpDefaultObject)
							.to.equal(false);

						fTestComplete();
					}
				);
				test
				(
					'All properties should be auto created on Populate.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Required":true, "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose).", "Default":"Jane Doe" }
									}
							});

						let tmpDefaultObject = animalManyfest.populateObject();

						Expect(tmpDefaultObject.Name)
							.to.equal('Jane Doe');
						Expect('IDAnimal' in tmpDefaultObject)
							.to.equal(true);
						Expect(tmpDefaultObject.IDAnimal)
							.to.equal(0);

						fTestComplete();
					}
				);
				test
				(
					'We should be able to pass a custom filter to populate the object.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Required":true, "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose).", "Default":"Jane Doe" }
									}
							});

						let tmpDefaultObject = animalManyfest.populateObject(undefined, false, (pDescriptor) => { return pDescriptor.Name == 'Database ID' });

						Expect(tmpDefaultObject.Name)
							.to.equal(undefined);
						Expect('IDAnimal' in tmpDefaultObject)
							.to.equal(true);
						Expect(tmpDefaultObject.IDAnimal)
							.to.equal(0);

						fTestComplete();
					}
				);
				test
				(
					'We should be able to force overwrites on properties.',
					(fTestComplete)=>
					{
						let tmpObject = { "Name": "Jennifer" };
						let animalManyfest = new libManyfest(
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Required":true, "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose).", "Default":"Jane Doe" }
									}
							});

						Expect(tmpObject.Name)
							.to.equal("Jennifer");

						animalManyfest.populateDefaults(tmpObject, true);

						Expect('IDAnimal' in tmpObject)
							.to.equal(false);

						// Because we told it to force overwrites, it should overwrite the Name.
						Expect(tmpObject.Name)
							.to.equal("Jane Doe");


						fTestComplete();
					}
				);
			}
		);
	}
);
