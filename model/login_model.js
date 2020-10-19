const bcrypt = require('bcrypt');
const logger = require('../lib/log.js');

let qCheck = ' SELECT `Users`.`password`\
FROM `Users`\
WHERE `Users`.`email` = ?';

const login = (email,password, connection, cb) => {
    if(!email || !password) return cb('Too few arguments',null);
    connection.query(qCheck,[email], function (error, res, fields) {
        if (error) throw error;
        if(res.length){
            bcrypt.compare(password, res[0].password, function(err, result) {
                if(err) throw err;
                if(result){
                    cb(null,true);
                }else{
                    cb('Wrong password',null);
                }
            });
        }else{
            logger.log('warn', 'User does not exists');
            cb('Does not exist',null);
        }
    });	
}
module.exports = {
    login,
}