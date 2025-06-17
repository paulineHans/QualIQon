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
	'Manyfest Hash Translations',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Translation Operations',
			()=>
			{
				test
				(
					'A simple hash translation.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator)
							.to.equal('General Mills');
						// Create a translation between "Creator" and "Director"
						_Manyfest.hashTranslations.addTranslation({"Director":"Creator"});
						// Creator should still work
						tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator)
							.to.equal('General Mills');
						// Director should also work
						tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director');
						Expect(tmpCreator)
							.to.equal('General Mills');

						fTestComplete();
					}
				);
				test
				(
					'Multiple translations.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator).to.equal('General Mills');
						// Create a translation between "Creator" and "Director" as well as "Author"
						_Manyfest.hashTranslations.addTranslation({"Director":"Creator", "Author":"Creator"});
						// Creator should still work
						tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator).to.equal('General Mills');
						// Director should also work
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal('General Mills');
						// And Author!
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal('General Mills');

						fTestComplete();
					}
				);
				test
				(
					'Remove a translation.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Property not schema, accessed by hash:
						let tmpCreator = _Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator');
						Expect(tmpCreator).to.equal('General Mills');
						// Create a translation between "Creator" and "Director" as well as "Author"
						_Manyfest.hashTranslations.addTranslation({"Director":"Creator", "Author":"Creator"});
						Expect(tmpCreator).to.equal('General Mills');
						// Director should also work
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal('General Mills');
						// And Author!
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal('General Mills');
						// Now remove Director
						_Manyfest.hashTranslations.removeTranslation('Director');
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal('General Mills');
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal(undefined);

						fTestComplete();
					}
				);
				test
				(
					'Remove multiple translations.',
					(fTestComplete)=>
					{
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
						_Manyfest.hashTranslations.removeTranslation({'Director':true,'Author':'TheseValuesDontMatter'});
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Author')).to.equal(undefined);
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Director')).to.equal(undefined);
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Songwriter')).to.equal('General Mills');

						fTestComplete();
					}
				);
				test
				(
					'Remove all translations.',
					(fTestComplete)=>
					{
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

						fTestComplete();
					}
				);
				test
				(
					'Translate to a value not in the hashes, falling back to address.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});
						// Create a translation between "Creator" and "metadata.identifier", which isn't in the manifest in any way
						_Manyfest.hashTranslations.addTranslation({"Creator":"metadata.identifier"});
						// This address is not in the descriptor address list or the hash list
						Expect(_Manyfest.getValueAtAddress(_SampleDataArchiveOrgFrankenberry, 'metadata.identifier')).to.equal('FrankenberryCountChoculaTevevisionCommercial1971');
						// But now we've pointed the Creator hash to it!
						Expect(_Manyfest.getValueByHash(_SampleDataArchiveOrgFrankenberry, 'Creator')).to.equal('FrankenberryCountChoculaTevevisionCommercial1971');

						fTestComplete();
					}
				);
				test
				(
					'Add a bogus translation.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'Archive.org', Descriptors: {'metadata.creator': {Name:'Creator', Hash:'Creator'}}});

						Expect(_Manyfest.hashTranslations.addTranslation('THIS SHOULD BE AN OBJECT')).to.equal(false);

						Expect(_Manyfest.hashTranslations.translationCount()).to.equal(0);

						fTestComplete();
					}
				);
			}
		);
	}
);
