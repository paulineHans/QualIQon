/**
* Unit tests for basic Cache operations
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require('chai');
var Expect = Chai.expect;
var Assert = Chai.assert;

var libCash = require('../source/CacheTrax.js');

suite
(
	'CacheBasic',
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
						var testCache = new libCash();
						Expect(testCache)
							.to.be.an('object', 'Cache should initialize properly');
					}
				);
			}
		);

		suite
		(
			'Basic cache lookups',
			()=>
			{
				test
				(
					'create and find (or miss) nodes',
					() =>
					{
						var testCache = new libCash();

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');
						testCache.put('JKL', 'J');
						testCache.put('MNO', 'M');
						testCache.put('PQR', 'P');
						testCache.put('STU', 'S');
						testCache.put('VWX', 'V');
						testCache.put('YZ', 'Y');
						Expect(testCache._List.length).to.equal(9);
						Expect(testCache._List.tail.Datum).to.equal('YZ');

						// Read a value
						Expect(testCache.read('M')).to.equal('MNO');
						Expect(testCache.read('m')).to.equal(false);

						// Now try to update a node
						Expect(testCache.put('MNOPQ','M')).to.equal('MNOPQ');
						Expect(testCache.read('M')).to.equal('MNOPQ');
						Expect(testCache._List.length).to.equal(9);

						var tmpRecord = testCache.put('Keyless entry');
						Expect(tmpRecord).to.equal('Keyless entry');
						Expect(testCache.read('NODE[10]')).to.equal('Keyless entry');
					}
				);
				test
				(
					'manually expire nodes',
					() =>
					{
						var testCache = new libCash();

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');
						testCache.put('JKL', 'J');
						testCache.put('MNO', 'M');
						testCache.put('PQR', 'P');
						testCache.put('STU', 'S');
						testCache.put('VWX', 'V');
						testCache.put('YZ', 'Y');

						Expect(testCache._List.length).to.equal(9);

						// Read a value
						Expect(testCache.read('M')).to.equal('MNO');

						Expect(testCache.RecordMap.M).to.equal('MNO');

						// Now expire that value
						Expect(testCache.expire('M').Datum).to.equal('MNO');
						Expect(testCache._List.length).to.equal(8);

						Expect(testCache.read('M')).to.equal(false);

						// Now try to expire it again
						Expect(testCache.expire('M')).to.equal(false);
					}
				);
				test
				(
					'get actual node objects',
					() =>
					{
						var testCache = new libCash();

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');

						Expect(testCache.getNode('D').Hash).to.equal('D');
						Expect(testCache.getNode('D').Datum).to.equal('DEF');
						Expect(testCache.getNode('Z')).to.equal(false);
						Expect(testCache.getNode()).to.equal(false);

					}
				);
				test
				(
					'expire based on length',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.maxLength = 2;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						Expect(testCache._List.head.Datum).to.equal('ABC');
						Expect(testCache._List.tail.Datum).to.equal('DEF');
						Expect(testCache._List.length).to.equal(2);

						testCache.put('GHI', 'G');
						Expect(testCache._List.head.Datum).to.equal('DEF');
						Expect(testCache._List.tail.Datum).to.equal('GHI');
						Expect(testCache._List.length).to.equal(2);

						testCache.put('JKL', 'J');
						testCache.put('MNO', 'M');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('MNO');
						Expect(testCache._List.length).to.equal(2);

						// Now grow the cache, allowing it to hold more items.
						testCache.maxLength = 5
						testCache.put('PQR', 'P');
						testCache.put('STU', 'S');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('STU');
						Expect(testCache._List.length).to.equal(4);


						testCache.put('VWX', 'V');
						Expect(testCache._List.head.Datum).to.equal('JKL');
						Expect(testCache._List.tail.Datum).to.equal('VWX');
						Expect(testCache._List.length).to.equal(5);

						testCache.put('YZ', 'Y');
						Expect(testCache._List.head.Datum).to.equal('MNO');
						Expect(testCache._List.tail.Datum).to.equal('YZ');
						Expect(testCache._List.length).to.equal(5);

						// Now shrink it again... the list will only maintain its length until a prune occurs
						testCache.maxLength = 2;

						testCache.put('012', '0');
						Expect(testCache._List.head.Datum).to.equal('PQR');
						Expect(testCache._List.tail.Datum).to.equal('012');
						Expect(testCache._List.length).to.equal(5);

						testCache.prune((pRemovedRecords)=>
						{
							Expect(testCache._List.head.Datum).to.equal('YZ');
							Expect(testCache._List.tail.Datum).to.equal('012');
							Expect(testCache._List.length).to.equal(2);
							fDone();
						})
					}
				);
				test
				(
					'prune an empty set',
					(fDone) =>
					{
						var testCache = new libCash();


						testCache.prune((pRemovedRecords)=>
						{
							Expect(pRemovedRecords.length).to.equal(0);
							fDone();
						})
					}
				);
				test
				(
					'prune a set with no constraints',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.put('ABC','A');
						testCache.put('DEF','D');
						testCache.put('GHI','G');
						testCache.prune((pRemovedRecords)=>
						{
							Expect(pRemovedRecords.length).to.equal(0);
							fDone();
						})
					}
				);
				test
				(
					'expire based on age',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.maxAge = 250;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');

						// Now wait 300ms, add more, then prune.
						setTimeout(()=>
							{
								testCache.put('JKL', 'J');
								testCache.put('MNO', 'M');
								testCache.prune((pRemovedRecords)=>
								{
									Expect(testCache._List.head.Datum).to.equal('JKL');
									Expect(testCache._List.tail.Datum).to.equal('MNO');
									Expect(testCache._List.length).to.equal(2);
									fDone();
								})
							},300);
					}
				);
				test
				(
					'touch a record',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.maxAge = 250;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						let tmpFirstDRecord = testCache.getNode('D');
						testCache.put('GHI', 'G');

						// Now wait 300ms, add more, then prune.
						setTimeout(()=>
							{
								testCache.touch('D');
								let tmpSecondDRecord = testCache.getNode('D');
								Expect(tmpSecondDRecord.Metadata.Created).to.be.greaterThan(tmpFirstDRecord.Metadata.Created);
								Expect(testCache.touch('NotTHERE')).to.equal(false);
								testCache.put('JKL', 'J');
								testCache.put('MNO', 'M');
								testCache.prune((pRemovedRecords)=>
								{
									Expect(testCache._List.head.Datum).to.equal('DEF');
									Expect(testCache._List.tail.Datum).to.equal('MNO');
									Expect(testCache._List.length).to.equal(3);
									fDone();
								})
							},300);
					}
				);
				test
				(
					'expire based on length and age',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.maxAge = 100;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');

						// Now wait 300ms, add more, then prune.
						setTimeout(()=>
							{
								testCache.put('JKL', 'J');
								testCache.put('MNO', 'M');
								testCache.put('PQR', 'P');
								testCache.put('STU', 'S');
								testCache.put('VWX', 'V');
								testCache.put('YZ', 'Y');
								testCache.maxLength = 3;

								testCache.prune((pRemovedRecords)=>
								{
									Expect(testCache._List.head.Datum).to.equal('STU');
									Expect(testCache._List.tail.Datum).to.equal('YZ');
									Expect(testCache._List.length).to.equal(3);
									fDone();
								})
							},200);
					}
				);
				test
				(
					'expire only age when both length and age have expirations',
					(fDone) =>
					{
						var testCache = new libCash();

						testCache.maxAge = 100;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');

						// Now wait 300ms, add more, then prune.
						setTimeout(()=>
							{
								testCache.put('JKL', 'J');
								testCache.put('MNO', 'M');
								testCache.put('PQR', 'P');
								testCache.put('STU', 'S');
								testCache.put('VWX', 'V');
								testCache.put('YZ', 'Y');
								testCache.maxLength = 3;

								testCache.pruneBasedOnExpiration((pRemovedRecords)=>
								{
									Expect(testCache._List.head.Datum).to.equal('JKL');
									Expect(testCache._List.tail.Datum).to.equal('YZ');
									Expect(testCache._List.length).to.equal(6);
									fDone();
								})
							},200);
					}
				);
				test
				(
					'expire only length when both length and age have expirations',
					(fDone) =>
					{
						var testCache = new libCash();
						testCache.maxAge = 100;

						// Cache some data
						testCache.put('ABC', 'A');
						testCache.put('DEF', 'D');
						testCache.put('GHI', 'G');

						// Now wait 300ms, add more, then prune.
						setTimeout(()=>
							{
								testCache.put('JKL', 'J');
								testCache.put('MNO', 'M');
								testCache.put('PQR', 'P');
								testCache.put('STU', 'S');
								testCache.put('VWX', 'V');
								testCache.put('YZ', 'Y');

								testCache.maxLength = 8;

								testCache.pruneBasedOnLength((pRemovedRecords)=>
								{
									Expect(testCache._List.head.Datum).to.equal('DEF');
									Expect(testCache._List.tail.Datum).to.equal('YZ');
									Expect(testCache._List.length).to.equal(8);
									fDone();
								})
							},200);
					}
				);
				test
				(
					'expire based on passed in function',
					(fDone) =>
					{
						var testCache = new libCash();
						testCache.maxAge = 100;

						// Cache some data
						testCache.put(1, 'A');
						testCache.put(10, 'B');
						testCache.put(11, 'B2');
						testCache.put(100, 'C');
						testCache.put(101, 'C2');
						testCache.put(1000, 'D');
						testCache.put(1001, 'D2');
						testCache.put(10000, 'F');
						testCache.put(10001, 'F2');
						testCache.pruneCustom((pRemovedRecords)=>
						{
							Expect(testCache._List.head.Datum).to.equal(10);
							Expect(testCache._List.tail.Datum).to.equal(10000);
							Expect(testCache._List.length).to.equal(4);
							fDone();
						},
						(pDatum, pHash, pNode)=>
						{
							// Cull out everything that ends in a 1
							return (pDatum % 10 == 1);
						});
					}
				);
				test
				(
					'expire based on passed in function with state management',
					(fDone) =>
					{
						var testCache = new libCash();
						testCache.maxAge = 100;

						// Cache some data
						testCache.put(1, 'A');
						testCache.put(10, 'B');
						testCache.put(11, 'B2');
						testCache.put(100, 'C');
						testCache.put(101, 'C2');
						testCache.put(1000, 'D');
						testCache.put(1001, 'D2');
						testCache.put(10000, 'F');
						testCache.put(10001, 'F2');
						let tmpRemovedRecords = [];
						testCache.pruneCustom((pRemovedRecords)=>
						{
							Expect(testCache._List.head.Datum).to.equal(10);
							Expect(testCache._List.tail.Datum).to.equal(10000);
							Expect(testCache._List.length).to.equal(4);
							Expect(tmpRemovedRecords.length).to.equal(5);
							fDone();
						},
						(pDatum, pHash, pNode)=>
						{
							// Cull out everything that ends in a 1
							return (pDatum % 10 == 1);
						}, tmpRemovedRecords);
					}
				);
			}
		);
	}
);