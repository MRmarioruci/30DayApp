define(['knockout'],function(ko){
	ko.extenders.charCount = function(target, option) {
        target.val = target;
        target.currCount = ko.observable(target.length);
        target.maxCount = option.maxCount;
        target.onLimit = ko.observable(false);
        target.val.subscribe(function(newVal){
            if(newVal){
                if(newVal.length <= target.maxCount){
                    target.currCount(newVal.length);
                    target.onLimit(false);
                }else{
                    target(newVal.substring(0, target.maxCount));
                    target.onLimit(true);
                }
            }
        })
		return target;
	};
});
