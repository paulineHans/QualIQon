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

let _AnimalManyfestSchema = (
	{
		"Scope": "Animal",
		"Descriptors":
			{
				"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
				"Name": { "Required":true, "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose)." },
				"Age": { "Required":false, "DataType":"PreciseNumber", "Description":"The animal's age in microseconds." }
			}
	});

suite
(
	'Manyfest Object Validation',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Validation',
			()=>
			{
				test
				(
					'Validate should not error when all required elements exist.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(_AnimalManyfestSchema);
						let tmpValidationResults = animalManyfest.validate({IDAnimal: 100, MedicalStats: { Temps: { CET:200 }},Name:'Froggy'});

						Expect(tmpValidationResults.Error)
							.to.equal(null);

						fTestComplete();
					}
				);
				test
				(
					'Validate should error when required elements do not exist.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(_AnimalManyfestSchema);
						let tmpValidationResults = animalManyfest.validate({MedicalStats: { Temps: { CET:200 }}});

						Expect(tmpValidationResults.Error)
							.to.equal(true);

						fTestComplete();
					}
				);
				test
				(
					'Validate should be able to test for dates.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(_AnimalManyfestSchema);
						let tmpValidationResults = animalManyfest.validate({IDAnimal: 100, MedicalStats: { Temps: { CET:200 }}});

						Expect(tmpValidationResults.Error)
							.to.equal(true);

						fTestComplete();
					}
				);
				test
				(
					'Validate should be able to test for precise numbers.',
					(fTestComplete)=>
					{
						let animalManyfest = new libManyfest(_AnimalManyfestSchema);

						let tmpValidationResults = animalManyfest.validate({IDAnimal:100, Name:"Froggy"});
						Expect(tmpValidationResults.Error).to.equal(null);

						// TODO: Should javascript numbers really be illegal in a PreciseNumber?
						tmpValidationResults = animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": 100});
						Expect(tmpValidationResults.Error).to.equal(true);

						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "101.5"}).Error).to.equal(null);
						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "10sss1.1.5"}).Error).to.equal(true);
						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "101.1.5"}).Error).to.equal(true);
						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "1.05612e5"}).Error).to.equal(null);
						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "-1.05612e5"}).Error).to.equal(null);
						Expect(animalManyfest.validate({IDAnimal:100, Name:"Froggy", "Age": "+342456732879057432890574189473218947328194728397418932741893274891273849012738947128390526753289104621980563219642154372891433467318946321784321201.54574328954326589467451829047832901473895634178561204732190847327891563421890561234890347289145642389057412389473218945632189473289473218947321894561234890473218947329856123478904723189042758234164123789041"}).Error).to.equal(null);

						fTestComplete();
					}
				);
			}
		);
	}
);
