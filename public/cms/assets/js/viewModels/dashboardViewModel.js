define(['knockout', 'jquery','moment','sidebarViewModel','modal'], function (ko, $,moment,sidebarViewModel) {
    return function dashboardViewModel() {
        var self = this;
        self.calendar = ko.observable(null);
        self.editModal = ko.observable(null);
        self.daysRemaining = ko.observable(10);
        self.id = ko.observable();
        var sidebar = new sidebarViewModel();

        self.id.subscribe(function(newv){
            self.getData();
            sidebar.setCurrent(newv);
        })
        self.name = ko.observable(null);
		self.init = function(page){
            self.id(parseInt(page.pageRoute.params.id));
        }
		self.getData = function(){
            _getData()
            .done(function(data){
                self.calendar(new Calendar(data[0]));
            })
        }
        function Calendar(data){
			var ca = this;
			ca.id = data.id;
            ca.name = ko.observable(data.name);
			ca.description = ko.observable(data.description);
			ca.creationDate = ko.observable(data.creationDate ? moment(data.creationDate).format('MMMM Do YYYY, h:mm:ss a') : null);
            ca.color = ko.observable(data.color);
            ca.days = ko.observableArray($.map(data.days,function(day){
                return new Day(day,ca);
            }))
        }
        function Day(data,parent){
            var day = this;
            day.id = data.id;
            day.order = ko.observable(data.order);
            day.activities = ko.observableArray($.map(data.activities,function(activity){
                return new Activity(activity,day);
            }));
            day.status = ko.observable(parseInt(data.status));
            day.status.subscribe(function(newVal){
                if(newVal){
                    _editDay({calendar_id:parent.id,id:day.id,changes:{'status':newVal}});
                }
			})
            day.showSuccess = ko.observable(false);
            day.setStatus = function(status){
                day.status(status);
                if(status == 2){
                    day.showSuccess(true);
                    setTimeout(function(){
                        day.showSuccess(false);
                    },4000);
                }
            }
            day.editMe = function(){
                self.editModal(day);
            }
            day.newActivity = ko.observable(null);
            day.addActivity = function(){
                _addActivity(day.id,day.newActivity())
                .done(function(data){
                    var f = {'id':data,'text':day.newActivity()};
                    var tmp = new Activity(f,day);
                    day.activities.push(tmp);
                    day.newActivity(null);
                })
            }
            day.remainingDays = ko.pureComputed(function(){
                var days = parent.days();
                return days.length - (day.order() +1);
            })
        }
        function Activity(data,parent){
            var act = this;
            act.id = data.id;
            act.text = ko.observable(data.text);
        }
		function _getData(){
			var d = $.Deferred();
			$.post('/getCalendar', {
                'id':self.id()
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
        function _editDay(data){
			var d = $.Deferred();
			$.post('/editDay', {
                data
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
        function _addActivity(day_id,text){
			var d = $.Deferred();
			$.post('/addActivity', {
                'day_id':day_id,
                'text':text
            })
			.done(function (data) {
				if (data) {
					if (data.code == 1) {
						d.resolve(data.data ? data.data : null);
					} else {
						d.reject();
					}
				}
			})
			return d;
        }
    };
});