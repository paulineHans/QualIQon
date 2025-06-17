/**
* Unit tests for the Linked List ADT
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;
var Assert = Chai.assert;

var libLinkedList = require('../source/LinkedList.js');

suite
(
	'LinkedList',
	()=>
	{
		setup(()=>{});

		suite
		(
			'Object Sanity',
			()=>
			{
				test
				(
					'initialize should build a happy little object',
					() =>
					{
						var testList = new libLinkedList();
						Expect(testList)
							.to.be.an('object', 'Linked List should initialize as an object.');
					}
				);
			}
		);

		suite
		(
			'List Operations',
			()=>
			{
				test
				(
					'append nodes',
					() =>
					{
						var testList = new libLinkedList();
						testList.append(200001, 'Cost');
						Expect(testList.length).to.equal(1);
						testList.append('Amalgumation');
						Expect(testList.length).to.equal(2);
						Expect(testList.tail.Datum).to.equal('Amalgumation');
					}
				);
				test
				(
					'prepend nodes',
					() =>
					{
						var testList = new libLinkedList();
						testList.prepend(200001, 'Cost');
						Expect(testList.length).to.equal(1);
						testList.prepend('Amalgumation');
						Expect(testList.length).to.equal(2);
						Expect(testList.tail.Datum).to.equal(200001);
					}
				);
				test
				(
					'delete nodes',
					() =>
					{
						var testList = new libLinkedList();

						for (var i = 0; i < 1000; i++)
						{
							testList.append(`Node number ${i+1}`);
						}
						Expect(testList.length).to.equal(1000);

						// Now delete the 100th node
						var tmpNode = testList.seek(99);
						Expect(tmpNode.Datum).to.equal('Node number 100');
						testList.remove(tmpNode);

						// Check that the 101st node moved back, and that the shuffly shuffly all worked
						tmpNode = testList.seek(99);
						Expect(testList.length).to.equal(999);
						Expect(tmpNode.Datum).to.equal('Node number 101');
						Expect(tmpNode.LeftNode.Datum).to.equal('Node number 99');
						Expect(tmpNode.LeftNode.RightNode.Datum).to.equal('Node number 101');
						Expect(tmpNode.RightNode.Datum).to.equal('Node number 102');
						Expect(tmpNode.RightNode.LeftNode.Datum).to.equal('Node number 101');

						// Now remove 50 elements from the beginning
						for (var i = 0; i < 50; i++)
						{
							testList.remove(testList.head);
						}
						Expect(testList.length).to.equal(949);
						Expect(testList.head.Datum).to.equal('Node number 51');

						// Now remove 50 elements from the end
						for (var i = 0; i < 50; i++)
						{
							testList.remove(testList.tail);
						}
						Expect(testList.length).to.equal(899);
						Expect(testList.tail.Datum).to.equal('Node number 950');

						// Now remove all but two nodes using the pop function (this structure is FIFO for push and pop, so they come off the HEAD)
						for (var i = 0; i < 897; i++)
						{
							testList.pop();
						}
						Expect(testList.length).to.equal(2);
						Expect(testList.head.Datum).to.equal('Node number 949');
						Expect(testList.tail.Datum).to.equal('Node number 950');

						// Now remove the last node, cutting the list to 1
						testList.pop();
						Expect(testList.length).to.equal(1);
						Expect(testList.head.Datum).to.equal('Node number 950');
						Expect(testList.tail.Datum).to.equal('Node number 950');

						// Now remove the last node, cutting the list to 1
						testList.pop();
						Expect(testList.length).to.equal(0);
						Expect(testList.head.Datum).to.equal(undefined);
						Expect(testList.tail.Datum).to.equal(undefined);

						testList.push(1);
						testList.push(2);
						var tmpNode = testList.remove(testList.head);
						Expect(tmpNode.Datum).to.equal(1);
					}
				);
				test
				(
					'operations with bad data',
					() =>
					{
						var testList = new libLinkedList();
						Expect(testList.append()).to.equal(false);
						Expect(testList.prepend()).to.equal(false);
						Expect(testList.remove()).to.equal(false);
						Expect(testList.remove({Bacon:true})).to.equal(false);
						Expect(testList.seek()).to.equal(false);
						Expect(testList.seek(1)).to.equal(false);
						testList.push('ABC');
						Expect(testList.seek(1)).to.equal(false);

					}
				);
				test
				(
					'treating it like a FIFO queue',
					() =>
					{
						var testList = new libLinkedList();
						testList.push(1);
						testList.push(2);
						testList.push(3);
						testList.push(4);
						testList.push(5);
						testList.push(6);
						Expect(testList.head.Datum).to.equal(1);
						Expect(testList.tail.Datum).to.equal(6);
						Expect(testList.tail.LeftNode.Datum).to.equal(5);
						Expect(testList.pop().Datum).to.equal(1);
						Expect(testList.head.Datum).to.equal(2);
					}
				);
				test
				(
					'iterating objects',
					(fTestDone) =>
					{
						var testList = new libLinkedList();
						testList.push('This');
						testList.push('is');
						testList.push('not');
						testList.push('a');
						testList.push('drill');
						testList.push('.');
						testList.each((pDatum, pHash, fCallback)=>
							{
//								console.log(`Enumerating with node [${pHash}]: ${pDatum}`);
								if (pHash == 'NODE[1]')
									Expect(pDatum).to.equal('This');
								if (pHash == 'NODE[4]')
									Expect(pDatum).to.equal('a');
								fCallback();
							},
							(pError)=>
							{
								fTestDone();
							}
						);
					}
				);
				test
				(
					'iterating an empty set',
					(fTestDone) =>
					{
						var testList = new libLinkedList();
						testList.each((pHash, pDatum, fCallback)=>
							{
								fCallback();
							},
							(pError)=>
							{
								fTestDone();
							}
						);
					}
				);
				test
				(
					'iterating objects with an error',
					(fTestDone) =>
					{
						var testList = new libLinkedList();
						testList.push('This');
						testList.push('is');
						testList.push('not');
						testList.push('a');
						testList.push('drill');
						testList.push('.');
						testList.each((pDatum, pHash, fCallback)=>
							{
//								console.log(`Enumerating with node [${pHash}]: ${pDatum}`);
								if (pHash == 'NODE[2]')
									Expect(pDatum).to.equal('is');
								if (pHash == 'NODE[4]')
									return fCallback('Node 4 is erroneous!');
								return fCallback();
							},
							(pError)=>
							{
								Expect(pError).to.equal('Node 4 is erroneous!');
								return fTestDone();
							}
						);
					}
				);
			}
		);
	}
);