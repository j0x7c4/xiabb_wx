var PdService = require('../handlers/pdService');
var elasticsearch = require('elasticsearch');
var config = require('config').es;

function PdIndexer () {
    this.BULK_SIZE = config.bulkSize;
    this.lastIndexName = '';
    this.lastUpdateTime = new Date();
    this.mappings = require('./mappings/product');
    this.client = new elasticsearch.Client({
        host: config.host+":"+config.port,
        log: {
            type: 'file',
            level: 'trace',
            path: config.log
        }
    });
};

var baseIndexName = "product";
var indexType = "product";

PdIndexer.prototype.createIncIndex = function(callback) {

};

PdIndexer.prototype.createAllIndex = function(callback) {
    var that = this;
    PdService.getAllIndexPosts(function(err, posts) {
        if (err) {
            callback(err);
        } else {
            try {
                var updateTime = new Date();
                var indexName = baseIndexName + "_" + parseInt(updateTime.getTime()/1000,10);
                that.client.indices.create({index: indexName}, function (err, data, status) {
                    if (err) {
                        callback(err);
                    } else {
                        var body = {}
                        body[indexType] = that.mappings;
                        that.client.indices.putMapping({
                            index: indexName,
                            type: indexType,
                            body: body
                        }, function(err, data, status) {
                            if (err) {
                                callback(err);
                            } else {
                                var actions = [];
                                for (var i=0 ; i<posts.length; i++) {
                                    var post = posts[i];
                                    actions.push({index: {_index: indexName, _type: indexType, _id: post.id}});
                                    actions.push(post);
                                }
                                that.client.bulk({
                                    body: actions
                                }, function (err, resp) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        that.client.indices.deleteAlias({
                                            index: baseIndexName + "_*",
                                            name: baseIndexName
                                        }, function(err, data, status) {
                                            that.client.indices.putAlias({
                                                index:indexName,
                                                name: baseIndexName
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

module.exports = new PdIndexer();
