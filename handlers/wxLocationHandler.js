var logger = require('../logger/logger').logger('query');
var wxMessageManager = require('./wxMessageManager');

WxLocationHandler = function (context, callback) {
    var toUser = context.fromusername;
    var fromUser = context.tousername;
    var locationX = context.location_x;
    var locationY = context.location_y;
    var scale = context.scale;
    var label = context.label;
    var posts = [{
        Title: "地理位置",
        Description: "lat:"+locationX+",lng:"+locationY + ",scale:"+scale+ ",label:"+label
    }];
    var res = {
        ToUserName: toUser,
        FromUserName: fromUser,
        CreateTime: parseInt((new Date().getTime()) / 1000, 10),
        MsgType: 'news',
        ArticleCount: posts.length,
        Articles: {
            item: posts
        }
    };
    callback(null, res);
}

module.exports = WxLocationHandler;