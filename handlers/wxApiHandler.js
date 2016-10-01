var post = require('./commonHandler').post;
var get = require('./commonHandler').get;
var config = require('config');

function Basic() {
    this.accessToken = '';
    this.leftTime = 0
}

Basic.prototype.realGetAccessToken = function (callback) {
    var path = '/cgi-bin/token?grant_type=client_credential&appid='+config.appId+'&secret='+config.appSecret;
    var that = this;
    get(path, function(err, data) {
        if (err) {
            callback(err);
        } else {
            that.accessToken = data['access_token'];
            that.leftTime = data['expires_in'];
            callback(null, that.accessToken);
        }
    });
};

Basic.prototype.getAccessToken = function(callback) {
    if (this.leftTime<10) {
        this.realGetAccessToken(callback);
    } else {
        callback(null, this.accessToken);
    }
}
module.exports = {
    Basic: Basic
};
