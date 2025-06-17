let libManyfest = require(`../source/Manyfest.js`);

let animalManyfest = new libManyfest()
    // {
    //     "Scope": "Animal",
    //     "Descriptors":
    //         {
    //             "IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
    //             "Name": { "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose)." },
    //             "Type": { "Description":"Whether or not the animal is wild, domesticated, agricultural, in a research lab or a part of a zoo.." }
    //         }
    // });

// Make up a cute and furry test creature
let testAnimal = {IDAnimal:8675309, Name:'BatBrains', Type:'Lab', Color:'Brown'};

// Check the Manyfest
let checkResults = animalManyfest.validate(testAnimal);

console.log(JSON.stringify(checkResults,null,4));