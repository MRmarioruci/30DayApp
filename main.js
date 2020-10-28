const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const mysql      = require('mysql');
const path = require('path');

const client  = redis.createClient();
const router = express.Router();
const app = express();
const redis_port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOSTNAME;

/** Models */
let login = require('./model/login_model.js');
let register = require('./model/register_model.js');
/**Libs */
let logger = require('./lib/log.js');
/** Controllers */
let controlCalendar = require('./controller/calendar.js');

/**ENV */
var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : process.env.DB_DATABASE,
});
connection.connect();

app.use(session({
	secret: 'secret',
	store: new redisStore({ host: host, port: redis_port, client: client}),
	saveUninitialized: false,
	resave: false
}));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

router.get('/',function(req,res){
	let sess = req.session;
	if(sess.email) {
		return res.redirect('/cms');
	}
	res.sendFile('public/index.html', {root: __dirname })
});
router.get('/cms/:path*',function(req,res,next){
	if(!req.session.email) {
		res.sendFile('public/cms/not_logged.html', {root: __dirname })
	}else{
		next()
	}
});
router.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
	});
});
router.post('/register',async (req,res) => {
	if(req.session.email) return res.json({'status':'err','data':'Alredy logged in'});
	
	await register.register(req.body.name,req.body.email,req.body.password, req.body.gender, connection)
	.then(d => {
		logger.log('info', 'Registration complete');
		req.session.email = req.body.email;
		res.json({'status':'ok','data':d});
	})
	.catch(d => {
		logger.log('warn', 'Registration error:', err);
		res.json({'status':'err','data':false});
	})
});
router.all('/login',(req,res) => {
	if(req.session.email) return res.json({'status':'err','data':'Alredy logged in'});
	
	login.login(req.body.email,req.body.password, connection, function(err,data){
		if(!err){
			logger.log('info', 'Login success');
			req.session.email = req.body.email;
			res.json({'status':'ok','data':data});
		}else{
			logger.log('warn', 'Login error', err);
			res.json({'status':'err','data':false});
		}
	});
});
router.all('/isLoggedIn',(req,res) => {
	if(req.session.email){
		res.json({'status':'ok','data':true});
	}else{
		res.json({'status':'ok','data':false});
	}
});

app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 3000,() => {
	logger.log('info', `App Started on PORT ${process.env.PORT || 3000}`);
	controlCalendar.run(router,connection,logger);
});