define(['knockout', 'jquery'], function (ko, $) {
    function loginViewModel() {
        self.email = ko.observable();
        self.inited = ko.observable(false);
        self.password = ko.observable();
        self.fail = ko.observable(false);
        self.isLoggedIn = ko.observable(false);
        self.login = function(){
            login(email,password)
            .done(function(data){
                self.fail(false);
                self.isLoggedIn(true);
            })
            .fail(function(data){
                self.fail(true);
            })
        }
        self.checkIfLoggedIn = function(){
            isLoggedIn()
            .done(function(data){
                self.isLoggedIn(true);
            })
        }
        function login(email,password) {
            var d = $.Deferred();
            $.post('/_inc/controller/website_control.php', {
                'action': 'login',
                'email': email,
                'password': password,
            })
                .done(function (data) {
                    if (data) {
                        if (data.status == 'ok') {
                            d.resolve(data.data ? data.data : []);
                        } else {
                            d.reject();
                        }
                    }
                })
            return d;
        }
        function isLoggedIn() {
            var d = $.Deferred();
            $.post('/_inc/controller/website_control.php', {
                'action': 'isLoggedIn',
            })
                .done(function (data) {
                    if (data) {
                        if (data.status == 'ok') {
                            d.resolve(data.data ? data.data : []);
                        } else {
                            d.reject();
                        }
                    }
                })
            return d;
        }
        self.checkIfLoggedIn();
        self.inited(true);
    }
    var em = document.getElementById('_loginPage');
    if (em) ko.applyBindings(new loginViewModel(), em);
});