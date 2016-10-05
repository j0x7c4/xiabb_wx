var wpService = require('../handlers/wpService');
var elasticsearch = require('elasticsearch');
var config = require('config').es;
var execHandler = require('../handlers/execHandler');

function PostIndexer () {
    this.BULK_SIZE = config.bulkSize;
    this.lastIndexName = '';
    this.lastUpdateTime = new Date();
    this.mappings = require('./mappings/post');
    this.client = new elasticsearch.Client({
        host: config.host+":"+config.port,
        log: {
            type: 'file',
            level: 'trace',
            path: config.log
        }
    });
};

PostIndexer.prototype.createIncIndex = function(callback) {

};

PostIndexer.prototype.createAllIndex = function(callback) {
    var that = this;
    wpService.getAllIndexPosts(function(err, posts) {
        if (err) {
            callback(err);
        } else {
            try {
                var updateTime = new Date();
                var indexName = config.index + "_" + parseInt(updateTime.getTime()/1000,10);
                that.client.indices.create({index: indexName}, function (err, data, status) {
                    if (err) {
                        callback(err);
                    } else {
                        that.client.indices.putMapping({
                            index: indexName,
                            type: config.type,
                            body: {
                                'post': that.mappings
                            }
                        }, function(err, data, status) {
                            if (err) {
                                callback(err);
                            } else {
                                var actions = [];
                                for (var i=0 ; i<posts.length; i++) {
                                    var post = posts[i];
                                    post.post_content = execHandler.parseHtml(post.post_content);
                                    actions.push({index: {_index: indexName, _type: config.type, _id: post.post_id}});
                                    actions.push(post);
                                }
                                that.client.bulk({
                                    body: actions
                                }, function (err, resp) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        that.client.indices.deleteAlias({
                                            index: config.index+"_*",
                                            name: config.index
                                        }, function(err, data, status) {
                                            that.client.indices.putAlias({
                                                index:indexName,
                                                name: config.index
                                            }, function(err, data, status) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    that.lastIndexName = indexName;
                                                    that.lastUpdateTime = updateTime;
                                                    callback(status);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            } catch (err) {
                callback(err);
            }
        }
    });
}

module.exports = new PostIndexer();



