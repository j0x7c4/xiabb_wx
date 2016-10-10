var mysqlConfig = require('config').mysql;
var execHandler = require('./execHandler');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : mysqlConfig.host,
        user : mysqlConfig.user,
        password : mysqlConfig.password,
        database : 'crawler_xiabb'
    }
});

function KsService() {
    this.client = knex;
}

KsService.prototype.getAllIndexPosts = function(callback) {
    var sql = "SELECT id, "+
        "name, "+
        "creator, "+
        "CONCAT_WS(',', name, content) AS content, "+
        "DATE_FORMAT(add_time,'%Y-%m-%d %T') as add_time, "+
        "category_tag, "+
        "backers_count, "+
        "location, "+
        "pledged, "+
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time "+
        "FROM ks_project";
    this.client.raw(sql).then(function(rows) {
            callback(null, rows[0]);
        })
        .catch(function(err) {
            callback(err);
        });
};

KsService.prototype.getPostsDetail = function (postIdList, callback) {
    var sql = "SELECT id, "+
        "name, "+
        "creator, "+
        "content, "+
        "DATE_FORMAT(add_time,'%Y-%m-%d %T') as add_time, "+
        "category_tag, "+
        "backers_count, "+
        "location, "+
        "pledged, "+
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time "+
        "url, "+
        "remote_url, "+
        "FROM ks_project "+
        "WHERE id IN ("+ postIdList.join(",") + ")";
    this.client.raw(sql).then(function(rows) {
            var posts = rows[0];
            callback(null, posts);
        })
        .catch(function(err) {
            callback(err);
        });
};

module.exports = new KsService();
