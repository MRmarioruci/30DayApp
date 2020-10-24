var calendarModel = require('../model/calendar_model.js');
var user = require('../lib/user.js');
var error = require('../lib/errorCodes.js');

module.exports = {
	run:function (router,connection,logger){
		router.post('/addChallenge',(req,res) => {
			let request = req.body;
			if(req.session.email) {
				if(request.name && request.description && request.amount && request.color){
					user.getUserId(req.session.email,connection,function(err,response){
						if(response){
							calendarModel.add(request.name,request.description,request.amount,request.color,response.id,connection, function(err, response){
								if(!err){
									logger.log('info', 'Challenge added');
									res.json({'code':1,'data':response});
								}else{
									res.json(error.getError('QUERY'));
								}
							})
						}else{
							res.json(error.getError('QUERY'));
						}
					})
				}else{
					res.json(error.getError('INVALID_PARAMS'));
				}
			}else{
				res.json(error.getError('NOT_LOGGED'));
			}
		}),
		router.post('/getCalendars',(req,res) => {
			let request = req.body;
			if(req.session.email) {
				user.getUserId(req.session.email,connection,function(err,response){
					if(response){
						let user_id = response.id;
						let searchTerm = request.searchTerm;
						calendarModel.get(user_id, searchTerm, connection, function(err, response){
							if(!err){
								if(request.getUserInfo){
									user.getUserInfo(user_id,connection,function(error,user_info){
										if(user_info){
											res.json({'code':1,'data':{'calendars':response,'user_info':user_info}});
										}else{
											res.json(error.getError('QUERY'));
										}
									});
								}else{
									res.json({'code':1,'data':{'calendars':response}});
								}
							}else{
								res.json(error.getError('QUERY'));
							}
						})
					}else{
						res.json(error.getError('QUERY'));
					}
				})
			}else{
				res.json(error.getError('NOT_LOGGED'));
			}
		}),
		router.post('/deleteChallenge',(req,res) => {
			let request = req.body;
			if(req.session.email) {
				if(request.challenge_id){
					user.getUserId(req.session.email,connection,function(err,response){
						if(response){
							calendarModel.delete(request.challenge_id, response.id, connection, function(err, response){
								if(!err){
									logger.log('info', 'Challenge deleted');
									res.json({'code':1,'data':response});
								}else{
									logger.log('error', error.getError('QUERY'));
									res.json(error.getError('QUERY'));
								}
							})
						}else{
							logger.log('error', error.getError('QUERY'));
							res.json(error.getError('QUERY'));
						}
					})
				}else{
					logger.log('error', error.getError('INVALID_PARAMS'));
					res.json(error.getError('INVALID_PARAMS'));
				}
			}else{
				logger.log('error', error.getError('NOT_LOGGED'));
				res.json(error.getError('NOT_LOGGED'));
			}
		}),
		router.post('/getCalendar',(req,res) => {
			let request = req.body;
			if(req.session.email) {
				user.getUserId(req.session.email,connection,function(err,response){
					if(response){
						let user_id = response.id;
						calendarModel.getCalendar(user_id,request.id,connection, function(err, response){
							if(!err){
								res.json({'code':1,'data':response});
							}else{
								res.json(error.getError('QUERY'));
							}
						})
					}else{
						res.json(error.getError('QUERY'));
					}
				})
			}else{
				res.json(error.getError('NOT_LOGGED'));
			}
		}),
		router.post('/editDay',(req,res) => {
			let request = req.body.data;
			if(request.calendar_id && request.id && request.changes){
				if(req.session.email) {
					user.getUserId(req.session.email,connection,function(err,response){
						if(response){
							let user_id = response.id;
							calendarModel.editDay(user_id,request.calendar_id,request.id,request.changes,connection, function(err, response){
								if(!err){
									res.json({'code':1,'data':response});
								}else{
									res.json(error.getError('QUERY'));
								}
							})
						}else{
							res.json(error.getError('QUERY'));
						}
					})
				}else{
					res.json(error.getError('NOT_LOGGED'));
				}
			}else{
				res.json(error.getError('INVALID_PARAMS'));
			}
		}),
		router.post('/addActivity',(req,res) => {
			let request = req.body;
			if(request.day_id && request.text){
				if(req.session.email) {
					user.getUserId(req.session.email,connection,function(err,response){
						if(response){
							let user_id = response.id;
							calendarModel.addActivity(user_id,request.day_id,request.text,connection, function(err, response){
								if(!err){
									res.json({'code':1,'data':response});
								}else{
									res.json(error.getError('QUERY'));
								}
							})
						}else{
							res.json(error.getError('QUERY'));
						}
					})
				}else{
					res.json(error.getError('NOT_LOGGED'));
				}
			}else{
				res.json(error.getError('INVALID_PARAMS'));
			}
		})
		router.post('/deleteActivity',(req,res) => {
			let request = req.body;
			if(request.day_id && request.activity_id && request.challenge_id){
				if(req.session.email) {
					user.getUserId(req.session.email,connection,function(err,response){
						if(response){
							let user_id = response.id;
							calendarModel.deleteActivity(user_id, request.challenge_id, request.day_id, request.activity_id, connection, function(err, response){
								if(!err){
									res.json({'code':1,'data':response});
								}else{
									res.json(error.getError('QUERY'));
								}
							})
						}else{
							res.json(error.getError('QUERY'));
						}
					})
				}else{
					res.json(error.getError('NOT_LOGGED'));
				}
			}else{
				res.json(error.getError('INVALID_PARAMS'));
			}
		})
	},
}