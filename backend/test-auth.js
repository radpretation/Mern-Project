const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resBody) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers,
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resBody) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const users = [
    { name: 'Admin', email: 'panacea@yopmail.com', pass: 'guru@1234', dash: '/api/admin/dashboard-stats' },
    { name: 'QSA', email: 'qsa@yopmail.com', pass: '123456', dash: '/api/qsa/dashboard' },
    { name: 'QA', email: 'qa@yopmail.com', pass: '123456', dash: '/api/qa/dashboard' },
    { name: 'Consultant', email: 'consultants@yopmail.com', pass: '1542436640', dash: '/api/consultant/dashboard' },
    { name: 'Customer (Priya)', email: 'priya1@tekshapers.com', pass: '1542956972', dash: '/api/customer/dashboard' },
    { name: 'Customer (Test)', email: 'testcustomer@yopmail.com', pass: '1544766203', dash: '/api/customer/dashboard' },
  ];

  console.log('=== TESTING ROLE AUTHENTICATION WITHOUT CERTIFICATES ===');
  for (const u of users) {
    const loginRes = await post('/api/auth/login', { email: u.email, password: u.pass });
    console.log(`[LOGIN] ${u.name} (${u.email}) -> Status: ${loginRes.status}, Success: ${loginRes.data.success}, Name: ${loginRes.data.user?.fullName}`);
    if (loginRes.data.token) {
      const dashRes = await get(u.dash, loginRes.data.token);
      console.log(`  [DASHBOARD ACCESS] ${u.dash} -> Status: ${dashRes.status}, Success: ${dashRes.data.success}`);
    }
  }
}

run().catch(console.error);
