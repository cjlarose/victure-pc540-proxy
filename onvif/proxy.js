const httpProxy = require('http-proxy');

const PROXY_LISTEN_PORT = 8080;
const CAMERA_IP = process.env.CAMERA_IP;
const RTSP_PROXY_HOST = process.env.RTSP_PROXY_HOST;

const proxyOptions = {
  target: `http://${CAMERA_IP}:8080`,
  selfHandleResponse: true,
};

const proxy = httpProxy.createProxyServer(proxyOptions);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function rewriteResponseBody(proxyRequestHostHeader, responseBody) {
  const httpPattern = new RegExp(escapeRegExp(`http://${CAMERA_IP}:8080`), 'g');
  const rtspPatten = new RegExp(escapeRegExp(`rtsp://${CAMERA_IP}:554`), 'g');
  return responseBody
    .replace(httpPattern, `http://${proxyRequestHostHeader}`)
    .replace(rtspPatten, `rtsp://${RTSP_PROXY_HOST}:554`);
}

proxy.on('proxyRes', function (proxyRes, req, res) {
  const requestHostHeader = req.headers.host;
  const proxyResponseHeaders = proxyRes.headers;

  const body = [];

  proxyRes.on('data', function (chunk) {
    body.push(chunk);
  });

  proxyRes.on('end', function () {
    res.statusCode = proxyRes.statusCode;
    res.statusMessage = proxyRes.statusMessage;

    for (const key of Object.keys(proxyResponseHeaders)) {
      const proxyHeaderValue = proxyResponseHeaders[key];
      res.setHeader(key, proxyHeaderValue);
    }

    const responseBody = Buffer.concat(body).toString();
    const modifiedBody = rewriteResponseBody(requestHostHeader, responseBody);

    res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
    res.end(modifiedBody);
  });
});

proxy.listen(PROXY_LISTEN_PORT);

console.log(`Starting onvif server on port ${PROXY_LISTEN_PORT}`);
