import express from 'express';
import { Agent, fetch } from 'undici';

const app = express();
app.use(express.text({ type: '*/*', limit: '10mb' }));

const FINA_RDC_2020_CERT = `-----BEGIN CERTIFICATE-----
MIIHOzCCBSOgAwIBAgIRAIqrCSPT6y2uAAAAAFZUvzwwDQYJKoZIhvcNAQELBQAw
QzELMAkGA1UEBhMCSFIxHTAbBgNVBAoTFEZpbmFuY2lqc2thIGFnZW5jaWphMRUw
EwYDVQQDEwxGaW5hIFJvb3QgQ0EwHhcNMjAxMTI1MTIzNzEwWhcNMzAxMTI1MTIz
NzEwWjBEMQswCQYDVQQGEwJIUjEdMBsGA1UEChMURmluYW5jaWpza2EgYWdlbmNp
amExFjAUBgNVBAMTDUZpbmEgUkRDIDIwMjAwggIiMA0GCSqGSIb3DQEBAQUAA4IC
DwAwggIKAoICAQCv75uR4V36v7r5SeK8Jig3kxGwHvjTWfkaWg8urJhMZnOmzpMG
9QWtNJ/HzMYYCjHBncKquKXHYeh3Ds/oJwHeMWHCS381LhAGj/sFDF2LnANR7mwK
GgXpe4j9y/e57/uGQ5U4OOYo6mlsOPVvjGlSoTqoAFVWR64m+B8Zx7ceRIaiXd1q
WNJih87eFY4pHXb3K2PFdD34TfqdR9Rnz2TGoyguF7s+Ph3tWOZYbByGEAAHTiv/
JQbY41DQhM0tFnbcO+2lEFztkGpD6S1uLbs4COLSKtpR5+tkHND25QsUDEAi6sRB
6bcDwnYZ+CdweMohnF5S0wzPwGnHLNJV/Lt2sErZHtZB6wEuDrTfBNPs9f59/UVq
8Wt5jYDqLiiagFy5rUAN+uuv7QRlS1uaUN/2SmOlQaf105mUCVoWrPXkpiBUZrDR
M06uLmJTv75RkSaMEoPr2PLPuS3bRmwnYRZ/s6uin/pqnvw4ogD8eZAtWEvuYRLr
5evAJYVI8ud0JJfZ6yZhvBbLQd1w/vD/oR4XOXctjqB267lD9d0egvQ9+Wh0o+Kq
Bi9iUfiwE11mu0lFYcNz/8+tApJ6w9O6wNtutaNU2xYrMrtFNK/arQ0PFucmUEeu
dr2zICKNCcOlFzFwp8s7hrX4sBuM+BNbMTUdrp8Mr1mhiERzuZCyf1jIiwIDAQAB
o4ICJzCCAiMwDgYDVR0PAQH/BAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwgb8G
A1UdIASBtzCBtDCBsQYHK3yIUAUCATCBpTBMBggrBgEFBQcCARZAaHR0cHM6Ly93
d3cuZmluYS5oci9yZWd1bGF0aXZhLWRva3VtZW50aS1pLXBvdHZyZGUtby1zdWts
YWRub3N0aTBVBggrBgEFBQcCARZJaHR0cHM6Ly93d3cuZmluYS5oci9lbi9sZWdp
c2xhdGlvbi1kb2N1bWVudHMtYW5kLWNvbmZvcm1hbmNlLWNlcnRpZmljYXRlczBj
BggrBgEFBQcBAQRXMFUwHwYIKwYBBQUHMAGGE2h0dHA6Ly9vY3NwLmZpbmEuaHIw
MgYIKwYBBQUHMAKGJmh0dHA6Ly9yZGMuZmluYS5oci9Sb290L0ZpbmFSb290Q0Eu
Y2VyMIGVBgNVHR8EgY0wgYowLKAqoCiGJmh0dHA6Ly9yZGMuZmluYS5oci9Sb290
L0ZpbmFSb290Q0EuY3JsMFqgWKBWpFQwUjELMAkGA1UEBhMCSFIxHTAbBgNVBAoT
FEZpbmFuY2lqc2thIGFnZW5jaWphMRUwEwYDVQQDEwxGaW5hIFJvb3QgQ0ExDTAL
BgNVBAMTBENSTDEwHwYDVR0jBBgwFoAU/hGibBDu3uIDuFWCTiI8huQ+a1QwHQYD
VR0OBBYEFHok8OJzOcWBFAwTUzAicydI3iuLMA0GCSqGSIb3DQEBCwUAA4ICAQBw
kpiNO2Rr2fPWVAmR91TEof/QeCcout+CnWbeVSxgxe5pkzT68zJZ5WhyAxkKeDRK
1DHDbbIt2Sc6WiVxz+Zq0cDVOxAtqlhdR1TQkqTbE1UdMwwggOGPscOt6RhQtBt+
ewdmaEBUxdLg7WHB6aohYPR65RHAIiIvxpkJ6dxBGwJQECkmG+phQPC+9oYfaE9f
vYEkeTuHLMjFsS6oODQRJ7BgrOp1at2GKMzI/f8AJ8ZgYp6FqFk1UelsfC3nycmc
kxqcCVGzRZHq5EmgkSEAezcTfZUXiUCy4Vkmrt4Tm3AxltnfpObOzza2qRHe2I3f
zr0fIDEn5f8TSv2cZhcRefdlQPsOeS45p8YzNLn82gGHoO5lED24ctr8cbQWMcs2
W1aPwchRaBPtk5zgjRiDZSby5xFMhgXIgbjL9ThSYd7sMPRZiblvGyo8hfRbHmN4
jGVKlcCkhylCw8A5pjms7xSa9HNyecamPxlUAHPA6rg5+OIR4K8djrgv88zdzztO
xo+fiG3SbcN++NUZHo6eJTdkJr3VcNwZCAvXRH2tQnNzRvSAEvKNJmS7QI6nH99o
RJAyxN7TKK/nlMFwef/rGuPkEGZ9r0dC4rFgg8tIjpnpjXywqrZyTL2vuvzY9xYe
Bc62Yo8RYL7E8hPT2h1Yfxi3X9AP0/AyqUjdTRXnKg==
-----END CERTIFICATE-----`;

const CIS_PROD_URL = 'https://cis.porezna-uprava.hr:8449/FiskalizacijaService';
const CIS_TEST_URL = 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest';

const agent = new Agent({ connect: { ca: FINA_RDC_2020_CERT } });

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`CIS proxy listening on ${PORT}`));
