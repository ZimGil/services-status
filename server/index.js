import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import shelljs from 'shelljs';

const app = express();
const port = process.env.SYSTEM_STATUS_PORT || 8282;
const serviceTitleMap = {};
let { services } = JSON.parse(fs.readFileSync(path.join(__dirname + '/../config.json')));
services = services.map((service) => {
  if (typeof service === 'string') {return service;}
  if (service.title) {
    serviceTitleMap[service.name] = service.title;
  }
  return service.name;
})
const command = `systemctl show ${services.join(' ')} -p Id -p ActiveState -p StateChangeTimestamp`;
const detailsRegex = /Id=(.+)\nActiveState=(.+)\nStateChangeTimestamp=(.+)/m;

app.use(cors());
app.use(express.static(path.join(__dirname + '/client/')));

app.get('/api', (req, res) => {
	if (!services) {res.sendStatus(204);}
	const currentStatus = shelljs.exec(command,{silent: true})
		.trim()
		.split('\n\n')
		.map((serviceData) => {
      let [, name, activeState, timestamp] = serviceData.match(detailsRegex);
      name = name.split('.');
      name.pop();
      name = name.join('.');
			timestamp = timestamp.split(' ');
			timestamp.pop();
			timestamp = timestamp.join(' ');
			return {
        name,
				title: serviceTitleMap[name],
				isActive: activeState === 'active',
				timestamp: new Date(timestamp)
			};
		});

	res.send(currentStatus);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/client/index.html')));

app.listen(port);
