var logger = require('../logger/logger').logger('query');
var wxMessageManager = require('./wxMessageManager');

WxTextHandler = function (reqData, callback) {
    wxMessageManager.makeNews(reqData, function(err, resData) {
        if (err) {
            callback(err);
        } else if (resData ) {
            logger.info({req:reqData, res:resData});
            callback(null, resData);
        } else {
            wxMessageManager.makeText(reqData, function(err, resData){
                if (err) {
                    callback(err);
                } else {
                    logger.info({req:reqData, res:resData});
                    callback(null, resData);
                }
            });
        }
    });
}

module.exports = WxTextHandler;