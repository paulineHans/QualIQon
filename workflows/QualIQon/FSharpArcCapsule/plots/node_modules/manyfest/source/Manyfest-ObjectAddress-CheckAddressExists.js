/**
* @author <steven@velozo.com>
*/
const libSimpleLog = require('./Manyfest-LogToConsole.js');
// This is for resolving functions mid-address
const libGetObjectValue = require('./Manyfest-ObjectAddress-GetValue.js');

// TODO: Just until this is a fable service.
let _MockFable = { DataFormat: require('./Manyfest-ObjectAddress-Parser.js') };

/**
* Object Address Resolver
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
* @class ManyfestObjectAddressResolverCheckAddressExists
*/
class ManyfestObjectAddressResolverCheckAddressExists
{
	constructor()
	{
		this.getObjectValueClass = new libGetObjectValue(libSimpleLog, libSimpleLog);
	}

	// Check if an address exists.
	//
	// This is necessary because the getValueAtAddress function is ambiguous on
	// whether the element/property is actually there or not (it returns
	// undefined whether the property exists or not).  This function checks for
	// existance and returns true or false dependent.
	checkAddressExists (pObject, pAddress, pRootObject)
	{
		// TODO: Should these throw an error?
		// Make sure pObject is an object
		if (typeof(pObject) != 'object') return false;
		// Make sure pAddress is a string
		if (typeof(pAddress) != 'string') return false;

		// Set the root object to the passed-in object if it isn't set yet.  This is expected to be the root object.
		// NOTE: This was added to support functions mid-stream
		let tmpRootObject = (typeof(pRootObject) == 'undefined') ? pObject : pRootObject;

		// DONE: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
		let tmpAddressPartBeginning = _MockFable.DataFormat.stringGetFirstSegment(pAddress);

		// This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
		if (tmpAddressPartBeginning.length == pAddress.length)
		{
			// Check if the address refers to a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');

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

				if (((tmpFunctionAddress in pObject)) && (typeof(pObject[tmpFunctionAddress]) == 'function'))
				{
					return true;
				}
				else
				{
					// The address suggests it is a function, but it is not.
					return false;
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

					// Check if the property exists.
					return (tmpBoxedPropertyReference in pObject[tmpBoxedPropertyName]);
				}
				else
				{
					// Use the new in operator to see if the element is in the array
					return (tmpBoxedPropertyNumber in pObject[tmpBoxedPropertyName]);
				}
			}
			else
			{
				// Check if the property exists
				return (pAddress in pObject);
			}
		}
		else
		{
			let tmpSubObjectName = tmpAddressPartBeginning;
			let tmpNewAddress = pAddress.substring(tmpAddressPartBeginning.length+1);

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
				//tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;

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
							return this.checkAddressExists(pObject[tmpFunctionAddress].apply(pObject), tmpNewAddress, tmpRootObject);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							libSimpleLog.log(`Error calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						libSimpleLog.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
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
						// NOTE: This is where the resolves get really tricky.  Recursion within recursion.  Programming gom jabbar, yo.
						tmpArgumentValues.push(this.getObjectValueClass.getValueAtAddress(tmpRootObject, tmpFunctionArguments[i]));
					}

					//return this.checkAddressExists(pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues), tmpNewAddress, tmpRootObject);
					if (tmpFunctionAddress in pObject)
					{
						try
						{
							return this.checkAddressExists(pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues), tmpNewAddress, tmpRootObject);
						}
						catch(pError)
						{
							// The function call failed, so the address doesn't exist
							libSimpleLog.log(`Error calling function ${tmpFunctionAddress} (address [${pAddress}]): ${pError.message}`);
							return false;
						}
					}
					else
					{
						// The function doesn't exist, so the address doesn't exist
						libSimpleLog.log(`Function ${tmpFunctionAddress} does not exist (address [${pAddress}])`);
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
					// Because this is an impossible address, the property doesn't exist
					// TODO: Should we throw an error in this condition?
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

					// Recurse directly into the subobject
					return this.checkAddressExists(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress, tmpRootObject);
				}
				else
				{
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.checkAddressExists(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress, tmpRootObject);
				}
			}

			// If there is an object property already named for the sub object, but it isn't an object
			// then the system can't set the value in there.  Error and abort!
			if ((tmpSubObjectName in pObject) && typeof(pObject[tmpSubObjectName]) !== 'object')
			{
				return false;
			}
			else if (tmpSubObjectName in pObject)
			{
				// If there is already a subobject pass that to the recursive thingy
				return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress, tmpRootObject);
			}
			else
			{
				// Create a subobject and then pass that
				pObject[tmpSubObjectName] = {};
				return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress, tmpRootObject);
			}
		}
	}
};

module.exports = ManyfestObjectAddressResolverCheckAddressExists;