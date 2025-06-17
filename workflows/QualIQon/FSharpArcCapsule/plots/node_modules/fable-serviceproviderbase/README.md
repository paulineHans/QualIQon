# Fable Service Provider

A very basic set of base classes to provide the interface for Fable services.
This is used for instantiating connections to databases, extending core
services and whatever other services.

Some service types Fable provides out of the box:

* settings
* logging
* uuid
* templating


## Basic Services

There are two types of services -- just requiring the class provides a base 
class for most services.  The constructor for this type takes in a fully
initialized fable object.

```
const libFableServiceProviderBase = require('fable-serviceproviderbase');

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
```

## Core Pre-initialization Services

For some service types, we want to instantiate behaviors before the fable
class has been initialized.  These use a special service base that defers
the connection of an initialized fable object until after it's created.

The one caveat here is the fable service doesn't provide consistent settings,
log or uuid functionality until they have been initialized and mapped in.

If you want to use this base class, please refer to the fable service 
manager code as well to get a good understanding of how initialization 
differs from the basic services.


```
const libFableServiceProviderBase = require('fable-serviceproviderbase');

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
```
