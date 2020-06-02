import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import shelljs from 'shelljs';

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

const command = `systemctl show ${services.join(' ')} -p Id -p ActiveState -p StateChangeTimestamp`;
const detailsRegex = /Id=(.+)\nActiveState=(.+)\nStateChangeTimestamp=(.+)/m;


app.get('/api', (req, res) => {
  if (!services) { res.sendStatus(204); }
  res.send(getStatus());
});

app.get('/', (req, res) => res.sendFile(`${clientAppPath}/index.html`));

app.listen(port);

function getStatus() {
  return shelljs.exec(command, { silent: true })
    .trim()
    .split('\n\n')
    .map((serviceData) => {
      let [, name, activeState, timestamp] = serviceData.match(detailsRegex);
      name = name.split('.').slice(0, -1).join('.');
      timestamp = timestamp.split(' ').slice(0, -1).join(' ');
      return {
        name,
        title: serviceTitleMap[name],
        isActive: activeState === 'active',
        timestamp: new Date(timestamp)
      };
    });
}
