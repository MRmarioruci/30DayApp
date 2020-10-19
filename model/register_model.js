const bcrypt = require('bcrypt');
const logger = require('../lib/log.js');

const saltRounds = 10;
let qCheck = ' SELECT `Users`.`id`\
FROM `Users`\
WHERE `Users`.`email` = ?';
let qInsert = 'INSERT INTO `Users`(`email`,`password`,`name`) VALUES( ?, ?, ?)';

const register = (name,email, password, connection, cb) => {
	if(!email || !password || !name) return cb('Too few arguments',null);
	bcrypt.hash(password, saltRounds, function(err, hash) {
		if(!err){
			if(hash){
				connection.query(qCheck,[email], function (error, results, fields) {
					if (error) throw error;
					if(results.length){
						logger.log('warn', 'User exists');
						cb('Err',null);
					}else{
						connection.query(qInsert,[email,hash,name], function (error, results, fields) {
							if (error) throw error;
							if(results.length){
								logger.log('info', 'New user inserted');
								cb(null,'ok');
							}
						});	
					}
				});			   
			}
		}else{
			console.log('Hash error: ',err);
			cb('Err',null);
		}
	});
	cb(null,'ok')
}
module.exports = {
	register
};