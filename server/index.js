import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.SYSTEM_STATUS_PORT || 8282;
const clientAppPath = path.join(__dirname + '/client');
const configFilePath = process.env.CONFIG_FILE || path.join(__dirname + '/../config.json');
// One line per container: its name, state, status and image, separated by tabs.
const statusFilePath = process.env.STATUS_FILE || '/status/container-status.txt';
const serviceTitleMap = readTitles();

app.use(cors());
app.use(express.static(clientAppPath));

app.get('/api', (req, res) => {
  fs.readFile(statusFilePath, 'utf8', (err, text) => {
    if (err) { return res.sendStatus(503); }
    res.send(parseStatus(text).map(addTitle));
  });
});

app.get('/', (req, res) => res.sendFile(`${clientAppPath}/index.html`));

app.listen(port);

function readTitles() {
  const titles = {};
  let services = [];
  try {
    ({ services = [] } = JSON.parse(fs.readFileSync(configFilePath)));
  } catch (err) {
    return titles;
  }
  services.forEach((service) => {
    if (service && service.name && service.title) {
      titles[service.name] = service.title;
    }
  });
  return titles;
}

function parseStatus(text) {
  return text.split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const [name, state, status] = line.split('\t');
      return { name, status, isActive: state === 'running', isDisabled: false };
    });
}

function addTitle(service) {
  return { ...service, title: serviceTitleMap[service.name] };
}
