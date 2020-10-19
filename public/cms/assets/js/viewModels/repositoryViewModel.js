define(['knockout', 'jquery', 'sidebarViewModel','modal','charCount'], function (ko, $, sidebar) {
	return function repositoryViewModel() {
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable(null);
        self.
		self.init = function(page){
            self.id(parseInt(page.pageRoute.params.id));
        }
		self.getData = function(){
            _getData()
            .done(function(data){

            })
        }
        
		
		function _getData(){
			var d = $.Deferred();
			$.post('/getRepositories', {})
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
	};
});