// TODO: This is an inelegant solution to delay the rewrite of Manyfest.

// Fable 3.0 has a service for data formatting that deals well with nested enclosures.

// The Manyfest library predates fable 3.0 and the services structure of it, so the functions
// are more or less pure javascript and as functional as they can be made to be.

// Until we shift Manyfest to be a fable service, these three functions were pulled out of
// fable to aid in parsing functions with nested enclosures.

module.exports = {
	/**
	 * Count the number of segments in a string, respecting enclosures
	 * 
	 * @param {string} pString 
	 * @param {string} pSeparator 
	 * @param {object} pEnclosureStartSymbolMap 
	 * @param {object} pEnclosureEndSymbolMap 
	 * @returns the count of segments in the string as a number
	 */
	stringCountSegments: (pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap) =>
	{
		let tmpString = (typeof(pString) == 'string') ? pString : '';

		let tmpSeparator = (typeof(pSeparator) == 'string') ? pSeparator : '.';

		let tmpEnclosureStartSymbolMap = (typeof(pEnclosureStartSymbolMap) == 'object') ? pEnclosureStart : { '{': 0, '[': 1, '(': 2 };
		let tmpEnclosureEndSymbolMap = (typeof(pEnclosureEndSymbolMap) == 'object') ? pEnclosureEnd : { '}': 0, ']': 1, ')': 2 };

		if (pString.length < 1)
		{
			return 0;
		}

		let tmpSegmentCount = 1;
		let tmpEnclosureStack = [];

		for (let i = 0; i < tmpString.length; i++)
		{
			// IF This is the start of a segment
			if ((tmpString[i] == tmpSeparator)
				// AND we are not in a nested portion of the string
				&& (tmpEnclosureStack.length == 0))
			{
				// Increment the segment count
				tmpSegmentCount++;
			}
			// IF This is the start of an enclosure
			else if (tmpString[i] in tmpEnclosureStartSymbolMap)
			{
				// Add it to the stack!
				tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
			}
			// IF This is the end of an enclosure
			else if ((tmpString[i] in tmpEnclosureEndSymbolMap)
				// AND it matches the current nest level symbol
				&& tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1])
			{
				// Pop it off the stack!
				tmpEnclosureStack.pop();
			}
		}

		return tmpSegmentCount;
	},

	/**
	 * Get the first segment in a string, respecting enclosures
	 * 
	 * @param {string} pString 
	 * @param {string} pSeparator 
	 * @param {object} pEnclosureStartSymbolMap 
	 * @param {object} pEnclosureEndSymbolMap 
	 * @returns the first segment in the string as a string
	 */
	stringGetFirstSegment: (pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap) =>
	{
		let tmpString = (typeof(pString) == 'string') ? pString : '';

		let tmpSeparator = (typeof(pSeparator) == 'string') ? pSeparator : '.';

		let tmpEnclosureStartSymbolMap = (typeof(pEnclosureStartSymbolMap) == 'object') ? pEnclosureStart : { '{': 0, '[': 1, '(': 2 };
		let tmpEnclosureEndSymbolMap = (typeof(pEnclosureEndSymbolMap) == 'object') ? pEnclosureEnd : { '}': 0, ']': 1, ')': 2 };

		if (pString.length < 1)
		{
			return 0;
		}

		let tmpEnclosureStack = [];

		for (let i = 0; i < tmpString.length; i++)
		{
			// IF This is the start of a segment
			if ((tmpString[i] == tmpSeparator)
				// AND we are not in a nested portion of the string
				&& (tmpEnclosureStack.length == 0))
			{
				// Return the segment
				return tmpString.substring(0, i);
			}
			// IF This is the start of an enclosure
			else if (tmpString[i] in tmpEnclosureStartSymbolMap)
			{
				// Add it to the stack!
				tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
			}
			// IF This is the end of an enclosure
			else if ((tmpString[i] in tmpEnclosureEndSymbolMap)
				// AND it matches the current nest level symbol
				&& tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1])
			{
				// Pop it off the stack!
				tmpEnclosureStack.pop();
			}
		}

		return tmpString;
	},

	/**
	 * Get all segments in a string, respecting enclosures
	 * 
	 * @param {string} pString 
	 * @param {string} pSeparator 
	 * @param {object} pEnclosureStartSymbolMap 
	 * @param {object} pEnclosureEndSymbolMap 
	 * @returns the first segment in the string as a string
	 */
	stringGetSegments: (pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap)=>
	{
		let tmpString = (typeof(pString) == 'string') ? pString : '';

		let tmpSeparator = (typeof(pSeparator) == 'string') ? pSeparator : '.';

		let tmpEnclosureStartSymbolMap = (typeof(pEnclosureStartSymbolMap) == 'object') ? pEnclosureStart : { '{': 0, '[': 1, '(': 2 };
		let tmpEnclosureEndSymbolMap = (typeof(pEnclosureEndSymbolMap) == 'object') ? pEnclosureEnd : { '}': 0, ']': 1, ')': 2 };

		let tmpCurrentSegmentStart = 0;
		let tmpSegmentList = [];

		if (pString.length < 1)
		{
			return tmpSegmentList;
		}

		let tmpEnclosureStack = [];

		for (let i = 0; i < tmpString.length; i++)
		{
			// IF This is the start of a segment
			if ((tmpString[i] == tmpSeparator)
				// AND we are not in a nested portion of the string
				&& (tmpEnclosureStack.length == 0))
			{
				// Return the segment
				tmpSegmentList.push(tmpString.substring(tmpCurrentSegmentStart, i));
				tmpCurrentSegmentStart = i+1;
			}
			// IF This is the start of an enclosure
			else if (tmpString[i] in tmpEnclosureStartSymbolMap)
			{
				// Add it to the stack!
				tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
			}
			// IF This is the end of an enclosure
			else if ((tmpString[i] in tmpEnclosureEndSymbolMap)
				// AND it matches the current nest level symbol
				&& tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1])
			{
				// Pop it off the stack!
				tmpEnclosureStack.pop();
			}
		}

		if (tmpCurrentSegmentStart < tmpString.length)
		{
			tmpSegmentList.push(tmpString.substring(tmpCurrentSegmentStart));
		}

		return tmpSegmentList;
	},

	/**
	 * Count the number of enclosures in a string based on the start and end characters.
	 *
	 * If no start or end characters are specified, it will default to parentheses.  If the string is not a string, it will return 0.
	 *
	 * @param {string} pString
	 * @param {string} pEnclosureStart
	 * @param {string} pEnclosureEnd
	 * @returns the count of full in the string
	 */
	stringCountEnclosures: (pString, pEnclosureStart, pEnclosureEnd) =>
	{
		let tmpString = (typeof(pString) == 'string') ? pString : '';
		let tmpEnclosureStart = (typeof(pEnclosureStart) == 'string') ? pEnclosureStart : '(';
		let tmpEnclosureEnd = (typeof(pEnclosureEnd) == 'string') ? pEnclosureEnd : ')';

		let tmpEnclosureCount = 0;
		let tmpEnclosureDepth = 0;
		for (let i = 0; i < tmpString.length; i++)
		{
			// This is the start of an enclosure
			if (tmpString[i] == tmpEnclosureStart)
			{
				if (tmpEnclosureDepth == 0)
				{
					tmpEnclosureCount++;
				}
				tmpEnclosureDepth++;
			}
			else if (tmpString[i] == tmpEnclosureEnd)
			{
				tmpEnclosureDepth--;
			}
		}

		return tmpEnclosureCount;
	},


	/**
	 * Get the value of the enclosure at the specified index.
	 *
	 * If the index is not a number, it will default to 0.  If the string is not a string, it will return an empty string.  If the enclosure is not found, it will return an empty string.  If the enclosure
	 *
	 * @param {string} pString
	 * @param {number} pEnclosureIndexToGet
	 * @param {string} pEnclosureStart
	 * @param {string}} pEnclosureEnd
	 * @returns {string}
	 */
	stringGetEnclosureValueByIndex: (pString, pEnclosureIndexToGet, pEnclosureStart, pEnclosureEnd) =>
	{
		let tmpString = (typeof(pString) == 'string') ? pString : '';
		let tmpEnclosureIndexToGet = (typeof(pEnclosureIndexToGet) == 'number') ? pEnclosureIndexToGet : 0;
		let tmpEnclosureStart = (typeof(pEnclosureStart) == 'string') ? pEnclosureStart : '(';
		let tmpEnclosureEnd = (typeof(pEnclosureEnd) == 'string') ? pEnclosureEnd : ')';

		let tmpEnclosureCount = 0;
		let tmpEnclosureDepth = 0;

		let tmpMatchedEnclosureIndex = false;
		let tmpEnclosedValueStartIndex = 0;
		let tmpEnclosedValueEndIndex = 0;

		for (let i = 0; i < tmpString.length; i++)
		{
			// This is the start of an enclosure
			if (tmpString[i] == tmpEnclosureStart)
			{
				tmpEnclosureDepth++;

				// Only count enclosures at depth 1, but still this parses both pairs of all of them.
				if (tmpEnclosureDepth == 1)
				{
					tmpEnclosureCount++;
					if (tmpEnclosureIndexToGet == (tmpEnclosureCount - 1))
					{
						// This is the start of *the* enclosure
						tmpMatchedEnclosureIndex = true;
						tmpEnclosedValueStartIndex = i;
					}
				}
			}
			// This is the end of an enclosure
			else if (tmpString[i] == tmpEnclosureEnd)
			{
				tmpEnclosureDepth--;

				// Again, only count enclosures at depth 1, but still this parses both pairs of all of them.
				if ((tmpEnclosureDepth == 0) &&
					tmpMatchedEnclosureIndex &&
					(tmpEnclosedValueEndIndex <= tmpEnclosedValueStartIndex))
				{
					tmpEnclosedValueEndIndex = i;
					tmpMatchedEnclosureIndex = false;
				}
			}
		}

		if (tmpEnclosureCount <= tmpEnclosureIndexToGet)
		{
			// Return an empty string if the enclosure is not found
			return '';
		}

		if ((tmpEnclosedValueEndIndex > 0) && (tmpEnclosedValueEndIndex > tmpEnclosedValueStartIndex))
		{
			return tmpString.substring(tmpEnclosedValueStartIndex+1, tmpEnclosedValueEndIndex);
		}
		else
		{
			return tmpString.substring(tmpEnclosedValueStartIndex+1);
		}
	}
}