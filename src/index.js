const RequestHistory = require('./RequestHistory');
const requestIps = require('./sample_data');

const requestHistory = new RequestHistory();

for (i = 0; i < requestIps.length; i++) {
  requestHistory.request_handled(requestIps[i]);
}

console.log('top10', requestHistory.topCounts);
console.log('top10', requestHistory.top100());
// console.dir(requestHistory.root, { depth: null });
