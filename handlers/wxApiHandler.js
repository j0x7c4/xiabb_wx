var post = require('./commonHandler').post;
var get = require('./commonHandler').get;
var config = require('config');

function Basic() {
    this.accessToken = '';
    this.expireTime = 0
}

Basic.prototype.realGetAccessToken = function (callback) {
    var path = '/cgi-bin/token?grant_type=client_credential&appid='+config.appId+'&secret='+config.appSecret;
    var that = this;
    get(path, function(err, data) {
        if (err) {
            callback(err);
        } else if (data.errcode) {
            callback(new Error(data.errmsg));
        } else {
            that.accessToken = data['access_token'];
            that.expireTime = data['expires_in'] + parseInt((new Date().getTime())/1000, 10);
            callback(null, that.accessToken);
        }
    });
};

Basic.prototype.getAccessToken = function(callback) {
    if (parseInt((new Date().getTime())/1000, 10)+10>=this.expireTime) {
        this.realGetAccessToken(callback);
    } else {
        callback(null, this.accessToken);
    }
};

Basic.prototype.createMenu = function(callback) {
    this.getAccessToken(function(err, accessToken) {
        if (err) {
            callback(err);
        } else {
            var path = '/cgi-bin/menu/create?access_token=' + accessToken;
            var reqData = config.menu;
            post(reqData, path, function(err, resData) {
                if (err) {
                    callback(err);
                } else if (resData.errcode) {
                    callback(new Error(resData.errmsg));
                } else {
                    callback(null, resData);
                }
            });
        }
    })
};

Basic.prototype.queryMenu = function(callback) {
    this.getAccessToken(function(err, accessToken) {
        if (err) {
            callback(err);
        } else {
            var path = '/cgi-bin/menu/get?access_token=' + accessToken;
            get(path, function(err, resData) {
                if (err) {
                    callback(err);
                } else if (resData.errcode) {
                    callback(new Error(resData.errmsg));
                } else {
                    callback(null, resData);
                }
            });
        }
    });
}

Basic.prototype.getCurrentSelfMenuInfo = function(callback) {
    this.getAccessToken(function(err, accessToken) {
        if (err) {
            callback(err);
        } else {
            var path = '/cgi-bin/get_current_selfmenu_info?access_token=' + accessToken;
            get(path, function(err, resData) {
                if (err) {
                    callback(err);
                } else if (resData.errcode) {
                    callback(new Error(resData.errmsg));
                } else {
                    callback(null, resData);
                }
            });
        }
    });
};

Basic.prototype.deleteMenu = function(callback) {
    this.getAccessToken(function(err, accessToken) {
        if (err) {
            callback(err);
        } else {
            var path = '/cgi-bin/menu/delete?access_token=' + accessToken;
            get(path, function(err, resData) {
                if (err) {
                    callback(err);
                } else if (resData.errcode) {
                    callback(new Error(resData.errmsg));
                } else {
                    callback(null, resData);
                }
            });
        }
    });
};

Basic.prototype.batchGetMaterial = function(data, callback) {
    this.getAccessToken(function(err, accessToken) {
        if (err) {
            callback(err);
        } else {
            var path = '/cgi-bin/material/batchget_material?access_token=' + accessToken;
            post(data, path, function(err, resData) {
                if (err) {
                    callback(err);
                } else if (resData.errcode) {
                    callback(new Error(resData.errmsg));
                } else {
                    callback(resData);
                }
            });
        }
    });
}

module.exports = new Basic();
