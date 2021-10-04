const RequestHistory = require('./RequestHistory');

describe('Request History', () => {
  let requestHistory;

  const requestIps = ['1.2', '1.3'];

  beforeEach(() => {
    requestHistory = new RequestHistory();
    for (i = 0; i < requestIps.length; i++) {
      requestHistory.request_handled(requestIps[i]);
    }
  });

  afterEach(() => {
    requestHistory = null;
  });

  test('should build correct tree with simple requests', () => {
    const expectedResult = {
      count: 0,
      children: {
        1: {
          count: 0,
          children: {
            '.': {
              count: 0,
              children: {
                2: {
                  ipAddress: '1.2',
                  count: 1,
                  children: {},
                },
                3: {
                  ipAddress: '1.3',
                  count: 1,
                  children: {},
                },
              },
            },
          },
        },
      },
    };

    const expectedTop100 = requestIps;

    expect(requestHistory.root).toEqual(expectedResult);
    expect(requestHistory.top100()).toEqual(expectedTop100);
  });

  test('should build correct tree with more requests', () => {
    requestHistory.request_handled('1.3');
    requestHistory.request_handled('2.3');
    requestHistory.request_handled('1.2');
    requestHistory.request_handled('1.9');

    const expectedResult = {
      count: 0,
      children: {
        1: {
          count: 0,
          children: {
            '.': {
              count: 0,
              children: {
                2: {
                  ipAddress: '1.2',
                  count: 2,
                  children: {},
                },
                3: {
                  ipAddress: '1.3',
                  count: 2,
                  children: {},
                },
                9: {
                  ipAddress: '1.9',
                  count: 1,
                  children: {},
                },
              },
            },
          },
        },
        2: {
          count: 0,
          children: {
            '.': {
              count: 0,
              children: {
                3: {
                  ipAddress: '2.3',
                  count: 1,
                  children: {},
                },
              },
            },
          },
        },
      },
    };

    const expectedTop100 = ['1.3', '1.2', '2.3', '1.9'];

    expect(requestHistory.root).toEqual(expectedResult);
    expect(requestHistory.top100()).toEqual(expectedTop100);
  });

  test('should build correct tree when top number is fulfill', () => {
    const ipAddresses = ['1.3', '1.2', '1.4', '1.2', '1.2', '1.9', '1.9'];
    requestHistory = new RequestHistory(3);
    for (i = 0; i < ipAddresses.length; i++) {
      requestHistory.request_handled(ipAddresses[i]);
    }

    const expectedResult = {
      count: 0,
      children: {
        1: {
          count: 0,
          children: {
            '.': {
              count: 0,
              children: {
                2: {
                  ipAddress: '1.2',
                  count: 3,
                  children: {},
                },
                3: {
                  ipAddress: '1.3',
                  count: 1,
                  children: {},
                },
                4: {
                  ipAddress: '1.4',
                  count: 1,
                  children: {},
                },
                9: {
                  ipAddress: '1.9',
                  count: 2,
                  children: {},
                },
              },
            },
          },
        },
      },
    };

    const expectedTop100 = ['1.2', '1.9', '1.3'];

    expect(requestHistory.root).toEqual(expectedResult);
    expect(requestHistory.top100()).toEqual(expectedTop100);
  });

  test('should clear data correctly', () => {
    requestHistory.clear();

    const expectedResult = {
      count: 0,
      children: {},
      ipAddress: undefined,
    };

    expect(requestHistory.root).toEqual(expectedResult);
    expect(requestHistory.top100()).toEqual([]);

    requestHistory.request_handled('1.9');
    const expectedResult2 = {
      count: 0,
      children: {
        1: {
          count: 0,
          children: {
            '.': {
              count: 0,
              children: {
                9: {
                  ipAddress: '1.9',
                  count: 1,
                  children: {},
                },
              },
            },
          },
        },
      },
    };
    expect(requestHistory.root).toEqual(expectedResult2);
    expect(requestHistory.top100()).toEqual(['1.9']);
  });
});
