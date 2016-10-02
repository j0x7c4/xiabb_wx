var logger = require('../logger/logger').logger(__filename);

var basicApi = require('./wxApiHandler');

var makeWxNews = function (context, callback) {
    basicApi.batchGetMaterial({type:"news", offset:0, count:3}, function(err, resData) {
        if (err) {
            callback(err);
        } else {
            try {
                var toUser = context.fromusername;
                var fromUser = context.tousername;
                var content = context.content;
                var items = [];
                for (var i = 0 ; i<resData.item.length; i++) {
                    var item = resData.item[i];
                    items.add({
                        Title: item.title,
                        Description: item.digest,
                        Url:item.url
                    });
                    items.add(item.content.news_item[0]);
                }
                var response = {
                    ToUserName: toUser,
                    FromUserName: fromUser,
                    CreateTime: parseInt((new Date().getTime()) / 1000, 10),
                    MsgType: 'news',
                    ArticleCount: resData.item_count,
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
        }
    });
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

var makeNews = function(context, callback) {
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
                        Url:'http://blog.xiabb.me/2016/04/14/kie-workbench-and-kie-server/'
                    },
                    {
                        Title: 'title2',
                        Description: 'description2',
                        Url:'http://blog.xiabb.me/2016/04/14/kie-workbench-and-kie-server/'
                    }
                ]
            }
        };
        callback(null, response);
    } catch (err) {
        callback(err);
    }
}

module.exports = {
    makeNews: makeNews,
    makeText: makeText,
    makeWxNews: makeWxNews
}