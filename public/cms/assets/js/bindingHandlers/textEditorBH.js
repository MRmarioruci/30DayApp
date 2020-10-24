define(['knockout', 'ckeditor'], function (ko, InlineEditor) {
	ko.bindingHandlers.textEditor = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var val = ko.unwrap(valueAccessor());
			var editor = null;
			InlineEditor
			.create(element, {
				removePlugins: [],
				toolbar: {
					items: [
						'heading',
						'|',
						'bold',
						'italic',
						'link',
						'bulletedList',
						'numberedList',
						'blockQuote',
						'undo',
						'redo'
					]
				},
			})
			.then( e => {
				if(val)e.setData(val);
				e.model.document.on( 'change:data', (data) => {
					valueAccessor()( e.getData() );
				} )
				editor = e;
			} )
			.catch(error => {
				console.log(error);
			});
			
			valueAccessor().subscribe(function (newVal) {
				if (editor) {
					if(newVal){
						if( editor.getData() != newVal ) editor.setData(newVal);
					}else{
						editor.setData('');
					}
				}
			});
		},
	};
});
