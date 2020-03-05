const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')
const app = express()

// init chatkit
const chatkit = new Chatkit.default({
	instanceLocator: "v1:us1:04b906bd-4e62-4f33-91ff-d6ca8b80b9df",
	key: "afbace90-45f9-46d0-a60a-e2ca357e6444:ICXUAB6TVpLRX24hdDR7TiTJba8MPAtmAgK/1ssmSng="
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//create users
app.post('/users', (req, res) => {
	const { username } = req.body
	console.log(username);
	chatkit
		.createUser({
			id: username,
			name: username
		})
		.then(() => res.sendStatus(201))
		.catch(error => {
			if (error.error_type === 'services/chatkit/user_already_exists') {
				res.sendStatus(200)
			} else{
				res.status(error.status).json(error)
			}
		})
})
const PORT = 3001
app.listen(PORT, err => {
	if (err) {
		console.error(err)
	} else {
		console.log(`Running on port ${PORT}`)
	}
})
