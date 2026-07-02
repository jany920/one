const { server } = require('../server');

function request(port, method, path, body) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const data = body ? JSON.stringify(body) : undefined;
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {},
    }, res => {
      let responseBody = '';
      res.on('data', chunk => { responseBody += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody, headers: res.headers }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

describe('small web app server', () => {
  let listener;
  let port;

  beforeAll(async () => {
    await new Promise(resolve => {
      listener = server.listen(0, '127.0.0.1', () => {
        port = listener.address().port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise(resolve => listener.close(resolve));
  });

  it('serves the app shell', async () => {
    const response = await request(port, 'GET', '/');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.body).toContain('紫微斗数排盘小程序');
  });

  it('generates a chart through the JSON API', async () => {
    const response = await request(port, 'POST', '/api/chart', {
      gender: 'female',
      calendar: 'solar',
      datetime: '1983-01-19T20:00',
      longitude: 121.467,
      timezone: '+08:00',
      options: { true_solar_time: true, age_range: [1, 60] },
    });
    expect(response.statusCode).toBe(200);
    const chart = JSON.parse(response.body);
    expect(chart.meta.wuxing_ju).toBe('金四局');
    expect(chart.palaces).toHaveLength(12);
  });
});
