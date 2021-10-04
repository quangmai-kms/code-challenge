class TrieNode {
  constructor() {
    this.ipAddress = undefined;
    this.count = 0;
    this.children = {};
  }
}

const TOP_NUMBER = 100;

class RequestHandler {
  constructor() {
    this.root = new TrieNode();
    this.topCounts = [];
    this.topIpAddresses = [];
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
    // build top100
    this._buildTopCounts(currentNode);
  }

  top100() {
    if (!this.topIpAddresses || this.topIpAddresses.length === 0 ) {
      this.topIpAddresses = convertToIpAddresses(this.topCounts);
    }

    return this.topIpAddresses;
  }

  clear() {
    delete this.root.children;
    this.root = new TrieNode();
    this.top100 = [];
  }

  // Edge case: same count but 100 addresses only ?!
  _buildTopCounts(node) {
    console.log('build topCounts for', node);

    if (this.topCounts.length === 0) {
      this.topCounts.push(node);
      return;
    }

    const existIndex = this.topCounts.indexOf(node);
    if (existIndex > -1) {
      console.log('-- topCount indexOf found')
      // sortTopCounts(this.topCounts);
      const previousIndex = existIndex - 1;
      if (previousIndex >= 0 && this.topCounts[previousIndex].count < node.count) {
        // swapNodes(this.topCounts, existIndex, previousIndex);
        const moved = moveUpCount(this.topCounts, existIndex);
        if (moved) {
          this.topIpAddresses = [];
        }
      }
    } else if (this.topCounts.length < TOP_NUMBER - 1) {
      console.log('-- topCount length availble', this.topCounts.length)
      this.topCounts.push(node);
      this.topIpAddresses = [];
      // sortTopCounts(this.topCounts);
    } else {
      const last = this.topCounts[this.topCounts.length - 1];
      if (last.count < node.count) {
        console.log('--- topCount indexOf not found so add new count', last);
        this.topCounts[this.topCounts.length - 1] = node;
        // this.topCounts.push(node);
        const moved = moveUpCount(this.topCounts, this.topCounts.length - 1);
        if (moved) {
          this.topIpAddresses = [];
        }
        // this.topCounts = this.topCounts.slice(0, 10);
      }

      // console.log('-- topCount indexOf not found', this.topCounts, this.topCounts.length)
      // const last = this.topCounts[this.topCounts.length - 1];
      // console.log('-- topCount indexOf not found last', last);
      // if (last.count === node.count && this.topCounts.length < 10 - 1) {
      //   console.log('--- topCount indexOf not found found same count', last);
      //   this.topCounts.push(node);
      // } else if (last.count < node.count) {
      //   console.log('--- topCount indexOf not found so add new count', last);
      //   this.topCounts.push(node);
      //   // sortTopCounts(this.topCounts);
      //   // this.topCounts = this.topCounts.slice(0, 10);
      // }
    }
  }
}

function convertToIpAddresses(nodes) {
  let ipAddresses = [];

  if (nodes) {
    ipAddresses = nodes.map(node => {
      return node.ipAddress;
    })
  }

  return ipAddresses;
}

function moveUpCount(arr, needToUpIndex) {
  // for (i = arr.length - 1; i > 0 && arr[i].count >= arr[i - 1].count; i--) {
  //   var tmp = arr[i];
  //   arr[i] = arr[i - 1];
  //   arr[i - 1] = tmp;
  // }
  // return arr;

  // let needToUpIndex = fromIndex;
  let moved = false;
  console.log('..... begin', needToUpIndex);
  let previousIndex = needToUpIndex - 1;
  console.log('..... begin', needToUpIndex, previousIndex);
  // const previousNode = arr[lastIndex - 1]
  while (previousIndex >= 0 && arr[needToUpIndex].count > arr[previousIndex].count) {
    swapNodes(arr, needToUpIndex, previousIndex);
    needToUpIndex = previousIndex;
    previousIndex = previousIndex - 1;
    moved = true;
    console.log('.....', needToUpIndex, previousIndex);
  }

  return moved;
}

