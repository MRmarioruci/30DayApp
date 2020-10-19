define(['knockout','sidebarViewModel'], function (ko,sidebarViewModel ) {
    var masterViewModel = new function masterViewModel() {
        var self = this;
        self.inited = ko.observable(false);
        
        $(document).ready(function(){
            //$( "#sidebar__container" ).load( "/cms/pages/sidebar.html" );
            setTimeout(function(){
                self.inited(true);
            },2000);
        });
    }
    return  {
        'masterViewModel':masterViewModel,
        'sidebarViewModel': sidebarViewModel,
    };
});
