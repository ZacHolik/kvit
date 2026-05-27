import express from 'express';
import { Agent, fetch } from 'undici';

const app = express();
app.use(express.text({ type: '*/*', limit: '10mb' }));

const CIS_PROD_URL = 'https://cis.porezna-uprava.hr:8449/FiskalizacijaService';
const CIS_TEST_URL = 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest';

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

const PROXY_SECRET = process.env.PROXY_SECRET;

app.post('/fiscalize', async (req, res) => {
  // Auth
  if (PROXY_SECRET && req.headers['x-proxy-secret'] !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const env = req.headers['x-fina-env'] ?? 'test';
  const cisUrl = env === 'production' ? CIS_PROD_URL : CIS_TEST_URL;

  try {
    const response = await fetch(cisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] ?? 'text/xml;charset=UTF-8',
        'SOAPAction': req.headers['soapaction'] ?? '',
      },
      body: req.body,
      dispatcher: agent,
    });

    const text = await response.text();
    res.status(response.status)
       .set('Content-Type', 'text/xml;charset=UTF-8')
       .send(text);
  } catch (err) {
    console.error('[CIS-PROXY] Error:', err);
    res.status(502).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/tcp-test', async (req, res) => {
  const net = await import('net');
  const socket = new net.Socket();
  const result = await new Promise((resolve) => {
    socket.setTimeout(5000);
    socket.connect(8449, 'cistest.apis-it.hr', () => {
      socket.destroy();
      resolve({ connected: true });
    });
    socket.on('error', (err) => resolve({ connected: false, error: err.message }));
    socket.on('timeout', () => resolve({ connected: false, error: 'timeout' }));
  });
  res.json(result);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`CIS proxy listening on ${PORT}`));