function swapNodes(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// function addAndSort(arr, val) {
//   arr.push(val);
//   for (i = arr.length - 1; i > 0 && arr[i] < arr[i - 1]; i--) {
//     var tmp = arr[i];
//     arr[i] = arr[i - 1];
//     arr[i - 1] = tmp;
//   }
//   return arr;
// }

// function containsCount(arr, count, start, end) {
//   if (start > end) return false;
//   const mid = Math.floor((start + end) / 2);

//   if (arr[mid].count === count) return true;
//   if (arr[mid].count > count) {
//     return containsCount(arr, count, mid + 1, end);
//   }
//   return containsCount(arr, count, start, mid - 1);
// }

// var test = [ { count: 11 }, { count: 7 },  { count: 3 }, { count: 3 }, { count: 1 } ]

// function sortCount(arr) {
//   for (i = arr.length - 1; i > 0 && arr[i].count < arr[i - 1].count; i--) {
//     var tmp = arr[i];
//     arr[i] = arr[i - 1];
//     arr[i - 1] = tmp;
//   }
//   return arr;
// }

const requestIps = [
  '245.87.2.109',
  '245.87.2.109',
  '145.87.2.11',
  '145.87.2.11',
  '5.2.69.50',
  '5.2.69.50',
  '245.87.2.109',
  '5.199.143.202',
  '23.243.64.234',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '217.114.215.134',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.250',
  '185.220.100.251',
  '109.70.100.20',
  '109.70.100.21',
  '109.70.100.22',
  '245.87.2.109',
  '145.87.2.11',

  // '245.87.2.109',
  '245.87.2.109',
  '145.87.2.101',
  '145.87.2.101',
  '145.87.2.101',
  '145.87.2.101',
  '245.87.2.107',

  '5.2.69.50',
  '245.87.2.109',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '245.87.2.107',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.114.215.134',
  '217.114.215.134',
  '217.114.215.134',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '109.70.100.20',
  '109.70.100.21',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '245.87.2.109',
  '245.87.2.109',
  '145.87.2.11',
  '145.87.2.11',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '245.87.2.109',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '245.87.2.107',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.114.215.134',
  '217.114.215.134',
  '217.114.215.134',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '109.70.100.20',
  '109.70.100.21',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '245.87.2.109',
  '245.87.2.109',
  '145.87.2.11',
  '145.87.2.11',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '245.87.2.109',
  '5.2.69.50',
  '5.2.69.50',
  '5.2.69.50',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '5.199.143.202',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '245.87.2.107',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.114.215.134',
  '217.114.215.134',
  '217.114.215.134',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.249',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.250',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '185.220.100.251',
  '109.70.100.20',
  '109.70.100.21',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '109.70.100.22',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '23.243.64.234',
  '245.87.2.107',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '23.243.64.234',
  '23.243.64.234',
  '245.87.2.107',
  '245.87.2.107',
  '145.87.2.101',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '216.151.180.28',
  '199.249.230.180',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.79.179.7',
  '217.114.215.134',
  '217.114.215.134',
  '217.114.215.134',
  '185.220.100.249',
  '185.221.100.249',
  '185.222.100.249',
  '185.223.100.249',
  '185.224.100.249',

  '185.220.100.249',
  '185.221.100.249',
  '185.222.100.249',
  '185.223.100.249',
  '185.224.100.249',

  '185.225.100.249',
  '185.220.101.249',

  '185.225.100.249',
  '185.220.101.249',

  '185.225.100.249',
  '185.220.101.249',

  '185.225.100.249',
  '185.220.101.249',

  '185.225.100.249',
  '185.220.101.249',
]

let t = new RequestHandler();

for (i = 0; i < requestIps.length; i++) {
  t.request_handled(requestIps[i]);
}

console.log('top10', t.top100());
console.log('top10', t.topCounts);
// console.dir(t.root, { depth: null });
