var logger = require('../logger/logger').logger(__filename);
var config = require('config');
var basicApi = require('./wxApiHandler');
var wpService = require('./wpService');
var esSearcher = require('./esSearcher');
var ksService = require('./ksService');
var indexNameList = config.es.index;
var indexTypeList = config.es.type;

var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;

MAX_NEWS = 10;

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

var makeResponse = function (context, rows) {
    var posts = [{
        Title:'"'+context.content+'"的搜索结果',
        Description: '共搜索到'+rows.length+'篇文章'
    }];
    for (var i=0 ; i<rows.length && posts.length<MAX_NEWS; i++) {
        var post = rows[i];
        posts.push({
            Title: post['title'],
            Description: post['description'],
            Url: post['url'],
            PicUrl: post['pic_url']
        });
    }
    var response = {
        ToUserName: context.fromusername,
        FromUserName: context.tousername,
        CreateTime: parseInt((new Date().getTime()) / 1000, 10),
        MsgType: 'news',
        ArticleCount: posts.length,
        Articles: {
            item: posts
        }
    };
    return response;
}

var doSearch = function (indexName, searchField, context, callback) {
    var query = {};
    query['match'] = {};
    query['match'][searchField] = context.content;
    esSearcher.search({
        index: indexName,
        query: query
    }, function(err, res) {
        var postIds = [];
        if (err) {
            logger.error(err);
            callback(err);
        } else {
            for (var i = 0; i < res.hits.hits.length && postIds.length<MAX_NEWS; i++) {
                var record = res.hits.hits[i];
                postIds.push(record['_id']);
            }
            callback(null, postIds);
        }
    });
}
var makeNews = function(context, callback) {
    var errResponse = {
        ToUserName: context.fromusername,
        FromUserName: context.tousername,
        CreateTime: parseInt((new Date().getTime()) / 1000, 10),
        MsgType: 'news',
        ArticleCount: 1,
        Articles: {
            item: [{
                Title: '"' + context.content + '"的搜索结果',
                Description: '哎呀,瞎BB队长开小差去了!'
            }]
        }
    };
    var emptyResponse = {
        ToUserName: context.fromusername,
        FromUserName: context.tousername,
        CreateTime: parseInt((new Date().getTime()) / 1000, 10),
        MsgType: 'news',
        ArticleCount: 1,
        Articles: {
            item: [{
                Title: '"' + context.content + '"的搜索结果',
                Description: '啊,没有搜索到文章!'
            }]
        }
    };
    sequence
        .then(function (next) {
            searchResult = {}
            next(null, searchResult);
        })
        .then(function (next, err, searchResult) {
            doSearch(indexNameList[0], "post_content", context, function (err, postIds) {
                searchResult[indexTypeList[0]] = postIds;
                //logger.info(JSON.stringify(searchResult));
                next(err, searchResult);
            });
        })
        .then(function (next, err, searchResult) {
            doSearch(indexNameList[1], "content", context, function (err, postIds) {
                searchResult[indexTypeList[1]] = postIds;
                //logger.info(JSON.stringify(searchResult));
                next(err, searchResult);
            });
        })
        .then(function (next, err, searchResult) {
            if (err) {
                callback(null, errResponse);
            } else if (searchResult && searchResult[indexTypeList[0]] && searchResult[indexTypeList[0]].length > 0) {
                var postIds = searchResult[indexTypeList[0]];
                wpService.getPostsDetail(postIds, function (err, rows) {
                    if (err) {
                        logger.error(err);
                        callback(null, errResponse);
                    } else {
                        callback(null, makeResponse(context, rows));
                    }
                });
            } else if (searchResult && searchResult[indexTypeList[1]] && searchResult[indexTypeList[1]].length > 0) {
                var postIds = searchResult[indexTypeList[1]];
                ksService.getPostsDetail(postIds, function (err, rows) {
                    if (err) {
                        logger.error(err);
                        callback(null, errResponse);
                    } else {
                        callback(null, makeResponse(context, rows));
                    }
                });
            } else {
                callback(null, emptyResponse);
            }
            next();
        });
}

module.exports = {
    makeNews: makeNews,
    makeText: makeText,
    makeWxNews: makeWxNews
}
