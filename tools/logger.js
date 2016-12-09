var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "file",
            filename: 'logs/BaiduLocation.log',
            maxLogSize: 20480,
            backups: 3,
            category: [ 'BaiduLocation','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('BaiduLocation');
logger.setLevel('INFO');

module.exports = logger;