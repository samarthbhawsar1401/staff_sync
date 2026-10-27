const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (postData) headers['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting StaffSync HRM API Test Suite ---');

  // 1. Health
  const health = await request('GET', '/api/health');
  console.log('✓ [Health Check]', health.status === 200 ? 'PASS' : 'FAIL', health.data.system);

  // 2. Login HR
  const hrLogin = await request('POST', '/api/auth/login', {
    email: 'hr@staffsync.com',
    password: 'admin123'
  });
  console.log('✓ [Auth HR Login]', hrLogin.status === 200 ? 'PASS' : 'FAIL', 'User:', hrLogin.data.user?.name);
  const hrToken = hrLogin.data.token;

  // 3. Login Manager
  const mgrLogin = await request('POST', '/api/auth/login', {
    email: 'manager@staffsync.com',
    password: 'manager123'
  });
  console.log('✓ [Auth Manager Login]', mgrLogin.status === 200 ? 'PASS' : 'FAIL', 'User:', mgrLogin.data.user?.name);
  const mgrToken = mgrLogin.data.token;

  // 4. Login Employee
  const empLogin = await request('POST', '/api/auth/login', {
    email: 'employee@staffsync.com',
    password: 'employee123'
  });
  console.log('✓ [Auth Employee Login]', empLogin.status === 200 ? 'PASS' : 'FAIL', 'User:', empLogin.data.user?.name);
  const empToken = empLogin.data.token;

  // 5. Attendance Check
  const todayAtt = await request('GET', '/api/attendance/today', null, empToken);
  console.log('✓ [Employee Attendance Status]', todayAtt.status === 200 ? 'PASS' : 'FAIL', 'ClockedIn:', todayAtt.data.isClockedIn);

  // 6. Leave Balance
  const balances = await request('GET', '/api/leaves/balances', null, empToken);
  console.log('✓ [Leave Balances]', balances.status === 200 ? 'PASS' : 'FAIL', `Leave categories: ${balances.data.length}`);

  // 7. Apply Leave
  const applyRes = await request('POST', '/api/leaves', {
    leaveType: 'Casual',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    reason: 'Personal urgent appointment'
  }, empToken);
  console.log('✓ [Apply Leave Request]', applyRes.status === 201 ? 'PASS' : 'FAIL', 'Leave ID:', applyRes.data.leave?._id);

  // 8. Manager Team Leaves & Approval
  const teamLeaves = await request('GET', '/api/leaves/team', null, mgrToken);
  console.log('✓ [Manager Team Leaves]', teamLeaves.status === 200 ? 'PASS' : 'FAIL', `Pending/Team requests: ${teamLeaves.data.length}`);

  if (applyRes.data.leave?._id) {
    const approveRes = await request('PUT', `/api/leaves/${applyRes.data.leave._id}/status`, {
      status: 'Approved',
      reviewComments: 'Approved by team lead. Have a good break!'
    }, mgrToken);
    console.log('✓ [Manager Approve Leave]', approveRes.status === 200 ? 'PASS' : 'FAIL', 'Status:', approveRes.data.leave?.status);
  }

  // 9. Announcements
  const announcements = await request('GET', '/api/announcements', null, empToken);
  console.log('✓ [Announcements Feed]', announcements.status === 200 ? 'PASS' : 'FAIL', `Announcements count: ${announcements.data.length}`);

  // 10. Trainings
  const trainings = await request('GET', '/api/trainings', null, empToken);
  console.log('✓ [Training Catalog]', trainings.status === 200 ? 'PASS' : 'FAIL', `Programs count: ${trainings.data.length}`);

  // 11. HR Analytics Dashboard
  const analytics = await request('GET', '/api/analytics/dashboard', null, hrToken);
  console.log('✓ [HR Analytics Dashboard]', analytics.status === 200 ? 'PASS' : 'FAIL',
    `Total staff: ${analytics.data.summary?.totalStaff}, Attendance rate: ${analytics.data.summary?.attendanceRate}%`);

  console.log('--- All StaffSync HRM Backend Tests Completed Successfully! ---');
  process.exit(0);
};

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
