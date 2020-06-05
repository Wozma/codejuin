const { checkAndChange } = require('./assets/functions');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const config = require('./assets/config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');



var firebase = require('firebase');
var databaseFirebase = firebase.initializeApp({
	apiKey: "AIzaSyBqgOOCshRUlmzroS-R3o5gOSyqKthoQtU",
	authDomain: "gamemapping-1bc86.firebaseapp.com",
	databaseURL: "https://gamemapping-1bc86.firebaseio.com",
	projectId: "gamemapping-1bc86",
	storageBucket: "gamemapping-1bc86.appspot.com",
	messagingSenderId: "215974569996",
	appId: "1:215974569996:web:42cb535a7f1f44b4302629"
});


console.log('Connected');
const app = express();
const Members = require('./assets/classes/members-class')(databaseFirebase);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`${config.rootAPI}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const io = require('socket.io')(3000)



let MembersRouter = express.Router();


MembersRouter.route('/:id')
	// Récupère un membre avec son ID
	.get(async (req, res) => {
		let member = await Members.getByID(req.params.id);
		res.json(checkAndChange(member));
	})
	// Modifie un membre avec ID
	.put(async (req, res) => {
		let updateMember = await Members.updateMember(req.params.id, req.body.name);
		res.json(checkAndChange(updateMember));
	})
	// Supprime un membre avec ID
	.delete(async (req, res) => {
		let deleteMember = await Members.deleteMember(req.params.id);
		res.json(checkAndChange(deleteMember));
	});

MembersRouter.route('/')
	// Récupère tous les membres
	.get(async (req, res) => {
		let allMembers = await Members.getAll(req.query.max);
		res.json(checkAndChange(allMembers));
	})
	// Ajoute un membre avec son nom
	.post(async (req, res) => {
		let setMember = await Members.setMember(req.body.pseudo, req.body.score);

		// io.on('connection', socket => {
		// 	socket.emit("test", "hello")
		// 	socket.emit("add", "hello")
		// })
		res.json(checkAndChange(setMember));
	});

app.use(config.rootAPI + '/members', MembersRouter);
app.listen(config.port, () => console.log('Started on port ' + config.port));

