/**
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');

/**
* Object Address Generation
*
* Automagically generate addresses and properties based on a passed-in object,
* to be used for easy creation of schemas.  Meant to simplify the lives of
* developers wanting to create schemas without typing a bunch of stuff.
*
* IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
*                 be extremely clear what is going on in the recursion for
*                 each of the three address resolution functions.
*
*                 Although there is some opportunity to repeat ourselves a
*                 bit less in this codebase (e.g. with detection of arrays
*                 versus objects versus direct properties), it can make
*                 debugging.. challenging.  The minified version of the code
*                 optimizes out almost anything repeated in here.  So please
*                 be kind and rewind... meaning please keep the codebase less
*                 terse and more verbose so humans can comprehend it.
*
*
* @class ManyfestObjectAddressGeneration
*/
class ManyfestObjectAddressGeneration
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) == 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) == 'function') ? pErrorLog : libSimpleLog;
	}

	// generateAddressses
	//
	// This flattens an object into a set of key:value pairs for *EVERY SINGLE
	// POSSIBLE ADDRESS* in the object.  It can get ... really insane really
	// quickly.  This is not meant to be used directly to generate schemas, but
	// instead as a starting point for scripts or UIs.
	//
	// This will return a mega set of key:value pairs with all possible schema
	// permutations and default values (when not an object) and everything else.
	generateAddressses (pObject, pBaseAddress, pSchema)
	{
		let tmpBaseAddress = (typeof(pBaseAddress) == 'string') ? pBaseAddress : '';
		let tmpSchema = (typeof(pSchema) == 'object') ? pSchema : {};

		let tmpObjectType = typeof(pObject);

		let tmpSchemaObjectEntry = (
			{
				Address: tmpBaseAddress,
				Hash: tmpBaseAddress,
				Name: tmpBaseAddress,
				// This is so scripts and UI controls can force a developer to opt-in.
				InSchema: false
			}
		)

		if ((tmpObjectType == 'object') && (pObject == null))
		{
			tmpObjectType = 'null';
		}

		switch(tmpObjectType)
		{
			case 'string':
				tmpSchemaObjectEntry.DataType = 'String';
				tmpSchemaObjectEntry.Default = pObject;
				tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
				break;
			case 'number':
			case 'bigint':
				tmpSchemaObjectEntry.DataType = 'Number';
				tmpSchemaObjectEntry.Default = pObject;
				tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
				break;
			case 'undefined':
			case 'null':
				tmpSchemaObjectEntry.DataType = 'Any';
				tmpSchemaObjectEntry.Default = pObject;
				tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
				break;
			case 'object':
				if (Array.isArray(pObject))
				{
					tmpSchemaObjectEntry.DataType = 'Array';
					if (tmpBaseAddress != '')
					{
						tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
					}

					for (let i = 0; i < pObject.length; i++)
					{
						this.generateAddressses(pObject[i], `${tmpBaseAddress}[${i}]`, tmpSchema);
					}
				}
				else
				{
					tmpSchemaObjectEntry.DataType = 'Object';
					if (tmpBaseAddress != '')
					{
						tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
						tmpBaseAddress += '.';
					}

					let tmpObjectProperties = Object.keys(pObject);

					for (let i = 0; i < tmpObjectProperties.length; i++)
					{
						this.generateAddressses(pObject[tmpObjectProperties[i]], `${tmpBaseAddress}${tmpObjectProperties[i]}`, tmpSchema);
					}
				}
				break;
			case 'symbol':
			case 'function':
				// Symbols and functions neither recurse nor get added to the schema
				break;
		}

		return tmpSchema;
	}
};

module.exports = ManyfestObjectAddressGeneration;