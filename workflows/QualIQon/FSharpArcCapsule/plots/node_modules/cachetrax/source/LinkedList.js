"use strict"
/**
* Simple double linked list to hold the cache entries in, in order.
*
* @author Steven Velozo <steven@velozo.com>
* @module FeeFiFo
*/

const libLinkedListNode = require('./LinkedList-Node.js');

/**
* Quality Cache Goodness
*
* @class CashMoney
* @constructor
*/

class LinkedList
{
	constructor()
	{
		// Total number of nodes ever processed by this ADT
		this.totalNodes = 0;

		// The length of the set of nodes currently in the list
		this.length = 0;

		this.head = false;
		this.tail = false;
	}

	// Create a node object.
	initializeNode(pDatum, pHash)
	{
		// Don't allow undefined to be added to the list because of reasons
		if (typeof(pDatum) === 'undefined')
			return false;

		this.totalNodes++;

		// Get (or create) a unique hash
		let tmpHash = (typeof(pHash) != 'undefined') ? pHash : `NODE[${this.totalNodes}]`;

		let tmpNode = new libLinkedListNode();

		tmpNode.Hash = tmpHash;
		tmpNode.Datum = pDatum;

		return tmpNode;
	}

	// Add a node to the end (right of tail) of the list.
	append(pDatum, pHash)
	{
		// TODO: Should we check if pDatum is actually a node and do the "right" thing?
		let tmpNode = this.initializeNode(pDatum, pHash);
		if (!tmpNode)
			return false;

		// The list just got longer!
		this.length++;

		// If the list was empty, create a new list from it (it isn't possible to have a tail with no head)
		if (this.length == 1)
		{
			this.head = tmpNode;
			this.tail = tmpNode;
			return tmpNode;
		}

		this.tail.RightNode = tmpNode;
		tmpNode.LeftNode = this.tail;
		this.tail = tmpNode;

		return tmpNode;
	}

	// Append to tail of list (FIFO)
	push(pDatum, pHash)
	{
		return this.append(pDatum, pHash);
	}

	// Add a node to the beginning (left of head) of the list.
	prepend(pDatum, pHash)
	{
		// TODO: Should we check if pDatum is actually a node and do the "right" thing?
		let tmpNode = this.initializeNode(pDatum, pHash);
		if (!tmpNode)
			return false;

		// The list just got longer!
		this.length++;

		// If the list was empty, create a new list from it (it isn't possible to have a tail with no head)
		if (this.length == 1)
		{
			this.head = tmpNode;
			this.tail = tmpNode;
			return tmpNode;
		}

		this.head.LeftNode = tmpNode;
		tmpNode.RightNode = this.head;
		this.head = tmpNode;
		return tmpNode;
	}

	// Remove a node from the list
	remove(pNode)
	{
		if (typeof(pNode) === 'undefined')
			return false;

		if (!pNode.__ISNODE)
			return false;

		this.length--;

		// Last element in list.  Empty it out.
		if (this.length < 1)
		{
			this.head = false;
			this.tail = false;
			return pNode;
		}

		// It's somewhere in the middle, surgically remove it.
		if (pNode.LeftNode && pNode.RightNode)
		{
			pNode.LeftNode.RightNode = pNode.RightNode;
			pNode.RightNode.LeftNode = pNode.LeftNode;

			pNode.RightNode = false;
			pNode.LeftNode = false;
			return pNode;
		}

		// It's the tail
		if (pNode.LeftNode)
		{
			pNode.LeftNode.RightNode = false;
			this.tail = pNode.LeftNode;
			pNode.LeftNode = false;
			return pNode;
		}

		// It must be the head
		pNode.RightNode.LeftNode = false;
		this.head = pNode.RightNode;
		pNode.RightNode = false;
		return pNode;
	}

	// Remove the head of the list (FIFO)
	pop()
	{
		return this.remove(this.head);
	}

	// Enumerate over each node IN ORDER, running the function fAction(pDatum, pHash, fCallback) then calling the function fComplete callback when done
	each(fAction, fComplete)
	{
		if (this.length < 1)
			return fComplete();

		let tmpNode = false;

		let fIterator = (pError)=>
		{
			// If the user passed in a callback with an error, call their callback with the error
			if (pError)
				return fComplete(pError);

			// If there is no node, this must be the initial run.
			if (!tmpNode)
				tmpNode = this.head;
			// Check if we are at the tail of the list
			else if (!tmpNode.RightNode)
				return fComplete();
			// Proceed to the next node
			else
				tmpNode = tmpNode.RightNode;

			// Call the actual action
			// I hate this pattern because long tails eventually cause stack overflows.
			fAction(tmpNode.Datum, tmpNode.Hash, fIterator);
		};

		// Now kick off the iterator
		return fIterator();
	}

	// Seek a specific node, 0 is the index of the first node.
	seek(pNodeIndex)
	{
		if (!pNodeIndex)
			return false;
		if (this.length < 1)
			return false;
		if (pNodeIndex >= this.length)
			return false;

		let tmpNode = this.head;
		for (let i = 0; i < pNodeIndex; i++)
		{
			tmpNode = tmpNode.RightNode;
		}

		return tmpNode;
	}
}

module.exports = LinkedList;