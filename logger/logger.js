var log4js = require('log4js');
var config = require('config');
log4js.configure({
    appenders:[
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'access'
        }
    ]
    ,replaceConsole:true
});

log4js.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};

module.exports = log4js;