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

  request_handled(ipAddress) {
    if (ipAddress.length === 0) return;
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

    try {
      buildTopCounts(
        this.topCounts,
        this.topIpAddresses,
        currentNode,
        this.topNumber
      );
    } catch (error) {
      console.log('request_handled', error);
    }
  }

  top100() {
    if (!this.topIpAddresses || this.topIpAddresses.length === 0) {
      this.topIpAddresses = convertToIpAddresses(this.topCounts);
    }

    return this.topIpAddresses;
  }

  clear() {
    delete this.root.children;
    this.root = new TrieNode();
    this.top100 = [];
  }
}

function buildTopCounts(topCounts, topIpAddresses, node, topNumber) {
  if (!topCounts || !topIpAddresses || !node || !topNumber) {
    throw 'Empty input values.';
  }

  if (topCounts.length === 0) {
    topCounts.push(node);
    return;
  }

  const existIndex = topCounts.indexOf(node);
  if (existIndex > -1) {
    const previousIndex = existIndex - 1;
    if (previousIndex >= 0 && topCounts[previousIndex].count < node.count) {
      const moved = moveUpCount(topCounts, existIndex);
      if (moved) {
        topIpAddresses = [];
      }
    }
  } else if (topCounts.length < topNumber - 1) {
    topCounts.push(node);
    topIpAddresses = [];
  } else {
    const last = topCounts[topCounts.length - 1];
    if (last.count < node.count) {
      topCounts[topCounts.length - 1] = node;
      const moved = moveUpCount(topCounts, topCounts.length - 1);
      if (moved) {
        topIpAddresses = [];
      }
    }
  }
}

function convertToIpAddresses(nodes) {
  let ipAddresses = [];

  if (nodes) {
    ipAddresses = nodes.map((node) => {
      return node.ipAddress;
    });
  }

  return ipAddresses;
}

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