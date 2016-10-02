var logger = require('../logger/logger').logger(__filename);
var wxMessageManager = require('./wxMessageManager');

WxTextHandler = function (data, callback) {
    wxMessageManager.makeNews(data, callback);
}

module.exports = WxTextHandler;