define(['knockout'],function(ko){
	ko.bindingHandlers.modal = {
		init: function (element, valueAccessor, allBindingsAccessor, data, context) {
			var cb = allBindingsAccessor().modalExitCallback || null;
			var modalSelectFile = allBindingsAccessor().modalSelectFile || false;
			$(element).on('hidden.bs.modal', function() {
				if(cb){
					cb();
				}
				valueAccessor()(false);
			});
			var cbOpen=allBindingsAccessor().modalOpenCallback || null;
			if(cbOpen || modalSelectFile){
				$(element).on('shown.bs.modal', function() {
					if(cbOpen) cbOpen(element, data, context);
					if( modalSelectFile ){
						setTimeout(function(){
							$(element).find('input[type=file]').trigger('click');
						},50);
					}
				});
			}
			
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			var value = valueAccessor();
			if (valueAccessor()()) {
				$(element).modal('show');
				$('input:enabled:visible:not([readonly]):first', element).focus();
			}
			else {
				$(element).modal('hide');
			}
		}
	};
});
