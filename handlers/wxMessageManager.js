var logger = require('../logger/logger').logger(__filename);

var makeNews = function (context, callback) {
    try {
        var toUser = context.fromusername;
        var fromUser = context.tousername;
        var content = context.content;
        var response = {
            ToUserName: toUser,
            FromUserName: fromUser,
            CreateTime: parseInt((new Date().getTime()) / 1000, 10),
            MsgType: 'news',
            ArticleCount: 2,
            Articles: {
                item: [
                    {
                        Title: content,
                        Description: 'description1',
                    },
                    {
                        Title: 'title2',
                        Description: 'description2'
                    }
                ]
            }
        };
        callback(null, response);
    } catch (err) {
        callback(err);
    }
};

var makeText = function (context, callback) {
    try {
        var toUser = context.fromusername;
        var fromUser = context.tousername;
        var content = context.content;
        var response = {
            ToUserName: toUser,
            FromUserName: fromUser,
            CreateTime: parseInt((new Date().getTime()) / 1000, 10),
            MsgType: 'text',
            Content: content
        };
        callback(null, response);
    } catch (err) {
        callback(err);
    }
};

module.exports = {
    makeNews: makeNews,
    makeText: makeText
}