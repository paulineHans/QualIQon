/**
* @author <steven@velozo.com>
*/
const libFableServiceProviderBase = require('fable-serviceproviderbase');

let libSimpleLog = require('./Manyfest-LogToConsole.js');

let libHashTranslation = require('./Manyfest-HashTranslation.js');
let libObjectAddressCheckAddressExists = require('./Manyfest-ObjectAddress-CheckAddressExists.js');
let libObjectAddressGetValue = require('./Manyfest-ObjectAddress-GetValue.js');
let libObjectAddressSetValue = require('./Manyfest-ObjectAddress-SetValue.js');
let libObjectAddressDeleteValue = require('./Manyfest-ObjectAddress-DeleteValue.js');
let libObjectAddressGeneration = require('./Manyfest-ObjectAddressGeneration.js');
let libSchemaManipulation = require('./Manyfest-SchemaManipulation.js');

const _DefaultConfiguration = { Scope:'DEFAULT', Descriptors: {} }

/**
* Manyfest object address-based descriptions and manipulations.
*
* @class Manyfest
*/
class Manyfest extends libFableServiceProviderBase
{
	constructor(pFable, pManifest, pServiceHash)
	{
		if (pFable === undefined)
		{
			super({});
		}
		else
		{
			super(pFable, pManifest, pServiceHash);
		}

        this.serviceType = 'Manifest';

		// Wire in logging
		this.logInfo = libSimpleLog;
		this.logError = libSimpleLog;

		// Create an object address resolver and map in the functions
		this.objectAddressCheckAddressExists = new libObjectAddressCheckAddressExists(this.logInfo, this.logError);
		this.objectAddressGetValue = new libObjectAddressGetValue(this.logInfo, this.logError);
		this.objectAddressSetValue = new libObjectAddressSetValue(this.logInfo, this.logError);
		this.objectAddressDeleteValue = new libObjectAddressDeleteValue(this.logInfo, this.logError);

		if (!('defaultValues' in this.options))
		{
			this.options.defaultValues = (
				{
					"String": "",
					"Number": 0,
					"Float": 0.0,
					"Integer": 0,
					"PreciseNumber": "0.0",
					"Boolean": false,
					"Binary": 0,
					"DateTime": 0,
					"Array": [],
					"Object": {},
					"Null": null
				});
		}
		if (!('strict' in this.options))
		{
			this.options.strict = false;
		}

		this.scope = undefined;
		this.elementAddresses = undefined;
		this.elementHashes = undefined;
		this.elementDescriptors = undefined;

		this.reset();

		if (typeof(this.options) === 'object')
		{
			this.loadManifest(this.options);
		}

		this.schemaManipulations = new libSchemaManipulation(this.logInfo, this.logError);
		this.objectAddressGeneration = new libObjectAddressGeneration(this.logInfo, this.logError);

		this.hashTranslations = new libHashTranslation(this.logInfo, this.logError);

		this.numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
	}

	/*************************************************************************
	 * Schema Manifest Loading, Reading, Manipulation and Serialization Functions
	 */

	// Reset critical manifest properties
	reset()
	{
		this.scope = 'DEFAULT';
		this.elementAddresses = [];
		this.elementHashes = {};
		this.elementDescriptors = {};
	}

	clone()
	{
		// Make a copy of the options in-place
		let tmpNewOptions = JSON.parse(JSON.stringify(this.options));

		let tmpNewManyfest = new Manyfest(this.getManifest(), this.logInfo, this.logError, tmpNewOptions);

		// Import the hash translations
		tmpNewManyfest.hashTranslations.addTranslation(this.hashTranslations.translationTable);

		return tmpNewManyfest;
	}

	// Deserialize a Manifest from a string
	deserialize(pManifestString)
	{
		// TODO: Add guards for bad manifest string
		return this.loadManifest(JSON.parse(pManifestString));
	}

