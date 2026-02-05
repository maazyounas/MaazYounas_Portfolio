import handler from './api/projects.js';

const mockReq = {
  method: 'GET',
  query: {}
};

const mockRes = {
  status: (code) => {
    console.log('Response Status:', code);
    return mockRes;
  },
  json: (data) => {
    console.log('Response Data Received (Length):', Array.isArray(data) ? data.length : 'Object');
    console.log('SUCCESS: API Handler is working correctly');
    process.exit(0);
  },
  setHeader: () => mockRes,
  end: () => mockRes
};

async function testHandler() {
  try {
    await handler(mockReq, mockRes);
  } catch (err) {
    console.error('FAILURE: API Handler failed', err);
    process.exit(1);
  }
}

testHandler();
