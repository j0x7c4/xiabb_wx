var logger = require('../logger/logger').logger(__filename);

WxTextHandler = function (data, callback) {
    try {
        var toUser = data.fromusername;
        var fromUser = data.tousername;
        var content = data.content;
        var response = {
            ToUserName: toUser,
            FromUserName: fromUser,
            CreateTime: parseInt((new Date().getTime()) / 1000, 10),
            MsgType: 'text',
            Content: content
        };
        callback(null, response);
    } catch (err) {
        callback(new Error(err.message));
    }
}

module.exports = WxTextHandler;