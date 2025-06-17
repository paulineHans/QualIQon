/**
* Random Byte Generator - Browser version
*
*
* @author Steven Velozo <steven@velozo.com>
*/

// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
class RandomBytes
{
	constructor()
	{

		// getRandomValues needs to be invoked in a context where "this" is a Crypto
		// implementation. Also, find the complete implementation of crypto on IE11.
		this.getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      		(typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
	}

	// WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	generateWhatWGBytes()
	{
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		this.getRandomValues(tmpBuffer);
		return tmpBuffer;
	}

	// Math.random()-based (RNG)
	generateRandomBytes()
	{
		// If all else fails, use Math.random().  It's fast, but is of unspecified
		// quality.
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		for (let i = 0, tmpValue; i < 16; i++)
		{
			if ((i & 0x03) === 0)
			{
				tmpValue = Math.random() * 0x100000000;
			}

			tmpBuffer[i] = tmpValue >>> ((i & 0x03) << 3) & 0xff;
		}

		return tmpBuffer;
	}

	generate()
	{
		if (this.getRandomValues)
		{
			return this.generateWhatWGBytes();
		}
		else
		{
			return this.generateRandomBytes();
		}
	}
}

module.exports = RandomBytes;
