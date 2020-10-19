function indexViewModel() {
	var self = this;
	//Login observables
	self.email = ko.observable(null);
	self.password = ko.observable(null);
	self.loginError = ko.observable(null);
	self.loginLoading = ko.observable(false);
	
	//Register observables
	self.newName = ko.observable(null);
	self.newEmail = ko.observable(null);
	self.newPassword = ko.observable(null);
	self.newPasswordRepeat = ko.observable(null);
	self.registerLoading = ko.observable(false);
	self.registerError = ko.observable(null);
	
	self._login = function(){
		/** Input checks */
		if( !self.email() && !self.password() ){
			self.loginError('Please fill in the E-mail and Password in order to continue')
		}else if(!self.email()){
			self.loginError('Please fill in the E-mail in order to continue');
		}else if(!self.password()){
			self.loginError('Please fill in the Password in order to continue');
		}else{
			self.loginError(null);
		}
		if(self.loginError()) return;
		self.loginLoading(true);
		login()
		.done(function(data){
			window.location.href = "/cms/#Dashboard";
		})
		.fail(function(data){
			
		})
		.always(function(data){
			self.loginLoading(false);
		})
	}
	self._register = function(){
		/** Input Checks */
		if( !self.newEmail() && !self.newPassword() && !self.newPasswordRepeat() && !self.newName() ){
			self.registerError('Please fill in the Name,Email, Password, Password-Repeat fields in order to continue')
		}else if(!self.newEmail()){
			self.registerError('Please fill in the Email in order to continue');
		}else if(!self.newPassword()){
			self.registerError('Please fill in the Password in order to continue');
		}else if(!self.newPasswordRepeat()){
			self.registerError('Please fill in the Password-Retype in order to continue');
		}else if(!self.newName()){
			self.registerError('Please fill in the Name in order to continue');
		}else if(self.newPassword() != self.newPasswordRepeat()){
			self.registerError('The passwords do not match');
		}else{
			self.registerError(null);
		}
		
		register()
		.done(function(data){
			window.location.href = "/cms";
		})
		.fail(function(data){
			
		})
		.always(function(data){
			
		})
	}
	
	function register() {
		var d = $.Deferred();
		var o = {
			'name':self.newName(),
			'email':self.newEmail(),
			'password':self.newPassword(),
		};
		$.post( '/register', o)
		.done(function( data ){
			if(data.status=='ok'){
				d.resolve(data.data);
			}else if(data.status=='log'){
				d.reject();
			}else{
				d.reject();
			}
		})
		.fail(function () {
			d.reject();
		});
		return d;
	}
	function login() {
		var d = $.Deferred();
		var o = {
			'email':self.email(),
			'password':self.password()
		};
		$.post( '/login', o)
		.done(function( data ){
			if(data.status=='ok'){
				d.resolve(data.data);
			}else if(data.status=='log'){
				d.reject();
			}else{
				d.reject();
			}
		})
		.fail(function () {
			d.reject();
		});
		return d;
	}
}
if(document.getElementById('__body__'))ko.applyBindings( new indexViewModel(), document.getElementById('__body__') );
else if(console && console.log ) console.log('non existant page');
