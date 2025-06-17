/**
* Unit tests for the Fable Settings Object
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

const libFableSettings = require('../source/Fable-Settings.js');

suite
(
	'Fable-Settings',
	function()
	{
		setup(()=>{});

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						var tmpFableSettings = new libFableSettings();
						Expect(tmpFableSettings)
							.to.be.an('object', 'Fable-Settings should initialize as an object directly from the require statement.');
						Expect(tmpFableSettings._PackageFableServiceProvider).to.be.an('object', 'Fable-Log should have a _PackageFableServiceProvider object.');
						Expect(tmpFableSettings._PackageFableServiceProvider.name).equal('fable-serviceproviderbase', 'Fable-Log _PackageFableServiceProvider.package.name should be set.');
						Expect(tmpFableSettings._Package).to.be.an('object', 'Fable-Settings should have a _Package object.');
						Expect(tmpFableSettings._Package.name).to.equal('fable-settings', 'Fable-Settings _Package.package.name should be set.');
					}
				);
				test
				(
					'legacy initialize should build a happy little object',
					function()
					{
						var tmpFableSettings = libFableSettings.new();
						Expect(tmpFableSettings)
							.to.be.an('object', 'Fable-Settings should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						var tmpFableSettings = new libFableSettings();
						Expect(tmpFableSettings).to.have.a.property('default')
							.that.is.a('object');
						Expect(tmpFableSettings).to.have.a.property('base')
							.that.is.a('object');
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('ApplicationNameHere');
					}
				);
			}
		);
		suite
		(
			'Customization and twiddling of settings',
			function()
			{
				test
				(
					'passing in a value',
					function()
					{
						var tmpFableSettings = new libFableSettings({Product:'TestProduct1'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('TestProduct1');
					}
				);
				test
				(
					'deep merging with a bad object passed in',
					function()
					{
						var tmpFableSettings = new libFableSettings({Product:'TestProduct1'});
						Expect(tmpFableSettings._deepMergeObjects({},null)).to.be.undefined;
					}
				);
				test
				(
					'manually defining a settings object',
					function()
					{
						var tmpFableSettings = new libFableSettings();
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('ApplicationNameHere');
						tmpFableSettings.merge({Product:'NewSettingsObject'});
						Expect(tmpFableSettings.settings.Product)
							.to.equal('NewSettingsObject');
						// Be sure defaults carry through
						Expect(tmpFableSettings.settings.ProductVersion)
							.to.equal('0.0.0');

						// Test the object fill method.
						tmpFableSettings.fill({ ComplexMerge: { DefaultKey: 'DefaultValue' } });
						const toFill =
						{
							Product:'DontOverwriteMe',
							SomeFancySetting:'CreateMe',
							ComplexMerge:
							{
								DefaultKey: 'IgnoredValue',
								NewKey: 'NewValue',
							},
						};
						const fillParameter = JSON.parse(JSON.stringify(toFill));
						tmpFableSettings.fill(fillParameter);
						// Fill should have ignored overwriting existing settings
						Expect(tmpFableSettings.settings.Product)
							.to.equal('NewSettingsObject');
						// Fill should have filled-in gaps in the union
						Expect(tmpFableSettings.settings.SomeFancySetting)
							.to.equal('CreateMe');
						// Exercise filling without a good value
						tmpFableSettings.fill();
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							DefaultKey: 'DefaultValue',
							NewKey: 'NewValue',
						});
						// ensure we didn't mutate the fill input
						Expect(toFill).to.deep.equal(fillParameter);
					}
				);
				test
				(
					'loading settings from a DEFAULT file',
					function()
					{
						var tmpFableSettings = new libFableSettings({DefaultConfigFile:__dirname+'/DefaultExampleSettings.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('BestProductEver - DEFAULT');
						Expect(tmpFableSettings.settings).to.have.a.property('ComplexMerge')
							.that.is.an('object');
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							DefaultKey: 'DefaultValue',
							OverriddenKey: 'IrrelevantValue',
						});
					}
				);
				test
				(
					'loading settings from a nonexistant DEFAULT file',
					function()
					{
						var tmpFableSettings = new libFableSettings({DefaultConfigFile:__dirname+'/NO_SETTINGS_HERE.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('ApplicationNameHere');
					}
				);
				test
				(
					'loading settings from a file',
					function()
					{
						var tmpFableSettings = new libFableSettings(
							{
								DefaultConfigFile:__dirname+'/DefaultExampleSettings.json',
								ConfigFile:__dirname+'/ExampleSettings.json'
							});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('BestProductEver');
						Expect(tmpFableSettings.settings.TestValue)
							.to.equal('NOT_OVERIDDEN');
						Expect(tmpFableSettings.settings).to.have.a.property('ComplexMerge')
							.that.is.an('object');
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							DefaultKey: 'DefaultValue',
							OverriddenKey: 'ImportantValue',
							NewKey: 'NewValue',
						});
					}
				);
				test
				(
					'loading settings from a nonexistant file',
					function()
					{
						var tmpFableSettings = new libFableSettings({ConfigFile:__dirname+'/NO_SETTINGS_HERE.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('ApplicationNameHere');
					}
				);
				test
				(
					'resolve environment variables',
					function()
					{
						process.env['NOT_DEFAULT'] = 'found_value';

						const tmpFableSettings = new libFableSettings(
						{
							DefaultConfigFile: `${__dirname}/DefaultExampleSettings.json`,
							ConfigFile: `${__dirname}/ExampleSettings.json`
						});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Environment')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Environment)
							.to.equal('found_value-default');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvironmentNoDefault')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.EnvironmentNoDefault)
							.to.equal('found_value-');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvArray')
							.that.is.an('array');
						Expect(tmpFableSettings.settings.EnvArray)
							.to.deep.equal(['found_value', 'default']);
						Expect(tmpFableSettings.settings).to.have.a.property('ComplexMerge')
							.that.is.an('object');
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							DefaultKey: 'DefaultValue',
							OverriddenKey: 'ImportantValue',
							NewKey: 'NewValue',
						});
					}
				);
				test
				(
					'ignores environment variables if disabled',
					function()
					{
						process.env['NOT_DEFAULT'] = 'found_value';

						const tmpFableSettings = new libFableSettings(
						{
							NoEnvReplacement: true,
							DefaultConfigFile: `${__dirname}/DefaultExampleSettings.json`,
							ConfigFile: `${__dirname}/ExampleSettings.json`
						});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Environment')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Environment)
							.to.equal('${NOT_DEFAULT|default}-${USE_DEFAULT|default}');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvironmentNoDefault')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.EnvironmentNoDefault)
							.to.equal('${NOT_DEFAULT}-${USE_DEFAULT}');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvArray')
							.that.is.an('array');
						Expect(tmpFableSettings.settings.EnvArray)
							.to.deep.equal(['${NOT_DEFAULT|default}', '${USE_DEFAULT|default}']);
						Expect(tmpFableSettings.settings).to.have.a.property('ComplexMerge')
							.that.is.an('object');
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							DefaultKey: 'DefaultValue',
							OverriddenKey: 'ImportantValue',
							NewKey: 'NewValue',
						});
					}
				);
				test
				(
					'updates environment variable replacement config after merging',
					function()
					{
						process.env['NOT_DEFAULT'] = 'found_value';

						const tmpFableSettings = new libFableSettings(
						{
							EnvReplaced: '${NOT_DEFAULT|waffle}',
							DefaultConfigFile: `${__dirname}/DisableEnvReplacement.json`,
							ConfigFile: `${__dirname}/ExampleSettings.json`
						});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvReplaced')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.EnvReplaced)
							.to.equal('found_value');
						Expect(tmpFableSettings.settings).to.have.a.property('Environment')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Environment)
							.to.equal('${NOT_DEFAULT|default}-${USE_DEFAULT|default}');
						Expect(tmpFableSettings.settings).to.have.a.property('EnvArray')
							.that.is.an('array');
						Expect(tmpFableSettings.settings.EnvArray)
							.to.deep.equal(['${NOT_DEFAULT|default}', '${USE_DEFAULT|default}']);
						Expect(tmpFableSettings.settings).to.have.a.property('ComplexMerge')
							.that.is.an('object');
						Expect(tmpFableSettings.settings.ComplexMerge).to.deep.equal(
						{
							OverriddenKey: 'ImportantValue',
							NewKey: 'NewValue',
						});
					}
				);
			}
		);
	}
);