	// Load a manifest from an object
	loadManifest(pManifest)
	{
		if (typeof(pManifest) !== 'object')
		{
			this.logError(`(${this.scope}) Error loading manifest; expecting an object but parameter was type ${typeof(pManifest)}.`);
		}

		let tmpManifest = (typeof(pManifest) == 'object') ? pManifest : {};

		let tmpDescriptorKeys = Object.keys(_DefaultConfiguration);

		for (let i = 0; i < tmpDescriptorKeys.length; i++)
		{
			if (!(tmpDescriptorKeys[i] in tmpManifest))
			{
				tmpManifest[tmpDescriptorKeys[i]] = JSON.parse(JSON.stringify(_DefaultConfiguration[tmpDescriptorKeys[i]]));
			}
		}

		if ('Scope' in tmpManifest)
		{
			if (typeof(tmpManifest.Scope) === 'string')
			{
				this.scope = tmpManifest.Scope;
			}
			else
			{
				this.logError(`(${this.scope}) Error loading scope from manifest; expecting a string but property was type ${typeof(tmpManifest.Scope)}.`, tmpManifest);
			}
		}
		else
		{
			this.logError(`(${this.scope}) Error loading scope from manifest object.  Property "Scope" does not exist in the root of the object.`, tmpManifest);
		}

		if ('Descriptors' in tmpManifest)
		{
			if (typeof(tmpManifest.Descriptors) === 'object')
			{
				let tmpDescriptionAddresses = Object.keys(tmpManifest.Descriptors);
				for (let i = 0; i < tmpDescriptionAddresses.length; i++)
				{
					this.addDescriptor(tmpDescriptionAddresses[i], tmpManifest.Descriptors[tmpDescriptionAddresses[i]]);
				}
			}
			else
			{
				this.logError(`(${this.scope}) Error loading description object from manifest object.  Expecting an object in 'Manifest.Descriptors' but the property was type ${typeof(tmpManifest.Descriptors)}.`, tmpManifest);
			}
		}
		else
		{
			this.logError(`(${this.scope}) Error loading object description from manifest object.  Property "Descriptors" does not exist in the root of the Manifest object.`, tmpManifest);
		}

		if ('HashTranslations' in tmpManifest)
		{
			if (typeof(tmpManifest.HashTranslations) === 'object')
			{
				for (let i = 0; i < tmpManifest.HashTranslations.length; i++)
				{
					// Each translation is 
				}
			}
		}
	}

	// Serialize the Manifest to a string
	serialize()
	{
		return JSON.stringify(this.getManifest());
	}

	getManifest()
	{
		return (
			{
				Scope: this.scope,
				Descriptors: JSON.parse(JSON.stringify(this.elementDescriptors)),
				HashTranslations: JSON.parse(JSON.stringify(this.hashTranslations.translationTable))
			});
	}

	// Add a descriptor to the manifest
	addDescriptor(pAddress, pDescriptor)
	{
		if (typeof(pDescriptor) === 'object')
		{
			// Add the Address into the Descriptor if it doesn't exist:
			if (!('Address' in pDescriptor))
			{
				pDescriptor.Address = pAddress;
			}

			if (!(pAddress in this.elementDescriptors))
			{
				this.elementAddresses.push(pAddress);
			}

			// Add the element descriptor to the schema
			this.elementDescriptors[pAddress] = pDescriptor;

			// Always add the address as a hash
			this.elementHashes[pAddress] = pAddress;

			if ('Hash' in pDescriptor)
			{
				// TODO: Check if this is a good idea or not..
				//       Collisions are bound to happen with both representations of the address/hash in here and developers being able to create their own hashes.
				this.elementHashes[pDescriptor.Hash] = pAddress;
			}
			else
			{
				pDescriptor.Hash = pAddress;
			}

			return true;
		}
		else
		{
			this.logError(`(${this.scope}) Error loading object descriptor for address '${pAddress}' from manifest object.  Expecting an object but property was type ${typeof(pDescriptor)}.`);
			return false;
		}
	}

	getDescriptorByHash(pHash)
	{
		return this.getDescriptor(this.resolveHashAddress(pHash));
	}

	getDescriptor(pAddress)
	{
		return this.elementDescriptors[pAddress];
	}

	// execute an action function for each descriptor
	eachDescriptor(fAction)
	{
        let tmpDescriptorAddresses = Object.keys(this.elementDescriptors);
        for (let i = 0; i < tmpDescriptorAddresses.length; i++)
        {
            fAction(this.elementDescriptors[tmpDescriptorAddresses[i]]);
        }

	}

