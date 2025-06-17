Fable Settings
==============

A very simple, tolerant settings loading library.

[![Coverage Status](https://coveralls.io/repos/stevenvelozo/fable-settings/badge.svg?branch=master)](https://coveralls.io/r/stevenvelozo/fable-settings?branch=master) [![Build Status](https://travis-ci.org/stevenvelozo/fable-settings.svg?branch=master)](https://travis-ci.org/stevenvelozo/fable-settings)

Why
---

It became tiring to see a heap of boilerplate config file/defaults loading at the top of microservices and the like.

How
---

Install it with npm.

    $ npm install fable-settings

Fire it up and access some settings:

    var settings = require('fable-settings').new({Product: 'SomeProduct', Version: '9.10.11'});
    console.log('My product: '+settings.settings.Product);
    console.log('My version: '+settings.settings.Version);

Wanna get tricky?  Load settings from JSON:

    var settings = require('fable-settings').new({Product: 'SomeProduct', Version: '9.10.11', ConfigFile: '/home/strongbad/config.json'});

Or even merge settings in later:

    var settings = require('fable-settings').new({Product: 'SomeProduct', Version: '9.10.11'});
    console.log('My product: '+settings.settings.Product);
    console.log('My version: '+settings.settings.Version);
    settings.merge({FavoriteTool:'Slap Chop'});
    console.log('My Favorite Tool: '+settings.settings.FavoriteTool);

Unit Testing
------------

You can run the unit tests by executing:

    $ npm test

Or you can get the istanbul coverage report by executing:

    $ npm run coverage
