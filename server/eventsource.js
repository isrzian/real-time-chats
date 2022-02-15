const express = require('express');
const cors = require('cors');
const {EventEmitter} = require('events');
const PORT = 5000;

const emitter = new EventEmitter();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/connect', (req, res) => {
	res.writeHead(200, {
		'Connection': 'keep/alive',
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
	})
	emitter.on('newMessage', (message) => {
		res.write(`data: ${JSON.stringify(message)} \n\n`)
	})
})

app.post('/new-messages', ((req, res) => {
	const message = req.body;
	emitter.emit('newMessage', message);
	res.status(200);
}))


app.listen(PORT, () => console.log(`Server has been started on ${PORT} port...`));