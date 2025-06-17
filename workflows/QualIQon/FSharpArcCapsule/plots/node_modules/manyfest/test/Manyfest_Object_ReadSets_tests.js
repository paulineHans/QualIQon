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
let _SampleDataFruits = require('./Data-Fruits.json');

suite
(
	'Manyfest Object Read of Sets',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Array Set Reads',
			()=>
			{
				test
				(
					'We should be able to access sets of properties from arrays without schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});
						let tmpFileSet = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FileSet');
						Expect(Array.isArray(tmpFileSet)).to.equal(true);
						let tmpFileSizes = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FileSizes');
						Expect(Object.keys(tmpFileSizes).length).to.equal(17);
						let tmpQuantities = _Manyfest.getValueByHash({cores:[100,300,45,10,1]}, 'cores[]');
						fTestComplete();
					}
				);
				test
				(
					'We should be able to access arrays with or without boxes on the address.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});
						let tmpFileSet = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'files[]');
						Expect(Array.isArray(tmpFileSet)).to.equal(true);
						// There are 17 versions of this damn commercial....
						Expect(tmpFileSet.length).to.equal(17);
						let tmpFileSetUnboxed = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'files');
						Expect(Array.isArray(tmpFileSetUnboxed)).to.equal(true);
						fTestComplete();
					}
				);
				test
				(
					'We should be able to access arrays with a hash.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});
						let tmpFileSet = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FileSet');
						Expect(Array.isArray(tmpFileSet)).to.equal(true);
						// There are 17 versions of this damn commercial....
						Expect(tmpFileSet.length).to.equal(17);
						fTestComplete();
					}
				);
				test
				(
					'Attempting to access non-array properties as arrays should return false.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});
						let tmpFileSet = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'metadata.creator[]');
						Expect(tmpFileSet).to.equal(false);
						fTestComplete();
					}
				);
				test
				(
					'Arrays in sub-objects.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors: {}
							});

						Expect(_Manyfest.getValueAtAddress(_SampleDataFruits, 'FruityVice[3].name')).to.equal('Tomato');
						Expect(_Manyfest.getValueAtAddress({Fruit:_SampleDataFruits}, 'Fruit.FruityVice[3].name')).to.equal('Tomato');


						fTestComplete();
					}
				);
				test
				(
					'Sub-objects in arrays can be parsed and the values will be pulled in magically.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});
						let tmpFileSet = _Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'files[].size');
						Expect(tmpFileSet).to.be.an('object');
						Expect(tmpFileSet['files[13].size']).to.equal('31625216');
						fTestComplete();
					}
				);
			}
		);
		suite
		(
			'Basic Object Set Reads',
			()=>
			{
				test
				(
					'We should be able to access sets of properties from objects with schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
										'files[].size': {Name:'FileSizes', Hash:'FileSizes'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'},
										'metadata{}': {Name:'Metadata', Hash:'Metadata'}
									}
							});
						let tmpMetadata = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Metadata');
						Expect(tmpMetadata).to.be.an('object');
						fTestComplete();
					}
				);
				test
				(
					'We should be able to get declared objects without schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'RandomObject',
								Descriptors:{}
							});
						let tmpData = (
							{
								Name: "Menu",
								Ingredients: {
									"GUID-001": { cost:100, Name:'Carrot' },
									"GUID-002": { cost:102, Name:'Pea' },
									"GUID-003": { cost:13, Name:'Potato' },
									"GUID-004": { cost:1, Name:'Apple' },
									"GUID-005": { cost:190, Name:'Wine' },
									"GUID-006": { cost:2500, Name:'Steak' },
									"GUID-007": { cost:"44", Name:'Gristle' },
									"GUID-008": { cost:2, Name:'Cherry' },
									"GUID-009": { cost:14, Name:'Orange' },
									"GUID-010": { cost:1, Name:'Dandelion' },
								}
							});
						let tmpMetadata = _Manyfest.getValueAtAddress(tmpData, 'Ingredients{}');
						Expect(tmpMetadata).to.be.an('object');
						fTestComplete();
					}
				);
				test
				(
					'We should be able to declared object subobjects without schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'RandomObject',
								Descriptors:{}
							});
						let tmpData = (
							{
								Name: "Menu",
								Ingredients: {
									"GUID-001": { cost:100, Name:'Carrot' },
									"GUID-002": { cost:102, Name:'Pea' },
									"GUID-003": { cost:13, Name:'Potato' },
									"GUID-004": { cost:1, Name:'Apple' },
									"GUID-005": { cost:190, Name:'Wine' },
									"GUID-006": { cost:2500, Name:'Steak' },
									"GUID-007": { cost:"44", Name:'Gristle' },
									"GUID-008": { cost:2, Name:'Cherry' },
									"GUID-009": { cost:14, Name:'Orange' },
									"GUID-010": { cost:1, Name:'Dandelion' },
								}
							});
						let tmpMetadata = _Manyfest.getValueAtAddress(tmpData, 'Ingredients{}.cost');
						Expect(tmpMetadata).to.be.an('object');
						Expect(tmpMetadata['Ingredients.GUID-003.cost']).to.equal(13);
						fTestComplete();
					}
				);
			}
		);
	}
);
