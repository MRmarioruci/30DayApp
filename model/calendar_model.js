module.exports = {
	add:function(name,description,amount,color,user_id,connection,cb){
		var q = 'INSERT INTO `Calendars`(`name`,`description`,`color`,`user_id`,`creationDate`) VALUES(?,?,?,?,NOW())';
		connection.query(q,[name,description,color,user_id] ,function(err, rows, fields) {
			if (!err){
				if(rows){
					for (let i = 0; i < amount; i++) {
						module.exports.addDay(rows.insertId,i,connection,function(error,day){
							//
						});
					}
					cb(null,rows.insertId);
				}else{
					cb('Err',null);
				}
			}else{
				cb('Err',null);
			}
		});
	},
	addDay:function(calendar_id,order,connection,cb){
		var q = 'INSERT INTO `Days`(`calendar_id`,`order`, `date`) VALUES(?,?, now() + interval ? day)';
		connection.query(q,[calendar_id,order, order] ,function(err, rows, fields) {
			if (!err){
				if(rows){
					cb(null,rows.insertId);
				}else{
					cb('Err',null);
				}
			}else{
				cb('Err',null);
			}
		});
	},
	get:function(user_id, searchTerm, connection,cb){
		if(searchTerm){
			searchTerm = searchTerm+'%';
			let q = 'SELECT \
				`Calendars`.`id`, \
				`Calendars`.`name`, \
				`Calendars`.`description`, \
				`Calendars`.`creationDate`, \
				`Calendars`.`color` \
			FROM `Calendars` \
			JOIN `Users` ON `Users`.`id` = `Calendars`.`user_id`\
			WHERE `Users`.`id` = ? \
			AND `Calendars`.`name` LIKE ? \
			OR `Calendars`.`description` LIKE ?';
			connection.query(q,[user_id, searchTerm, searchTerm] ,function(err, rows, fields) {
				if (!err){
					cb(null,rows);
				}else{
					cb('Err',null);
				}
			});
		}else{
			let q = 'SELECT \
				`Calendars`.`id`, \
				`Calendars`.`name`, \
				`Calendars`.`description`, \
				`Calendars`.`creationDate`, \
				`Calendars`.`color` \
			FROM `Calendars` \
			JOIN `Users` ON `Users`.`id` = `Calendars`.`user_id`\
			WHERE `Users`.`id` = ?';
			connection.query(q,[user_id] ,function(err, rows, fields) {
				if (!err){
					cb(null,rows);
				}else{
					cb('Err',null);
				}
			});
		}
	},
	delete:function(id,user_id,connection,cb){
		var q = 'DELETE FROM `Calendars` \
		JOIN `Users` ON `Users`.`id` = `Calendars`.`user_id`\
		WHERE `Calendars`.`id` = ? AND `Users`.`id` = ?';
		connection.query(q,[id,user_id] ,function(err, rows, fields) {
			if (!err){
				if(rows){
					cb(null,true);
				}else{
					cb('Err',null);
				}
			}else{
				console.log(err);
				cb('Err',null);
			}
		});
	},
	getCalendar:function(user_id,calendar_id,connection,cb){
		var q = 'SELECT \
		`Calendars`.`id`, \
		`Calendars`.`name`, \
		`Calendars`.`description`, \
		`Calendars`.`creationDate`, \
		`Calendars`.`color`, \
		`Days`.`id` AS `day_id`, \
		`Days`.`order`, \
		`Days`.`status`, \
		`Days`.`date`, \
		`DayActivities`.`id` AS `da_id`, \
		`DayActivities`.`text` \
		FROM `Calendars` \
		JOIN `Users` ON `Users`.`id` = `Calendars`.`user_id`\
		LEFT JOIN `Days` ON `Days`.`calendar_id` = `Calendars`.`id`\
		LEFT JOIN `DayActivities` ON `Days`.`id` = `DayActivities`.`day_id`\
		WHERE `Users`.`id` = ? \
		AND `Calendars`.`id` = ?\
		ORDER BY `Days`.`order`,`DayActivities`.`id`';
		connection.query(q,[user_id,calendar_id] ,function(err, rows, fields) {
			if (!err){
				let last_id = -1;
				let i = -1;
				let out = [];
				let j = 0;
				rows.forEach(row => {
					if(row.id != last_id){
						i++;
						out.push({
							'id':row.id,
							'name':row.name,
							'description':row.description,
							'creationDate':row.creationDate,
							'color':row.color,
							'days':[]
						})
						last_id = row.id;
					}
					if(row.day_id){
						out[i].days.push({
							'id':row.day_id,
							'order':row.order,
							'status':row.status,
							'date':row.date,
							'activities':[]
						})
						j = 0;
					}
					if(row.da_id){
						out[i].days[j].activities.push({
							'id':row.da_id,
							'text':row.text,
						})
						j++;
					}
				});
				cb(null,out);
			}else{
				cb('Err',null);
			}
		});
	},
	editDay:function(user_id,calendar_id,id,changes,connection,cb){
		let canContinue = false;
		let key = null;
		let value = null;

		if(changes.hasOwnProperty('status')){
			key = '`status`';
			value = parseInt(changes['status']);
			canContinue = true; 
		}
		if(!canContinue) return cb('Err',null);
		
		var q = 'UPDATE `Days`\
		JOIN `Calendars` ON `Calendars`.`id` = `Days`.`calendar_id`\
		JOIN `Users` ON `Users`.`id` = `Calendars`.`user_id`\
		SET `Days`.::COL:: = ?\
		WHERE `Days`.`id` = ?\
		AND `Calendars`.`id` = ?\
		AND `Users`.`id` = ?';
		q = q.replace('::COL::', key);
		connection.query(q,[value,id,calendar_id,user_id] ,function(err, rows, fields) {
			if (!err){
				cb(null,true);
			}else{
				cb('Err',null);
			}
		});
	},
	addActivity:function(user_id,day_id,text,connection,cb){
		var q = 'INSERT INTO `DayActivities`(`text`,`day_id`) VALUES(?,?)';
		connection.query(q,[text,day_id] ,function(err, rows, fields) {
			if (!err){
				if(rows){
					cb(null,rows.insertId);
				}else{
					cb('Err',null);
				}
			}else{
				cb('Err',null);
			}
		});
	},
};