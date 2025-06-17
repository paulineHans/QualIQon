/**
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');
let fCleanWrapCharacters = require('./Manyfest-CleanWrapCharacters.js');
let fParseConditionals = require(`../source/Manyfest-ParseConditionals.js`);

let _MockFable = { DataFormat: require('./Manyfest-ObjectAddress-Parser.js') };

/**
* Object Address Resolver - GetValue
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
* @class ManyfestObjectAddressResolverGetValue
*/
class ManyfestObjectAddressResolverGetValue
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) == 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) == 'function') ? pErrorLog : libSimpleLog;

		this.cleanWrapCharacters = fCleanWrapCharacters;
	}

	checkRecordFilters(pAddress, pRecord)
	{
		return fParseConditionals(this, pAddress, pRecord);
	}

	// Get the value of an element at an address
	getValueAtAddress (pObject, pAddress, pParentAddress, pRootObject)
	{
		// Make sure pObject (the object we are meant to be recursing) is an object (which could be an array or object)
		if (typeof(pObject) != 'object')
		{
			return undefined;
		}
		if (pObject === null)
		{
			return undefined;
		}
		// Make sure pAddress (the address we are resolving) is a string
		if (typeof(pAddress) != 'string')
		{
			return undefined;
		}
		// Stash the parent address for later resolution
		let tmpParentAddress = "";
		if (typeof(pParentAddress) == 'string')
		{
			tmpParentAddress = pParentAddress;
		}

		// Set the root object to the passed-in object if it isn't set yet.  This is expected to be the root object.
		let tmpRootObject = (typeof(pRootObject) == 'undefined') ? pObject : pRootObject;

		// DONE: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
		let tmpAddressPartBeginning = _MockFable.DataFormat.stringGetFirstSegment(pAddress);

		// Adding simple back-navigation in objects
		if (tmpAddressPartBeginning == '')
		{
			// Given an address of "Bundle.Contract.IDContract...Project.IDProject" the ... would be interpreted as two back-navigations from IDContract.
			// When the address is passed in, though, the first . is already eliminated.  So we can count the dots.
			let tmpParentAddressParts = _MockFable.DataFormat.stringGetSegments(tmpParentAddress);

			let tmpBackNavigationCount = 0;

			// Count the number of dots
			for (let i = 0; i < pAddress.length; i++)
			{
				if (pAddress.charAt(i) != '.')
				{
					break;
				}
				tmpBackNavigationCount++;
			}

			let tmpParentAddressLength = tmpParentAddressParts.length - tmpBackNavigationCount;

			if (tmpParentAddressLength < 0)
			{
				// We are trying to back navigate more than we can.
				// TODO: Should this be undefined or should we bank out at the bottom and try to go forward?
				// This seems safest for now.
				return undefined;
			}
			else
			{
				// We are trying to back navigate to a parent object.
				// Recurse with the back-propagated parent address, and, the new address without the back-navigation dots.
				let tmpRecurseAddress = pAddress.slice(tmpBackNavigationCount);
				if (tmpParentAddressLength > 0)
				{
					tmpRecurseAddress = `${tmpParentAddressParts.slice(0, tmpParentAddressLength).join('.')}.${tmpRecurseAddress}`;
				}
				this.logInfo(`Back-navigation detected.  Recursing back to address [${tmpRecurseAddress}]`);
				return this.getValueAtAddress(tmpRootObject, tmpRecurseAddress);
			}
		}

		// This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
		if (tmpAddressPartBeginning.length == pAddress.length)
		{
			// TODO: Optimize this by having these calls only happen when the previous fails.
			// TODO: Alternatively look for all markers in one pass?
			// Check if the address refers to a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');

			// Check for the Object Set Type marker.
			// Note this will not work with a bracket in the same address box set
			let tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');


			// Check if there is a function somewhere in the address... parenthesis start should only be in a function
			let tmpFunctionStartIndex = pAddress.indexOf('(');

			// NOTE THAT FUNCTIONS MUST RESOLVE FIRST
			// Functions look like this
			// 		MyFunction()
			// 		MyFunction(Some.Address)
			// 		MyFunction(Some.Address,Some.Other.Address)
			// 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
			//
			// This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
			// To heck with that.  This is a simple function call.
			//
			// The requirements to detect a function are:
			//    1) The start bracket is after character 0
			if ((tmpFunctionStartIndex > 0)
			//    2) The end bracket is after the start bracket
				&& (_MockFable.DataFormat.stringCountEnclosures(pAddress) > 0))
			{
				let tmpFunctionAddress = pAddress.substring(0, tmpFunctionStartIndex).trim();

				if (!typeof(pObject[tmpFunctionAddress]) == 'function')
				{
					// The address suggests it is a function, but it is not.
					return false;
				}

				// Now see if the function has arguments.
				// Implementation notes: * ARGUMENTS MUST SHARE THE SAME ROOT OBJECT CONTEXT *
				let tmpFunctionArguments = _MockFable.DataFormat.stringGetSegments(_MockFable.DataFormat.stringGetEnclosureValueByIndex(pAddress.substring(tmpFunctionAddress.length), 0), ',');
				if ((tmpFunctionArguments.length == 0) || (tmpFunctionArguments[0] == ''))
				{
					// No arguments... just call the function (bound to the scope of the object it is contained withing)
					if (tmpFunctionAddress in pObject)
					{
						try
						{
							return pObject[tmpFunctionAddress].apply(pObject);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							console.log(`Error in getValueAtAddress calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						console.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
						return false;
					}
				}
				else
				{
					let tmpArgumentValues = [];

					let tmpRootObject = (typeof(pRootObject) == 'undefined') ? pObject : pRootObject;

					// Now get the value for each argument
					for (let i = 0; i < tmpFunctionArguments.length; i++)
					{
						// Resolve the values for each subsequent entry
						// Check if the argument value is a string literal or a reference to an address
						if ((tmpFunctionArguments[i].length >= 2)
							&&
							((tmpFunctionArguments[i].charAt(0) == '"')
							|| (tmpFunctionArguments[i].charAt(0) == "'")
							|| (tmpFunctionArguments[i].charAt(0) == "`"))
							&&
							((tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == '"')
							|| (tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == "'")
							|| (tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == "`")))
						{
							// This is a string literal
							tmpArgumentValues.push(tmpFunctionArguments[i].substring(1, tmpFunctionArguments[i].length-1));
						}
						else
						{
							// This is a hash address
							tmpArgumentValues.push(this.getValueAtAddress(tmpRootObject, tmpFunctionArguments[i]));
						}
					}

					if (tmpFunctionAddress in pObject)
					{
						try
						{
							return pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							console.log(`Error in getValueAtAddress calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						console.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
						return false;
					}
				}
			}
			// Boxed elements look like this:
			// 		MyValues[10]
			// 		MyValues['Name']
			// 		MyValues["Age"]
			// 		MyValues[`Cost`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			else if ((tmpBracketStartIndex > 0)
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
					return undefined;
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
					return undefined;
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
					return pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference];
				}
				else
				{
					return pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber];
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
				let tmpOutputArray = [];
				for (let i = 0; i < tmpInputArray.length; i++)
				{
					// The filtering is complex but allows config-based metaprogramming directly from schema
					let tmpKeepRecord = this.checkRecordFilters(pAddress, tmpInputArray[i]);
					if (tmpKeepRecord)
					{
						tmpOutputArray.push(tmpInputArray[i]);

					}
				}

				return tmpOutputArray;
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

				return pObject[tmpObjectPropertyName];
			}
			else
			{
				// Now is the point in recursion to return the value in the address
				if (typeof(pObject[pAddress]) != null)
				{
					return pObject[pAddress];
				}
				else
				{
					return null;
				}
			}
		}
		else
		{
			//let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
			//let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);
			let tmpSubObjectName = tmpAddressPartBeginning;
			let tmpNewAddress = pAddress.substring(tmpAddressPartBeginning.length+1);

			// BOXED ELEMENTS
			// Test if the tmpNewAddress is an array or object
			// Check if it's a boxed property
			let tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
			let tmpBracketStopIndex = tmpSubObjectName.indexOf(']');

			// Check if there is a function somewhere in the address... parenthesis start should only be in a function
			let tmpFunctionStartIndex = tmpSubObjectName.indexOf('(');

			// NOTE THAT FUNCTIONS MUST RESOLVE FIRST
			// Functions look like this
			// 		MyFunction()
			// 		MyFunction(Some.Address)
			// 		MyFunction(Some.Address,Some.Other.Address)
			// 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
			//
			// This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
			// To heck with that.  This is a simple function call.
			//
			// The requirements to detect a function are:
			//    1) The start bracket is after character 0
			if ((tmpFunctionStartIndex > 0)
			//    2) The end bracket is after the start bracket
				&& (_MockFable.DataFormat.stringCountEnclosures(tmpSubObjectName) > 0))
			{
				let tmpFunctionAddress = tmpSubObjectName.substring(0, tmpFunctionStartIndex).trim();
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;

				if (!typeof(pObject[tmpFunctionAddress]) == 'function')
				{
					// The address suggests it is a function, but it is not.
					return false;
				}

				// Now see if the function has arguments.
				// Implementation notes: * ARGUMENTS MUST SHARE THE SAME ROOT OBJECT CONTEXT *
				let tmpFunctionArguments = _MockFable.DataFormat.stringGetSegments(_MockFable.DataFormat.stringGetEnclosureValueByIndex(tmpSubObjectName.substring(tmpFunctionAddress.length), 0), ',');
				if ((tmpFunctionArguments.length == 0) || (tmpFunctionArguments[0] == ''))
				{
					// No arguments... just call the function (bound to the scope of the object it is contained withing)
					if (tmpFunctionAddress in pObject)
					{
						try
						{
							return this.getValueAtAddress(pObject[tmpFunctionAddress].apply(pObject), tmpNewAddress, tmpParentAddress, tmpRootObject);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							console.log(`Error in getValueAtAddress calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						console.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
						return false;
					}
				}
				else
				{
					let tmpArgumentValues = [];

					let tmpRootObject = (typeof(pRootObject) == 'undefined') ? pObject : pRootObject;

					// Now get the value for each argument
					for (let i = 0; i < tmpFunctionArguments.length; i++)
					{
						// Resolve the values for each subsequent entry
						// Check if the argument value is a string literal or a reference to an address
						if ((tmpFunctionArguments[i].length >= 2)
							&&
							((tmpFunctionArguments[i].charAt(0) == '"')
							|| (tmpFunctionArguments[i].charAt(0) == "'")
							|| (tmpFunctionArguments[i].charAt(0) == "`"))
							&&
							((tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == '"')
							|| (tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == "'")
							|| (tmpFunctionArguments[i].charAt(tmpFunctionArguments[i].length-1) == "`")))
						{
							// This is a string literal
							tmpArgumentValues.push(tmpFunctionArguments[i].substring(1, tmpFunctionArguments[i].length-1));
						}
						else
						{
							// This is a hash address
							tmpArgumentValues.push(this.getValueAtAddress(tmpRootObject, tmpFunctionArguments[i]));
						}
					}

					if (tmpFunctionAddress in pObject)
					{
						try
						{
							return this.getValueAtAddress(pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues), tmpNewAddress, tmpParentAddress, tmpRootObject);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							console.log(`Error in getValueAtAddress calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						console.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
						return false;
					}
				}
			}
			// Boxed elements look like this:
			// 		MyValues[42]
			// 		MyValues['Color']
			// 		MyValues["Weight"]
			// 		MyValues[`Diameter`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			else if ((tmpBracketStartIndex > 0)
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
					return undefined;
				}
				// Check if the boxed property is an object.
				if (typeof(pObject[tmpBoxedPropertyName]) != 'object')
				{
					return undefined;
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
					return this.getValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress, tmpParentAddress, tmpRootObject);
				}
				else
				{
					// Continue to manage the parent address for recursion
					tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.getValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress, tmpParentAddress, tmpRootObject);
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
					let tmpValue = this.getValueAtAddress(pObject[tmpBoxedPropertyName][i], tmpNewAddress, tmpPropertyParentAddress, tmpRootObject);

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
					let tmpValue = this.getValueAtAddress(pObject[tmpObjectPropertyName][tmpObjectPropertyKeys[i]], tmpNewAddress, tmpPropertyParentAddress, tmpRootObject);

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
				return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress, tmpRootObject);
			}
			else
			{
				// Create a subobject and then pass that
				// Continue to manage the parent address for recursion
				tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;
				pObject[tmpSubObjectName] = {};
				return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress, tmpRootObject);
			}
		}
	}
};

module.exports = ManyfestObjectAddressResolverGetValue;