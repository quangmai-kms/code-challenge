const TOP_NUMBER = 100;

class TrieNode {
  constructor() {
    this.ipAddress = undefined;
    this.count = 0;
    this.children = {};
  }
}

class RequestHistory {
  constructor(topNumber) {
    this.root = new TrieNode();
    this.topCounts = [];
    this.topIpAddresses = [];
    this.topNumber = topNumber || TOP_NUMBER;
  }

  /**
   * The IP address will be add to a Trie Tree.
   * Then we will build the top 100 with that node, and update the top IP addresses if necessary.
   */
  request_handled(ipAddress) {
    if (ipAddress.length === 0) return;

    const currentNode = this.insertOrUpdateNode(ipAddress);
    const built = buildTopCounts(this.topCounts, currentNode, this.topNumber);
    if (built) {
      this.topIpAddresses = convertToIpAddresses(this.topCounts);
    }
  }

  /**
   * Return the top 100 of the highest traffic IP addresses.
   */
  top100() {
    return this.topIpAddresses;
  }

  clear() {
    delete this.root.children;
    this.root = new TrieNode();
    this.topCounts = [];
    this.topIpAddresses = [];
  }

  /**
   * The IP address will be add to traversed a Trie Tree, then update its node or store it in the new node.
   */
  insertOrUpdateNode(ipAddress) {
    let character;
    let currentNode = this.root;
    for (let i = 0; i < ipAddress.length; i++) {
      character = ipAddress[i];
      if (!currentNode.children[character]) {
        currentNode.children[character] = new TrieNode();
      }
      currentNode = currentNode.children[character];
    }

    currentNode.ipAddress = ipAddress;
    currentNode.count = currentNode.count + 1;
    return currentNode;
  }
}

/**
 * Update the top IP address counts when a Trie Tree node is updated or created.
 */
function buildTopCounts(topCounts, node, topNumber) {
  let built = false;

  const currentIndex = topCounts.indexOf(node);
  if (currentIndex > -1) {
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0 && topCounts[previousIndex].count < node.count) {
      built = moveUpCount(topCounts, currentIndex);
    }
  } else if (topCounts.length === 0 || topCounts.length <= topNumber - 1) {
    topCounts.push(node);
    built = true;
  } else {
    const lastNode = topCounts[topCounts.length - 1];
    if (lastNode.count < node.count) {
      topCounts[topCounts.length - 1] = node;
      built = moveUpCount(topCounts, topCounts.length - 1);
    }
  }

  return built;
}

function convertToIpAddresses(nodes) {
  let ipAddresses = [];

  if (nodes) {
    ipAddresses = nodes.map((node) => node.ipAddress);
  }

  return ipAddresses;
}

/**
 * We always have only one direction data change, the way up only because count always increases `1`.
 * So we just level up the count by one level.
 */
function moveUpCount(arr, needToUpIndex) {
  let moved = false;
  let previousIndex = needToUpIndex - 1;

  while (
    previousIndex >= 0 &&
    arr[needToUpIndex].count > arr[previousIndex].count
  ) {
    swapNodes(arr, needToUpIndex, previousIndex);
    needToUpIndex = previousIndex;
    previousIndex = previousIndex - 1;
    moved = true;
  }

  return moved;
}

function swapNodes(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

module.exports = RequestHistory;
