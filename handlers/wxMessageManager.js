var logger = require('../logger/logger').logger(__filename);

var basicApi = require('./wxApiHandler');
var wpService = require('./wpService');
var esSearcher = require('./esSearcher');
var ksService = require('./ksService');
var indexName = "blog_xiabb_post";

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
    esSearcher.search({
        index:indexName,
        query: {
            match : {
                post_content : context.content,
            }
        }}, function(err, res) {
        var postIds = [];
        if (err) {
            logger.error(err);
        } else {
            for (var i = 0 ; i<res.hits.hits.length; i++) {
                var record = res.hits.hits[i];
                postIds.push(record['_id']);
            }
        }

        var toUser = context.fromusername;
        var fromUser = context.tousername;

        var errResponse = {
            ToUserName: toUser,
            FromUserName: fromUser,
            CreateTime: parseInt((new Date().getTime()) / 1000, 10),
            MsgType: 'news',
            ArticleCount: 1,
            Articles: {
                item: [{
                    Title:'"'+context.content+'"的搜索结果',
                    Description: '哎呀,瞎BB队长开小差去了!'
                }]
            }
        };

        if (postIds.length > 0) {
            wpService.getPostsDetail(postIds, function(err, rows) {
                if (err) {
                    logger.error(err);
                    callback(null, errResponse);
                } else {
                    try {
                        var posts = [{
                            Title:'"'+context.content+'"的搜索结果',
                            Description: '共搜索到'+rows.length+'篇文章'
                        }];
                        for (var i=0 ; i<rows.length; i++) {
                            var post = rows[i];
                            posts.push({
                                Title: post['post_title'],
                                Description: post['display_name'],
                                Url: post['url'],
                                PicUrl: post['pic_url']
                            });
                        }
                        var response = {
                            ToUserName: toUser,
                            FromUserName: fromUser,
                            CreateTime: parseInt((new Date().getTime()) / 1000, 10),
                            MsgType: 'news',
                            ArticleCount: posts.length,
                            Articles: {
                                item: posts
                            }
                        };
                        callback(null, response);
                    } catch (err) {
                        callback(null, errResponse);
                    }
                }
            });
        } else {
            esSearcher.search({
                index:'ks_project',
                query: {
                    match : {
                        content : context.content,
                    }
                }}, function(err, res) {
                    var postIds = [];
                    if (err) {
                        logger.error(err);
                    } else {
                        for (var i = 0 ; i<res.hits.hits.length; i++) {
                            var record = res.hits.hits[i];
                            postIds.push(record['_id']);
                        }
                    }
                    if (postIds.length>0) {
                        ksService.getPostsDetail(postIds, function(err, rows) {
                            if (err) {
                                logger.error(err);
                                callback(null, errResponse);
                            } else {
                                try {
                                    var posts = [{
				        Title: '"' + context.content + '"的搜素结过',
                                        Description: '推荐相关的'+rows.length+'篇文章'
                                    }];
                                    for (var i=0 ; i<rows.length; i++) {
                                        var post = rows[i];
                                        posts.push({
                                            Title: post['name'],
                                            Description: post['location'],
                                            Url: post['url']
                                        });
                                    }
                                    var response = {
                                        ToUserName: toUser,
                                        FromUserName: fromUser,
                                        CreateTime: parseInt((new Date().getTime()) / 1000, 10),
                                        MsgType: 'news',
                                        ArticleCount: posts.length,
                                        Articles: {
                                            item: posts
                                        }
                                    };
                                    callback(null , response);
                                } catch (err) {
                                    callback(null, errResponse);
                                }
                            }
                      });
                    } else {

                        var posts = [{
                            Title:'"'+context.content+'"的搜索结果',
                            Description: '啊,没有搜索到文章!'
                        }];
                        var response = {
                                ToUserName: toUser,
                                FromUserName: fromUser,
                                CreateTime: parseInt((new Date().getTime()) / 1000, 10),
                                MsgType: 'news',
                                ArticleCount: posts.length,
                                Articles: {
                                    item: posts
                                }
                        };
                        callback(null, response);
                   }
         });
     }
  });
}

module.exports = {
    makeNews: makeNews,
    makeText: makeText,
    makeWxNews: makeWxNews
}
