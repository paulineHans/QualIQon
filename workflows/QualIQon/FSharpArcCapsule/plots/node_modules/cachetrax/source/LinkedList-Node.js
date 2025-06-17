/**
* Double Linked List Node
*
* @author Steven Velozo <steven@velozo.com>
* @module CashMoney
*/

/**
* Linked List Node Prototype
*
* @class LinkedListNode
* @constructor
*/

class LinkedListNode
{
	constructor()
	{
		this.Hash = false;
		this.Datum = false;

		// This is where expiration and other elements are stored;
		this.Metadata = {};

		this.LeftNode = false;
		this.RightNode = false;

		// To allow safe specialty operations on nodes
		this.__ISNODE = true;
	}
}

module.exports = LinkedListNode;