	/*************************************************************************
	 * Beginning of Object Manipulation (read & write) Functions
	 */
	// Check if an element exists by its hash
	checkAddressExistsByHash (pObject, pHash)
	{
		return this.checkAddressExists(pObject,this.resolveHashAddress(pHash));
	}

	// Check if an element exists at an address
	checkAddressExists (pObject, pAddress)
	{
		return this.objectAddressCheckAddressExists.checkAddressExists(pObject, pAddress);
	}

	// Turn a hash into an address, factoring in the translation table.
	resolveHashAddress(pHash)
	{
		let tmpAddress = undefined;

		let tmpInElementHashTable = (pHash in this.elementHashes);
		let tmpInTranslationTable = (pHash in this.hashTranslations.translationTable);

		// The most straightforward: the hash exists, no translations.
		if (tmpInElementHashTable && !tmpInTranslationTable)
		{
			tmpAddress = this.elementHashes[pHash];
		}
		// There is a translation from one hash to another, and, the elementHashes contains the pointer end
		else if (tmpInTranslationTable && (this.hashTranslations.translate(pHash) in this.elementHashes))
		{
			tmpAddress = this.elementHashes[this.hashTranslations.translate(pHash)];
		}
		// Use the level of indirection only in the Translation Table
		else if (tmpInTranslationTable)
		{
			tmpAddress = this.hashTranslations.translate(pHash);
		}
		// Just treat the hash as an address.
		// TODO: Discuss this ... it is magic but controversial
		else
		{
			tmpAddress = pHash;
		}

		return tmpAddress;
	}

	// Get the value of an element by its hash
	getValueByHash (pObject, pHash)
	{
		let tmpValue = this.getValueAtAddress(pObject, this.resolveHashAddress(pHash));

		if (typeof(tmpValue) == 'undefined')
		{
			// Try to get a default if it exists
			tmpValue = this.getDefaultValue(this.getDescriptorByHash(pHash));
		}

		return tmpValue;
	}

	// Get the value of an element at an address
	getValueAtAddress (pObject, pAddress)
	{
		let tmpLintedAddress = pAddress.trim();
		if (tmpLintedAddress == '')
		{
			this.logError(`(${this.scope}) Error getting value at address; address is an empty string.`, pObject);
			return undefined;
		}
		let tmpValue = this.objectAddressGetValue.getValueAtAddress(pObject, pAddress);

		if (typeof(tmpValue) == 'undefined')
		{
			// Try to get a default if it exists
			tmpValue = this.getDefaultValue(this.getDescriptor(pAddress));
		}

		return tmpValue;
	}

	// Set the value of an element by its hash
	setValueByHash(pObject, pHash, pValue)
	{
		return this.setValueAtAddress(pObject, this.resolveHashAddress(pHash), pValue);
	}

	// Set the value of an element at an address
	setValueAtAddress (pObject, pAddress, pValue)
	{
		return this.objectAddressSetValue.setValueAtAddress(pObject, pAddress, pValue);
	}

	// Delete the value of an element by its hash
	deleteValueByHash(pObject, pHash, pValue)
	{
		return this.deleteValueAtAddress(pObject, this.resolveHashAddress(pHash), pValue);
	}

	// Delete the value of an element at an address
	deleteValueAtAddress (pObject, pAddress, pValue)
	{
		return this.objectAddressDeleteValue.deleteValueAtAddress(pObject, pAddress, pValue);
	}

