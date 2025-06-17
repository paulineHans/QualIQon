// When a boxed property is passed in, it should have quotes of some
// kind around it.
//
// For instance:
// 		MyValues['Name']
// 		MyValues["Age"]
// 		MyValues[`Cost`]
//
// This function removes the wrapping quotes.
//
// Please note it *DOES NOT PARSE* template literals, so backticks just
// end up doing the same thing as other quote types.
//
// TODO: Should template literals be processed?  If so what state do they have access to?  That should happen here if so.
// TODO: Make a simple class include library with these
const cleanWrapCharacters = (pCharacter, pString) =>
{
	if (pString.startsWith(pCharacter) && pString.endsWith(pCharacter))
	{
		return pString.substring(1, pString.length - 1);
	}
	else
	{
		return pString;
	}
};

module.exports = cleanWrapCharacters;