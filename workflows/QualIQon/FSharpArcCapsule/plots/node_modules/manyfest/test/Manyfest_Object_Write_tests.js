/**
* Unit tests for Manyfest
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

let libManyfest = require('../source/Manyfest.js');

suite
(
	'Manyfest Object Write',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Basic Write',
			()=>
			{
				test
				(
					'Properties should be settable without a schema.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({});
						let _SimpleObject = {Name:'Bob',Age:31,Pets:{Fido:'Dog',Spot:'Cat'}};
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Name'))
							.to.equal('Bob');
						_Manyfest.setValueAtAddress(_SimpleObject,'Name','Jim');
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Name'))
							.to.equal('Jim');
						Expect(_SimpleObject.Name)
							.to.equal('Jim');
						fTestComplete();
					}
				);
				test
				(
					'Properties should be settable with a schema by hash.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'BobsPets', Descriptors: {'Pets.Fido': {Name:'Favorite Pet', Hash:'Favorite'}}});
						let _SimpleObject = {Name:'Bob',Age:31,Pets:{Fido:'Dog',Spot:'Cat'}};
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Pets.Fido'))
							.to.equal('Dog');
						// Set the favorite pet to be a Monkey because Monkeys rule
						_Manyfest.setValueByHash(_SimpleObject,'Favorite','Monkey');
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Pets.Fido'))
							.to.equal('Monkey');
						Expect(_SimpleObject.Pets.Fido)
							.to.equal('Monkey');
						fTestComplete();
					}
				);
				test
				(
					'Properties should be settable with a schema by address.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest({ Scope:'BobsPets', Descriptors: {'Pets.Fido': {Name:'Favorite Pet', Hash:'Favorite'}}});
						let _SimpleObject = {Name:'Bob',Age:31,Pets:{Fido:'Dog',Spot:'Cat'}};
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Pets.Fido'))
							.to.equal('Dog');
						// Set fido to be a Lemur
						_Manyfest.setValueAtAddress(_SimpleObject,'Pets.Fido','Lemur');
						Expect(_Manyfest.getValueAtAddress(_SimpleObject,'Pets.Fido'))
							.to.equal('Lemur');
						Expect(_SimpleObject.Pets.Fido)
							.to.equal('Lemur');
						fTestComplete();
					}
				);
			}
		);

		suite
		(
			'Advanced Write (with Arrays and Boxed Property addresses)',
			()=>
			{
				test
				(
					'Write specific array elements.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let _Object = {Dogs:['Fido','Spot','Trinity']};
						_Manyfest.setValueAtAddress(_Object, 'Dogs[1]', 'Spotty')
						Expect(_Object.Dogs[1])
							.to.equal('Spotty');
						fTestComplete();
					}
				);
				test
				(
					'Write specific boxed properties.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let _Object = {Dogs:{RunnerUp:'Fido',Loser:'Spot',Winner:'Trinity'}};
						_Manyfest.setValueAtAddress(_Object, 'Dogs["Loser"]', 'Jimbo');
						Expect(_Object.Dogs.Loser)
							.to.equal('Jimbo');
						fTestComplete();
					}
				);
				test
				(
					'Write to specific boxed properties that do not exist.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let _Object = {Dogs:{RunnerUp:'Fido',Loser:'Spot',Winner:'Trinity'}};
						Expect(_Object.Dogs.Judge)
							.to.be.an('undefined');
						_Manyfest.setValueAtAddress(_Object, 'Dogs.Judge', 'Judgy Judy');
						Expect(_Object.Dogs.Judge)
							.to.equal('Judgy Judy');
						fTestComplete();
					}
				);
				test
				(
					'Write to nested box properties.',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let _Object = {Dogs:{RunnerUp:{Name:'Fido',Speed:100},Loser:{Name:'Spot'},Winner:{Name:'Trinity'}}};
						_Manyfest.setValueAtAddress(_Object, 'Dogs[`RunnerUp`].Speed', 300);
						Expect(_Object.Dogs.RunnerUp.Speed)
							.to.equal(300);
						// Set a value for an address that doesn't exist.
						_Manyfest.setValueAtAddress(_Object, 'Dogs[`Loser`].Speed', 10);
						Expect(_Object.Dogs.Loser.Speed)
							.to.equal(10);
						fTestComplete();
					}
				);
				test
				(
					'Write nested array properties',
					(fTestComplete)=>
					{
						let _Manyfest = new libManyfest();
						let _Object = {Kennel:[{Name:'Fido',Speed:100},{Name:'Spot'},{Name:'Trinity'}]};
						_Manyfest.setValueAtAddress(_Object, 'Kennel[1].Name', 'Billy');
						Expect(_Object.Kennel[1].Name)
							.to.equal('Billy');
						fTestComplete();
					}
				);
			}
		);
	}
);
