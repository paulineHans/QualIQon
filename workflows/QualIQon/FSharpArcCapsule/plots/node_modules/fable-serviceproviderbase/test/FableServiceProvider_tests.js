/**
* Unit tests for Fable Servi
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const libFable = require('fable');
const libFableServiceProviderBase = require('../source/Fable-ServiceProviderBase.js');

const Chai = require("chai");
const Expect = Chai.expect;

class SimpleService extends libFableServiceProviderBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'SimpleService';
    }

    doSomething()
    {
        this.fable.log.info(`SimpleService ${this.UUID}::${this.Hash} is doing something.`);
    }
}

class MockDatabaseService extends libFableServiceProviderBase
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'MockDatabaseService';
    }

    connect()
    {
        this.fable.log.info(`MockDatabaseService ${this.UUID}::${this.Hash} is connecting to a database.`);
    }

    commit(pRecord)
    {
        this.fable.log.info(`MockDatabaseService ${this.UUID}::${this.Hash} is committing a record ${pRecord}.`);
    }
}

class MockCoreService extends libFableServiceProviderBase.CoreServiceProviderBase
{
    constructor(pOptions, pServiceHash)
    {
        super(pOptions, pServiceHash);

        this.serviceType = 'MockCoreService';
    }

    // Core services should be able to provide their behaviors before the Fable object is fully initialized.
    magicBehavior(pData)
    {
        console.log(`MockCoreService ${this.UUID}::${this.Hash} is doing something magical with ${pData}.`);
    }
}

suite
(
	'Fable Service Manager',
	function()
	{
		var testFable = false;

		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Service Manager',
			function()
			{
				test
				(
					'Manually initialize a Service',
					function()
					{
						testFable = new libFable();

                        let tmpSimpleService = new SimpleService(testFable, {SomeOption: true});

                        tmpSimpleService.doSomething();

                        Expect(tmpSimpleService.Hash).to.be.a('string');

                        Expect(tmpSimpleService._PackageFableServiceProvider).to.be.an('object');
                        Expect(tmpSimpleService._PackageFableServiceProvider.name).to.equal('fable-serviceproviderbase');
                        Expect(tmpSimpleService._PackageFableServiceProvider.version)
					}
				);
				test
				(
					'Register a Service',
					function()
					{
						testFable = new libFable();
                        testFable.serviceManager.addServiceType('SimpleService');
                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');

                        Expect(testFable.serviceManager.servicesMap['SimpleService']['SimpleService-123']).to.be.an('object');
					}
				);
				test
				(
					'Use the Default Service',
					function()
					{
						testFable = new libFable();
                        testFable.serviceManager.addServiceType('SimpleService', SimpleService);
                        let tmpSimpleService = testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-123');

                        Expect(testFable.serviceManager.servicesMap['SimpleService']['SimpleService-123']).to.be.an('object');

                        // The passed-in magic stuff should work too.
                        tmpSimpleService.log.info(`There were almost ${tmpSimpleService.services.DataFormat.formatterDollars(9821229.37)} dollars just lying here!`);

                        Expect(testFable.serviceManager.servicesMap['SimpleService']).to.be.an('object');

                        testFable.serviceManager.services.SimpleService.doSomething();

                        Expect(testFable.serviceManager.services['SimpleService'].Hash).to.equal('SimpleService-123');
					}
				);
                test
                (
                    'Use the Default Service with a different hash',
                    function()
                    {
                        let testFable = new libFable({});

                        testFable.serviceManager.addServiceType('SimpleService', SimpleService);

                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true}, 'SimpleService-13');

                        testFable.serviceManager.servicesMap['SimpleService']['SimpleService-13'].doSomething();

                        Expect(testFable.serviceManager.servicesMap['SimpleService']['SimpleService-13']).to.be.an('object');
                    }
                );

                test
                (
                    'Instantiate a service without registering it to Fable',
                    function()
                    {
                        let testFable = new libFable({});

                        testFable.serviceManager.addServiceType('SimpleService', SimpleService);

                        let tmpService = testFable.serviceManager.instantiateServiceProviderWithoutRegistration('SimpleService', {SomeOption: true}, 'SimpleService-99');

                        Expect(testFable.servicesMap.SimpleService['SimpleService-99']).to.be.an('undefined');

                        Expect(tmpService).to.be.an('object');
                    }
                );

                test
                (
                    'Change the default service provider',
                    function()
                    {
                        let testFable = new libFable({});

                        testFable.serviceManager.addServiceType('SimpleService', SimpleService);
                        testFable.serviceManager.addServiceType('DatabaseService', MockDatabaseService);

                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true});
                        testFable.serviceManager.services.SimpleService.doSomething();

                        testFable.serviceManager.instantiateServiceProvider('DatabaseService', {ConnectionString: 'mongodb://localhost:27017/test'}, 'PrimaryConnection');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('PrimaryConnection');

                        testFable.serviceManager.instantiateServiceProvider('DatabaseService', {ConnectionString: 'mongodb://localhost:27017/test'}, 'SecondaryConnection');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('PrimaryConnection');

                        testFable.serviceManager.services.DatabaseService.connect();
                        testFable.serviceManager.services.DatabaseService.commit('Test Record');

                        testFable.serviceManager.setDefaultServiceInstantiation('DatabaseService', 'SecondaryConnection');

                        testFable.serviceManager.services.DatabaseService.connect();
                        testFable.serviceManager.services.DatabaseService.commit('Another Test Record');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('SecondaryConnection');
                    }
                );

                test
                (
                    'Construct a core service before Fable is initialized',
                    function()
                    {
                        let tmpCoreService = new MockCoreService({SomeOption: true});

                        Expect(tmpCoreService).to.be.an('object');

                        tmpCoreService.magicBehavior('MAGICTESTDATA');
                    }
                )
                test
                (
                    'Construct a core service with a hash before Fable is initialized',
                    function()
                    {
                        let tmpCoreService = new MockCoreService({SomeOption: true}, 'MockCoreService-1');

                        Expect(tmpCoreService).to.be.an('object');
                        Expect(tmpCoreService.Hash).to.equal('MockCoreService-1');

                        tmpCoreService.magicBehavior('MAGICTESTDATA');
                    }
                )

                test
                (
                    'Construct a core service and attach it to Fable after Fable is initialized',
                    function()
                    {

                        let tmpCoreService = new MockCoreService({SomeOption: true}, 'MockCoreService-2');

                        Expect(tmpCoreService).to.be.an('object');
                        Expect(tmpCoreService.Hash).to.equal('MockCoreService-2');

                        let testFable = new libFable({});

                        testFable.serviceManager.connectPreinitServiceProviderInstance(tmpCoreService);

                        Expect(testFable.servicesMap.MockCoreService['MockCoreService-2']).to.be.an('object');
                        Expect(testFable.services.MockCoreService).to.be.an('object');

                        Expect(testFable.services.MockCoreService.fable.log).to.be.an('object');
                    }
                )

                test
                (
                    'Construct a service without a fable at all',
                    function()
                    {
                        let tmpService = new SimpleService({Setting:'Something'});

                        Expect(tmpService.options.Setting).to.equal('Something');
                        Expect(tmpService.UUID).to.be.a('string');
                    }
                )

                test
                (
                    'Attempt to change the default service provider to a nonexistant provider',
                    function()
                    {
                        let testFable = new libFable({});

                        testFable.serviceManager.addServiceType('SimpleService', SimpleService);
                        testFable.serviceManager.addServiceType('DatabaseService', MockDatabaseService);

                        testFable.serviceManager.instantiateServiceProvider('SimpleService', {SomeOption: true});
                        testFable.serviceManager.services.SimpleService.doSomething();

                        testFable.serviceManager.instantiateServiceProvider('DatabaseService', {ConnectionString: 'mongodb://localhost:27017/test'}, 'PrimaryConnection');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('PrimaryConnection');

                        testFable.serviceManager.instantiateServiceProvider('DatabaseService', {ConnectionString: 'mongodb://localhost:27017/test'}, 'SecondaryConnection');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('PrimaryConnection');

                        testFable.serviceManager.services.DatabaseService.connect();
                        testFable.serviceManager.services.DatabaseService.commit('Test Record');

                        Expect(testFable.serviceManager.setDefaultServiceInstantiation('DatabaseService', 'TertiaryConnection')).to.be.false;

                        testFable.serviceManager.services.DatabaseService.connect();
                        testFable.serviceManager.services.DatabaseService.commit('Another Test Record');

                        Expect(testFable.serviceManager.services.DatabaseService.Hash).to.equal('PrimaryConnection');
                    }
                );
			}
		);
	}
);