/**
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');
let fCleanWrapCharacters = require('./Manyfest-CleanWrapCharacters.js');
let fParseConditionals = require(`../source/Manyfest-ParseConditionals.js`)

/**
* Object Address Resolver - DeleteValue
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
* TODO: Once we validate this pattern is good to go, break these out into
*       three separate modules.
*
* @class ManyfestObjectAddressResolverDeleteValue
*/
class ManyfestObjectAddressResolverDeleteValue
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) == 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) == 'function') ? pErrorLog : libSimpleLog;

		this.cleanWrapCharacters = fCleanWrapCharacters;
	}

	// TODO: Dry me
	checkRecordFilters(pAddress, pRecord)
	{
		return fParseConditionals(this, pAddress, pRecord);
	}

	// Delete the value of an element at an address
	deleteValueAtAddress (pObject, pAddress, pParentAddress)
	{
		// Make sure pObject (the object we are meant to be recursing) is an object (which could be an array or object)
		if (typeof(pObject) != 'object') return undefined;
		// Make sure pAddress (the address we are resolving) is a string
		if (typeof(pAddress) != 'string') return undefined;
		// Stash the parent address for later resolution
		let tmpParentAddress = "";
		if (typeof(pParentAddress) == 'string')
		{
			tmpParentAddress = pParentAddress;
		}

		// TODO: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
		let tmpSeparatorIndex = pAddress.indexOf('.');

		// This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
		if (tmpSeparatorIndex == -1)
		{
			// Check if the address refers to a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');

			// Check for the Object Set Type marker.
			// Note this will not work with a bracket in the same address box set
			let tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');

			// Boxed elements look like this:
			// 		MyValues[10]
			// 		MyValues['Name']
			// 		MyValues["Age"]
			// 		MyValues[`Cost`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0)
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex)
			//    3) There is data
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 1))
			{
				// The "Name" of the Object contained too the left of the bracket
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				// If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
				// This is a rare case where Arrays testing as Objects is useful
				if (typeof(pObject[tmpBoxedPropertyName]) !== 'object')
				{
					return false;
				}

				// The "Reference" to the property within it, either an array element or object property
				let tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();
				// Attempt to parse the reference as a number, which will be used as an array element
				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return false;
				}

				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to treat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynamic object property.
					// We would expect the property to be wrapped in some kind of quotes so strip them
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Return the value in the property
					delete pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference];
					return true;
				}
				else
				{
					delete pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber];
					return true;
				}
			}
			// The requirements to detect a boxed set element are:
			//    1) The start bracket is after character 0
			else if ((tmpBracketStartIndex > 0)
			//    2) The end bracket is after the start bracket
				&& (tmpBracketStopIndex > tmpBracketStartIndex)
			//    3) There is nothing in the brackets
				&& (tmpBracketStopIndex - tmpBracketStartIndex == 1))
			{
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				if (!Array.isArray(pObject[tmpBoxedPropertyName]))
				{
					// We asked for a set from an array but it isnt' an array.
					return false;
				}

				let tmpInputArray = pObject[tmpBoxedPropertyName];
				// Count from the end to the beginning so splice doesn't %&%#$ up the array
				for (let i = tmpInputArray.length - 1; i >= 0; i--)
				{
					// The filtering is complex but allows config-based metaprogramming directly from schema
					let tmpKeepRecord = this.checkRecordFilters(pAddress, tmpInputArray[i]);
					if (tmpKeepRecord)
					{
						// Delete elements end to beginning
						tmpInputArray.splice(i, 1);
					}
				}
				return true;
			}
			// The object has been flagged as an object set, so treat it as such
			else if (tmpObjectTypeMarkerIndex > 0)
			{
				let tmpObjectPropertyName = pAddress.substring(0, tmpObjectTypeMarkerIndex).trim();

				if (typeof(pObject[tmpObjectPropertyName]) != 'object')
				{
					// We asked for a set from an array but it isnt' an array.
					return false;
				}

				delete pObject[tmpObjectPropertyName];
				return true;
			}
			else
			{
				// Now is the point in recursion to return the value in the address
				delete pObject[pAddress];
				return true;
			}
		}
		else
		{
			let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
			let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);

			// BOXED ELEMENTS
			// Test if the tmpNewAddress is an array or object
			// Check if it's a boxed property
			let tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
			let tmpBracketStopIndex = tmpSubObjectName.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[42]
			// 		MyValues['Color']
			// 		MyValues["Weight"]
			// 		MyValues[`Diameter`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0)
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex)
			//    3) There is data
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 1))
			{
				let tmpBoxedPropertyName = tmpSubObjectName.substring(0, tmpBracketStartIndex).trim();

				let tmpBoxedPropertyReference = tmpSubObjectName.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();

				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students[1].Tardy
				//       BUT
				//         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
				//       BUT
				//         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
				// TODO: Should this be an error or something?  Should we keep a log of failures like this?
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return false;
				}
				// Check if the boxed property is an object.
				if (typeof(pObject[tmpBoxedPropertyName]) != 'object')
				{
					return false;
				}
				//This is a bracketed value
				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to reat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynanmic object property.
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Continue to manage the parent address for recursion
					tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
					// Recurse directly into the subobject
					return this.deleteValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress, tmpParentAddress);
				}
				else
				{
					// Continue to manage the parent address for recursion
					tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.deleteValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress, tmpParentAddress);
				}
			}
			// The requirements to detect a boxed set element are:
			//    1) The start bracket is after character 0
			else if ((tmpBracketStartIndex > 0)
			//    2) The end bracket is after the start bracket
				&& (tmpBracketStopIndex > tmpBracketStartIndex)
			//    3) There is nothing in the brackets
				&& (tmpBracketStopIndex - tmpBracketStartIndex == 1))
			{
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				if (!Array.isArray(pObject[tmpBoxedPropertyName]))
				{
					// We asked for a set from an array but it isnt' an array.
					return false;
				}

				// We need to enumerate the array and grab the addresses from there.
				let tmpArrayProperty = pObject[tmpBoxedPropertyName];
				// Managing the parent address is a bit more complex here -- the box will be added for each element.
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpBoxedPropertyName}`;
				// The container object is where we have the "Address":SOMEVALUE pairs
				let tmpContainerObject = {};
				for (let i = 0; i < tmpArrayProperty.length; i++)
				{
					let tmpPropertyParentAddress = `${tmpParentAddress}[${i}]`;
					let tmpValue = this.deleteValueAtAddress(pObject[tmpBoxedPropertyName][i], tmpNewAddress, tmpPropertyParentAddress);

					tmpContainerObject[`${tmpPropertyParentAddress}.${tmpNewAddress}`] = tmpValue;
				}

				return tmpContainerObject;
			}

			// OBJECT SET
			// Note this will not work with a bracket in the same address box set
			let tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');
			if (tmpObjectTypeMarkerIndex > 0)
			{
				let tmpObjectPropertyName = pAddress.substring(0, tmpObjectTypeMarkerIndex).trim();

				if (typeof(pObject[tmpObjectPropertyName]) != 'object')
				{
					// We asked for a set from an array but it isnt' an array.
					return false;
				}

				// We need to enumerate the Object and grab the addresses from there.
				let tmpObjectProperty = pObject[tmpObjectPropertyName];
				let tmpObjectPropertyKeys = Object.keys(tmpObjectProperty);
				// Managing the parent address is a bit more complex here -- the box will be added for each element.
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpObjectPropertyName}`;
				// The container object is where we have the "Address":SOMEVALUE pairs
				let tmpContainerObject = {};
				for (let i = 0; i < tmpObjectPropertyKeys.length; i++)
				{
					let tmpPropertyParentAddress = `${tmpParentAddress}.${tmpObjectPropertyKeys[i]}`;
					let tmpValue = this.deleteValueAtAddress(pObject[tmpObjectPropertyName][tmpObjectPropertyKeys[i]], tmpNewAddress, tmpPropertyParentAddress);

					// The filtering is complex but allows config-based metaprogramming directly from schema
					let tmpKeepRecord = this.checkRecordFilters(pAddress, tmpValue);
					if (tmpKeepRecord)
					{
						tmpContainerObject[`${tmpPropertyParentAddress}.${tmpNewAddress}`] = tmpValue;
					}
				}

				return tmpContainerObject;
			}

			// If there is an object property already named for the sub object, but it isn't an object
			// then the system can't set the value in there.  Error and abort!
			if ((tmpSubObjectName in pObject) && typeof(pObject[tmpSubObjectName]) !== 'object')
			{
				return undefined;
			}
			else if (tmpSubObjectName in pObject)
			{
				// If there is already a subobject pass that to the recursive thingy
				// Continue to manage the parent address for recursion
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
				return this.deleteValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress);
			}
			else
			{
				// Create a subobject and then pass that
				// Continue to manage the parent address for recursion
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
				pObject[tmpSubObjectName] = {};
				return this.deleteValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress);
			}
		}
	}
};

module.exports = ManyfestObjectAddressResolverDeleteValue;