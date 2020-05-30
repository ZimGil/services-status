import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import shelljs from 'shelljs';

const app = express();
const port = process.env.SYSTEM_STATUS_PORT || 8282;
const { services } = JSON.parse(fs.readFileSync(path.join(__dirname + '/../config.json')));
// const { services } = require('./config.json');
const command = `systemctl show ${services.join(' ')} -p Description -p ActiveState -p StateChangeTimestamp`;
app.use(cors());
app.use(express.static(path.join(__dirname + '/client/')));

app.get('/api', (req, res) => {
	if (!services) {res.sendStatus(204);}
	const currentStatus = shelljs.exec(command,{silent: true})
		.trim()
		.split('\n\n')
		.map((serviceData) => {
			// eslint-disable-next-line no-unused-vars
			let [_, name, activeState, stateChangeTimestamp] = serviceData.match(/Description=(.+)\nActiveState=(.+)\nStateChangeTimestamp=(.+)/m);
			stateChangeTimestamp = stateChangeTimestamp.split(' ');
			stateChangeTimestamp.pop();
			stateChangeTimestamp = stateChangeTimestamp.join(' ');
			return {
				name,
				isActive: activeState === 'active',
				timestamp: new Date(stateChangeTimestamp)
			};
		});

	res.send(currentStatus);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/client/index.html')));

app.listen(port);