	// Validate the consistency of an object against the schema
	validate(pObject)
	{
		let tmpValidationData =
		{
			Error: null,
			Errors: [],
			MissingElements:[]
		};

		if (typeof(pObject) !== 'object')
		{
			tmpValidationData.Error = true;
			tmpValidationData.Errors.push(`Expected passed in object to be type object but was passed in ${typeof(pObject)}`);
		}

		let addValidationError = (pAddress, pErrorMessage) =>
		{
			tmpValidationData.Error = true;
			tmpValidationData.Errors.push(`Element at address "${pAddress}" ${pErrorMessage}.`);
		};

		// Now enumerate through the values and check for anomalies based on the schema
		for (let i = 0; i < this.elementAddresses.length; i++)
		{
			let tmpDescriptor = this.getDescriptor(this.elementAddresses[i]);
			let tmpValueExists = this.checkAddressExists(pObject, tmpDescriptor.Address);
			let tmpValue = this.getValueAtAddress(pObject, tmpDescriptor.Address);

			if ((typeof(tmpValue) == 'undefined') || !tmpValueExists)
			{
				// This will technically mean that `Object.Some.Value = undefined` will end up showing as "missing"
				// TODO: Do we want to do a different message based on if the property exists but is undefined?
				tmpValidationData.MissingElements.push(tmpDescriptor.Address);
				if (tmpDescriptor.Required || this.options.strict)
				{
					addValidationError(tmpDescriptor.Address, 'is flagged REQUIRED but is not set in the object');
				}
			}

			// Now see if there is a data type specified for this element
			if (tmpDescriptor.DataType)
			{
				let tmpElementType = typeof(tmpValue);
				switch(tmpDescriptor.DataType.toString().trim().toLowerCase())
				{
					case 'string':
						if (tmpElementType != 'string')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case "precisenumber":
						if (tmpElementType != 'string')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						else if (!this.numberRegex.test(tmpValue))
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is not a valid number`);
						}
						break;

					case 'number':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case 'integer':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						else
						{
							let tmpValueString = tmpValue.toString();
							if (tmpValueString.indexOf('.') > -1)
							{
								// TODO: Is this an error?
								addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but has a decimal point in the number.`);
							}
						}
						break;

					case 'float':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case 'datetime':
						let tmpValueDate = new Date(tmpValue);
						if (tmpValueDate.toString() == 'Invalid Date')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is not parsable as a Date by Javascript`);
						}

					default:
						// Check if this is a string, in the default case
						// Note this is only when a DataType is specified and it is an unrecognized data type.
						if (tmpElementType != 'string')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} (which auto-converted to String because it was unrecognized) but is of the type ${tmpElementType}`);
						}
						break;
				}
			}
		}

		return tmpValidationData;
	}

	// Returns a default value, or, the default value for the data type (which is overridable with configuration)
	getDefaultValue(pDescriptor)
	{
		if (typeof(pDescriptor) != 'object')
		{
			return undefined;
		}

		if ('Default' in pDescriptor)
		{
			return pDescriptor.Default;
		}
		else
		{
			// Default to a null if it doesn't have a type specified.
			// This will ensure a placeholder is created but isn't misinterpreted.
			let tmpDataType = ('DataType' in pDescriptor) ? pDescriptor.DataType : 'String';
			if (tmpDataType in this.options.defaultValues)
			{
				return this.options.defaultValues[tmpDataType];
			}
			else
			{
				// give up and return null
				return null;
			}
		}
	}

	// Enumerate through the schema and populate default values if they don't exist.
	populateDefaults(pObject, pOverwriteProperties)
	{
		return this.populateObject(pObject, pOverwriteProperties,
			// This just sets up a simple filter to see if there is a default set.
			(pDescriptor) =>
			{
				return ('Default' in pDescriptor);
			});
	}

	// Forcefully populate all values even if they don't have defaults.
	// Based on type, this can do unexpected things.
	populateObject(pObject, pOverwriteProperties, fFilter)
	{
		// Automatically create an object if one isn't passed in.
		let tmpObject = (typeof(pObject) === 'object') ? pObject : {};
		// Default to *NOT OVERWRITING* properties
		let tmpOverwriteProperties = (typeof(pOverwriteProperties) == 'undefined') ? false : pOverwriteProperties;
		// This is a filter function, which is passed the schema and allows complex filtering of population
		// The default filter function just returns true, populating everything.
		let tmpFilterFunction = (typeof(fFilter) == 'function') ? fFilter : (pDescriptor) => { return true; };

		this.elementAddresses.forEach(
			(pAddress) =>
			{
				let tmpDescriptor = this.getDescriptor(pAddress);
				// Check the filter function to see if this is an address we want to set the value for.
				if (tmpFilterFunction(tmpDescriptor))
				{
					// If we are overwriting properties OR the property does not exist
					if (tmpOverwriteProperties || !this.checkAddressExists(tmpObject, pAddress))
					{
						this.setValueAtAddress(tmpObject, pAddress, this.getDefaultValue(tmpDescriptor));
					}
				}
			});

		return tmpObject;
	}
};

module.exports = Manyfest;