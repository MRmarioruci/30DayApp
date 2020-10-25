const bcrypt = require('bcrypt');
const { request } = require('express');
const { resolve } = require('path');
const logger = require('../lib/log.js');

const saltRounds = 10;
let qCheck = ' SELECT `Users`.`id`\
FROM `Users`\
WHERE `Users`.`email` = ?';
let qInsert = 'INSERT INTO `Users`(`email`, `password`, `name`, `gender`) VALUES(?, ?, ?, ?)';

const register = (name,email, password, gender, connection) => {
	return new Promise((resolve, reject) => {
		if(!email || !password || !name) return reject('Too few arguments',null);
		bcrypt.hash(password, saltRounds, function(err, hash) {
			if(!err){
				if(hash){
					connection.query(qCheck,[email], function (error, results, fields) {
						if(error){
							logger.log('error', 'Could not check if user exists');
							reject('Err', null);
						}else{
							if(results.length){
								logger.log('warn', 'User exists');
								reject('Err',null);
							}else{
								connection.query(qInsert,[email, hash, name, gender], function (error, results, fields) {
									if(error){
										logger.log('error', 'Insertion failed');
										reject('Err', null);
									}else{
										logger.log('info', 'New user inserted');
										resolve(null,'ok');
									}
								});
							}
						}
					});
				}
			}else{
				console.log('Hash error: ',err);
				reject('Err',null);
			}
		});
	})
}
module.exports = {
	register
};