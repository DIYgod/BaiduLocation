var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 BaiduLocation start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/', require('./routes/get'));
app.listen(1209);