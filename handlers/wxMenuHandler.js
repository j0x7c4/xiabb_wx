var post = require('./commonHandler').post;
var get = require('./commonHandler').get;
var config = require('config');

function WxMenuHandler () {

};

WxMenuHandler.prototype.create = function(accessToken, callback) {
    var path = '/cgi-bin/menu/create?access_token=' + accessToken;
    var reqData = config.menu;
    post(reqData, path, function(err, resData) {
        if (err) {
            callback(err);
        } else {
            callback(null, resData);
        }
    });
};

WxMenuHandler.prototype.query = function(accessToken, callback) {
    var path = '/cgi-bin/menu/get?access_token=' + accessToken;
    get(path, function(err, resData) {
        if (err) {
            callback(err);
        } else {
            callback(null, resData);
        }
    });
};

WxMenuHandler.prototype.delete = function(accessToken, callback) {
    var path = '/cgi-bin/menu/delete?access_token=' + accessToken;
    get(path, function(err, resData) {
        if (err) {
            callback(err);
        } else {
            callback(null, resData);
        }
    });

};


WxMenuHandler.prototype.getCurrentSelfMenuInfo = function(accessToken, callback) {
    var path = '/cgi-bin/get_current_selfmenu_info?access_token=' + accessToken;
    get(path, function(err, resData) {
        if (err) {
            callback(err);
        } else {
            callback(null, resData);
        }

    });
}

module.exports = {
    WxMenuHandler: WxMenuHandler
} ;