/**
* Unit tests for DataArithmatic
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

const libFable = require('fable');
const _Fable = new libFable();
let libDataArithmatic = require('../source/DataArithmatic.js');

suite
(
	'DataArithmatic Number',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Format Number Strings',
			()=>
			{
				test
				(
					'Test adding commas to a number',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.formatterAddCommasToNumber(1000))
							.to.equal('1,000');
						Expect(_DataArithmatic
							.formatterAddCommasToNumber('This is not a number'))
							.to.equal('This is not a number');
						Expect(_DataArithmatic
							.formatterAddCommasToNumber(102931021))
							.to.equal('102,931,021');
						Expect(_DataArithmatic
							.formatterAddCommasToNumber(-100000000.7333312))
							.to.equal('-100,000,000.7333312');
						Expect(_DataArithmatic
							.formatterAddCommasToNumber(`$8675309.75`))
							.to.equal('$8675309.75');
						return fTestComplete();
					}
				);
				test
				(
					'Test formatting dollars',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.formatterDollars(1000))
							.to.equal('$1,000.00');
						Expect(_DataArithmatic
							.formatterDollars('Not dollars!'))
							.to.equal('--');
						Expect(_DataArithmatic
							.formatterDollars(10000))
							.to.equal('$10,000.00');
						Expect(_DataArithmatic
							.formatterDollars(-8675309.75))
							.to.equal('$-8,675,309.75');
						Expect(_DataArithmatic
							.formatterDollars(72.3198))
							.to.equal('$72.32');
						Expect(_DataArithmatic
							.formatterDollars(72.3119))
							.to.equal('$72.31');
						return fTestComplete();
					}
				);
				test
				(
					'Test rounding numbers',
					(fTestComplete)=>
					{
						let _DataArithmatic = new libDataArithmatic(_Fable);
						Expect(_DataArithmatic
							.formatterRoundNumber(1000, 2))
							.to.equal('1000.00');
						Expect(_DataArithmatic
							.formatterRoundNumber(1000.129, 2))
							.to.equal('1000.13');
						Expect(_DataArithmatic
							.formatterRoundNumber(1000.781))
							.to.equal('1000.78');
						Expect(_DataArithmatic
							.formatterRoundNumber(867.5309, 3))
							.to.equal('867.531');
						Expect(_DataArithmatic
							.formatterRoundNumber(-732.777, 2))
							.to.equal('-732.78');
						Expect(_DataArithmatic
							.formatterRoundNumber('Not a number'))
							.to.equal('0.00');
						return fTestComplete();
					}
				);
			}
		);
	}
);
