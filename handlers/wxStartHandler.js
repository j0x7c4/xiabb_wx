const crypto = require('crypto');
var config = require('config');
var logger = require('../logger/logger').logger(__filename);

WxStartHandler = function(data, callback) {
    if (!data) {
        callback(new Error("no query found"));
    } else {
        var signature = data.signature;
        var timestamp = data.timestamp;
        var nonce = data.nonce;
        var echostr = data.echostr;
        var token = config['token'];
        var code = [token, timestamp, nonce]
        var text = code.sort().join("");
        const hash = crypto.createHash("sha1").update(text).digest('hex');
        logger.info("handle/GET func: hash, signature: ", hash, signature);
        if (hash == signature) {
            callback(null, echostr);
        } else {
            callback(null, hash);
        }
    }
};

module.exports = WxStartHandler;