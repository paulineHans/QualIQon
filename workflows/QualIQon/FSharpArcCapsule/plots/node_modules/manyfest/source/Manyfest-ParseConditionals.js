// Given a string, parse out any conditional expressions and set whether or not to keep the record.
//
// For instance:
// 		'files[]<<~?format,==,Thumbnail?~>>'
//      'files[]<<~?format,==,Metadata?~>>'
//      'files[]<<~?size,>,4000?~>>'
//
// The wrapping parts are the <<~? and ?~>> megabrackets.
//
// The function does not need to alter the string -- just check the conditionals within.

// TODO: Consider making this an es6 class

// Let's use indexOf since it is apparently the fastest.
const _ConditionalStanzaStart = '<<~?';
const _ConditionalStanzaStartLength = _ConditionalStanzaStart.length;
const _ConditionalStanzaEnd = '?~>>';
const _ConditionalStanzaEndLength = _ConditionalStanzaEnd.length;

// Ugh dependency injection.  Can't wait to make these all fable services.
//let libObjectAddressCheckAddressExists = new (require('./Manyfest-ObjectAddress-CheckAddressExists.js'))();

// Test the condition of a value in a record
const testCondition = (pManyfest, pRecord, pSearchAddress, pSearchComparator, pValue) =>
{
	switch(pSearchComparator)
	{
		case 'TRUE':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) === true);
			break;
		case 'FALSE':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) === false);
			break;
		case 'LNGT':
		case 'LENGTH_GREATER_THAN':
			switch(typeof(pManyfest.getValueAtAddress(pRecord, pSearchAddress)))
			{
				case 'string':
					return (pManyfest.getValueAtAddress(pRecord, pSearchAddress).length > pValue);
					break;
				case 'object':
					return (pManyfest.getValueAtAddress(pRecord, pSearchAddress).length > pValue);
					break;
				default:
					return false;
					break;
			}
			break;
		case 'LNLT':
		case 'LENGTH_LESS_THAN':
			switch(typeof(pManyfest.getValueAtAddress(pRecord, pSearchAddress)))
			{
				case 'string':
					return (pManyfest.getValueAtAddress(pRecord, pSearchAddress).length < pValue);
					break;
				case 'object':
					return (pManyfest.getValueAtAddress(pRecord, pSearchAddress).length < pValue);
					break;
				default:
					return false;
					break;
			}
			break;
		// TODO: Welcome to dependency hell.  This fixes itself when we move to fable services.
		// case 'EX':
		// case 'EXISTS':
		// 	return libObjectAddressCheckAddressExists.checkAddressExists(pRecord, pSearchAddress);
		// 	break;
		// case 'DNEX':
		// case 'DOES_NOT_EXIST':
		// 	return !libObjectAddressCheckAddressExists.checkAddressExists(pRecord, pSearchAddress);
		// 	break;
		case '!=':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) != pValue);
			break;
		case '<':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) < pValue);
			break;
		case '>':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) > pValue);
			break;
		case '<=':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) <= pValue);
			break;
		case '>=':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) >= pValue);
			break;
		case '===':
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) === pValue);
			break;
		case '==':
		default:
			return (pManyfest.getValueAtAddress(pRecord, pSearchAddress) == pValue);
			break;
	}
};

const parseConditionals = (pManyfest, pAddress, pRecord) =>
{
	let tmpKeepRecord = true;

	/*
		Algorithm is simple:

		1.  Enuerate start points
		2.  Find stop points within each start point
		3. Check the conditional
	*/
	let tmpStartIndex = pAddress.indexOf(_ConditionalStanzaStart);

	while (tmpStartIndex != -1)
	{
		let tmpStopIndex = pAddress.indexOf(_ConditionalStanzaEnd, tmpStartIndex+_ConditionalStanzaStartLength);

		if (tmpStopIndex != -1)
		{
			let tmpMagicComparisonPatternSet = pAddress.substring(tmpStartIndex+_ConditionalStanzaStartLength, tmpStopIndex).split(',');

			// The address to search for
			let tmpSearchAddress = tmpMagicComparisonPatternSet[0];

			// The copmparison expression (EXISTS as default)
			let tmpSearchComparator = 'EXISTS';
			if (tmpMagicComparisonPatternSet.length > 1)
			{
				tmpSearchComparator = tmpMagicComparisonPatternSet[1];				
			}

			// The value to search for
			let tmpSearchValue = false;
			if (tmpMagicComparisonPatternSet.length > 2)
			{
				tmpSearchValue = tmpMagicComparisonPatternSet[2];
			}

			// Process the piece
			tmpKeepRecord = tmpKeepRecord && testCondition(pManyfest, pRecord, tmpSearchAddress, tmpSearchComparator, tmpSearchValue);
			tmpStartIndex = pAddress.indexOf(_ConditionalStanzaStart, tmpStopIndex+_ConditionalStanzaEndLength);
		}
		else
		{
			tmpStartIndex = -1;
		}
		
	}

	return tmpKeepRecord;
}

module.exports = parseConditionals;