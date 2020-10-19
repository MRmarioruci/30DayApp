require.config({
	baseUrl: '/cms/assets/js',
	paths:{
		knockout: '../../../_common_/vendor/knockout',
		jquery: "../../../_common_/vendor/jquery.min",
		pager: '../../../_common_/vendor/pager.min',
		ckeditor: 'https://cdn.ckeditor.com/ckeditor5/23.0.0/inline/ckeditor',
		text: '../../../_common_/vendor/text',
		'bootstrap': "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.bundle.min",
		'moment':"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment",

		/* ViewModels */
		'masterViewModel': 'viewModels/masterViewModel',
		'dashboardViewModel': 'viewModels/dashboardViewModel',
		'sidebarViewModel': 'viewModels/sidebarViewModel',
		'repositoryViewModel': 'viewModels/repositoryViewModel',
		'commitsViewModel': 'viewModels/commitsViewModel',
		'tasksViewModel': 'viewModels/tasksViewModel',
		/*Components*/

		/*Binding handlers*/
		modal: 'bindingHandlers/modalBindingHandler',
		textEditor: 'bindingHandlers/textEditorBH',
		/*Extenders*/
		charCount: 'extenders/charCount',
	},
	shim: {
		'bootstrap':['jquery'],
		'pager':['knockout'],
	},
})
require(['knockout','jquery','pager','masterViewModel','bootstrap','textEditor'], function(ko, $, pager, masterViewModel)
{
    pager.extendWithPage(masterViewModel);
    ko.applyBindings(masterViewModel);
    pager.start();	
});
