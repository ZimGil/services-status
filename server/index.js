import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import systemdStatus from 'systemd-status';

const app = express();
const port = process.env.SYSTEM_STATUS_PORT || 8282;
const clientAppPath = path.join(__dirname + '/client');
const configFilePath = path.join(__dirname + '/../config.json');
const configData = fs.readFileSync(configFilePath);
const serviceTitleMap = {};

app.use(cors());
app.use(express.static(clientAppPath));

let { services } = JSON.parse(configData);
services = services.map((service) => {
  if (typeof service === 'string') { return service; }
  if (service.title) {
    serviceTitleMap[service.name] = service.title;
  }
  return service.name;
});

app.get('/api', (req, res) => {
  if (!services) { res.sendStatus(204); }
  res.send(systemdStatus(services).map(addTitle));
});

app.get('/', (req, res) => res.sendFile(`${clientAppPath}/index.html`));

app.listen(port);

function addTitle(service) {
  return { ...service, title: serviceTitleMap[service.name] };
}
