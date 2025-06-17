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
	'Embedded Solvers',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Set Filtration',
			()=>
			{
				test
				(
					'Underlying template processor should be able to filter records and be fast.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();

						let templateParser = require(`../source/Manyfest-ParseConditionals.js`);

						let tmpTestRecord = {Name:'Jimbo', Age:31, Pets:{Fido:'Dog',Spot:'Cat'}};

						let tmpTestTemplate = 'Document.FormData.Parsable.Filters[]<<~?Name,==,Jimbo?~>>';

						let tmpTestResult = templateParser(_Manyfest, tmpTestTemplate, tmpTestRecord);

						Expect(tmpTestResult).to.equal(true);

						tmpTestRecord.Name = 'Bob';

						Expect(templateParser(_Manyfest, tmpTestTemplate, tmpTestRecord)).to.equal(false);

						return fTestComplete();
					}
				)
				test
				(
					'Magic filters should be able to process non equality filters.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										// TODO: STRICKEN OUT BY DEPENDENCY HELL
                                        //'files[]<<~?length,EXISTS?~>>': {Name:'Files With a length Property', Hash:'FilesWithLength'},
                                        // 'files[]<<~?length,DNEX?~>>': {Name:'Files Without a length Property', Hash:'FilesWithoutLength'},
                                        // 'files[]<<~?length,DNEX?~>><<~?source,==,original?~>>': {Name:'Original Files With a length Property', Hash:'OriginalFilesWithLength'},
										// 'files[]<<~?thumbnail,EXISTS?~>>': {Name:'Thumbnail Bit is Explicitly Set', Hash:'ThumbnailExplicitlySet'},
										'files[]<<~?thumbnail,TRUE?~>>': {Name:'Thumbnail Files', Hash:'ThumbnailFiles'},
										'files[]<<~?thumbnail,FALSE?~>>': {Name:'Not Thumbnail Files', Hash:'NotThumbnailFiles'},
										'files[]<<~?format,LENGTH_LESS_THAN,8?~>>': {Name:'Short Format Files', Hash:'ShortFormatFiles'}
									}
							});

						// Grab magic filtered thumbnails
						// Also, the "thumbnail" property was added to the data later ... it's not actually from archive.org but I wanted to test this feature.
						let tmpThumbnailFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'ThumbnailFiles');
						Expect(tmpThumbnailFiles).to.be.an('array');
						Expect(tmpThumbnailFiles.length).to.equal(1);

						let tmpNotThumbnailFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'NotThumbnailFiles');
						Expect(tmpNotThumbnailFiles).to.be.an('array');
						Expect(tmpNotThumbnailFiles.length).to.equal(1);

						// TODO: Dependencies are the wurst
						// let tmpFilesWithLength = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FilesWithLength');
						// Expect(tmpFilesWithLength).to.be.an('array');
						// Expect(tmpFilesWithLength.length).to.equal(3);

						// let tmpOGFilesWithLength = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'OriginalFilesWithLength');
						// Expect(tmpOGFilesWithLength).to.be.an('array');
						// Expect(tmpOGFilesWithLength.length).to.equal(2);

						// let tmpFilesWithoutLength = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FilesWithoutLength');
						// Expect(tmpFilesWithoutLength).to.be.an('array');
						// Expect(tmpFilesWithoutLength.length).to.equal(14);

						// let tmpExplicitlyExists = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'ThumbnailExplicitlySet');
						// Expect(tmpExplicitlyExists).to.be.an('array');
						// Expect(tmpExplicitlyExists.length).to.equal(2);

						let tmpShortFormatFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'ShortFormatFiles');
						Expect(tmpShortFormatFiles).to.be.an('array');
						Expect(tmpShortFormatFiles.length).to.equal(1);

						fTestComplete();
					}
				);
				test
				(
					'Magic filters should be magic and process equality filters.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest(
							{
								Scope:'Archive.org',
								Descriptors:
									{
										'files[]': {Name:'Files', Hash:'FileSet'},
                                        'files[]<<~?format,==,Thumbnail?~>>': {Name:'Thumbnail Files', Hash:'ThumbnailFiles'},
                                        'files[]<<~?format,==,Metadata?~>>': {Name:'Metadata Files', Hash:'MetadataFiles'},
										'metadata.creator': {Name:'Creator', Hash:'Creator'}
									}
							});

						// Grab magic filtered thumbnails
						let tmpThumbnailFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'ThumbnailFiles');
						Expect(tmpThumbnailFiles).to.be.an('array');
						// There are 7 thumbnail files in the set.
						Expect(tmpThumbnailFiles.length).to.equal(7);

						// Grab magic filtered etadataFiles
						let tmpMetadataFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'MetadataFiles');
						Expect(tmpMetadataFiles).to.be.an('array');
						// There are 3 metadata files in the set.
						Expect(tmpMetadataFiles.length).to.equal(3);

						let tmpFiles = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'FileSet');
						Expect(tmpFiles).to.be.an('array');
						// There are 17 total files in the set.
						Expect(tmpFiles.length).to.equal(17);

						fTestComplete();
					}
				);
			}
		);
	}
);
