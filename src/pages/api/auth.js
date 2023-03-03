export default function handler(_, response) {
  response.setHeader("WWW-authenticate", 'Basic realm="Secure Area"');
  response.statusCode = 401;
  response.end(`Auth Required.`);
}
