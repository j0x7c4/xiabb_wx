var logger = require('../logger/logger').logger(__filename);

WxMessageReplyHandler = function(data, callback) {
    if (!data || !data.xml) {
        callback(new Error("no data found"));
    } else if (data.xml.msgtype != "text") {
        callback(new Error("wrong msgType"));
    } else {
        var xml = data.xml;
        var toUser = xml.fromusername;
        var fromUser = xml.tousername;
        var content = "test";
        var response = {
            ToUserName: toUser,
            FromUserName: fromUser,
            CreateTime:  parseInt((new Date().getTime())/1000, 10),
            MsgType: 'text',
            Content: content
        };
        callback(null, response);
    }
};

module.exports = WxMessageReplyHandler;