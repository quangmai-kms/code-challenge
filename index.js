
class TrieNode {
  constructor() {
    this.ipAddress = undefined;
    this.count = 0;
    this.children = {};
  }
}
class RequestHandler {
  constructor() {
    this.root = new TrieNode();
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
  }
}

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
]


let t = new RequestHandler();

for (i = 0; i < requestIps.length; i++) {
  t.request_handled(requestIps[i]);
}

console.dir(t.root, { depth: null });
