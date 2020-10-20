define(['knockout', 'jquery','moment','modal','charCount'], function (ko, $, moment) {
	return new function sidebarViewModel() {
		var self = this;
		self.currentPage = ko.observable('Dashboard');
		self.user_name = ko.observable('Mario Ruci');
		self.addChallengeModal = ko.observable(null);
		self.deleteChallengeModal = ko.observable(null);
		self.isSmall = ko.observable(false);
		self.toggleSidebar = function(){
			self.isSmall(!self.isSmall());
		}
		self.searchTerm = ko.observable(null).extend({ throttle: 500 });
		self.searchTerm.subscribe(function(newVal){
			if(newVal){
				_getSidebarData(false, newVal)
				.done(function(data){
					var calendars = data.calendars;
					self.calendars($.map(calendars,function(calendar){
						return new Calendar(calendar);
					}))
				})
			}else{
				_getSidebarData(false, null)
				.done(function(data){
					var calendars = data.calendars;
					self.calendars($.map(calendars,function(calendar){
						return new Calendar(calendar);
					}))
				})
			}
		})

		self.calendars = ko.observableArray([]);

		self.addChallenge = function(){
			console.log('adding challenge...');
			self.addChallengeModal(self);
		}
		self.adding = ko.observable(false);
		self.newColor = ko.observable('#1abc9c');
		self.newName = ko.observable(null).extend({'charCount':{'maxCount':200}});
		self.newDescription = ko.observable(null).extend({'charCount':{'maxCount':250}});
		self.newAmount = ko.observable(30);
		self.colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#E94149", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
		self.selectColor = function(color){
			self.newColor(color);
		}
		self.finaliseAddition = function(){
			self.adding(true);
			_addChallenge()
			.done(function(data){
				self.addChallengeModal(null);
				self.newColor('#1abc9c');
				self.newName(null);
				self.newDescription(null);
				self.newAmount(30);
				self.getData(true);
			})
			.always(function(){
				self.adding(false);
			})
		}
		self.getData = function(redirect_to_last){
			_getSidebarData(true, null)
			.done(function(data){
				var user = data.user_info;
				var calendars = data.calendars;
				self.user_name(user.name);
				self.calendars($.map(calendars,function(calendar){
					return new Calendar(calendar);
				}))
				if(redirect_to_last){
					var last = self.calendars()[self.calendars().length-1].id;
					location.href = "/cms/#Challenge?id="+last;
				}
			})
		}
		self.setCurrent = function(id){
			var calendars = self.calendars();
			ko.utils.arrayFilter(calendars,function(calendar){
				if(calendar.isCurrent()) calendar.isCurrent(false);
				console.log(id);
				if(id == calendar.id) calendar.isCurrent(true);
			})
		}
		function Calendar(data){
			var ca = this;
			ca.id = data.id;
			ca.name = ko.observable(data.name);
			ca.description = ko.observable(data.description);
			ca.creationDate = ko.observable(data.creationDate ? moment(data.creationDate).format('MMMM Do YYYY, h:mm:ss a') : null);
			ca.color = ko.observable(data.color);
			ca.isCurrent = ko.observable(false);
		}
		function _addChallenge(){
			var d = $.Deferred();
			$.post('/addChallenge', {
				'name': self.newName(),
				'description': self.newDescription(),
				'amount': self.newAmount(),
				'color': self.newColor(),
			})
			.done(function (data) {
				if (data) {
					if (data.code == 1) {
						d.resolve(true);
					} else {
						d.reject();
					}
				}
			})
			return d;
		}
		function _getSidebarData(getUserInfo, searchTerm){
			var d = $.Deferred();
			$.post('/getCalendars', {
				'getUserInfo': getUserInfo,
				'searchTerm': searchTerm
			})
			.done(function (data) {
				if (data) {
					if (data.code == 1) {
						d.resolve(data.data ? data.data : []);
					} else {
						d.reject();
					}
				}
			})
			return d;
		}
		self.getData(false);
	};
});