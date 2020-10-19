var logger = exports;
const colors = require('colors');

logger.debugLevel = 'warn';
logger.log = function(level, message) {
	var levels = ['info', 'warn', 'error'];
	if (levels.indexOf(level) <= levels.indexOf(logger.debugLevel) ) {
		if (typeof message !== 'string') {
			message = JSON.stringify(message);
		};
		if(level == 'info'){
			level = colors.bold.blue(level);
		}else if(level == 'error'){
			level = colors.bold.red(level);
		}else{
			level = colors.bold.yellow(level);
		}
		console.log(level, ': '+message);
	}
}