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

function PdService() {
    this.client = knex;
}

PdService.prototype.getAllIndexPosts = function(callback) {
    var sql = "SELECT id, "+
        "name, "+
        "en_name, "+
        "brand, "+
        "category, "+
        "CONCAT_WS(',', CONCAT_WS(',', CONCAT_WS(',', name, info), brand), en_name) AS content, "+
        "DATE_FORMAT(add_time,'%Y-%m-%d %T') as add_time, "+
        "price, "+
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time "+
        "FROM xiabb_raw_product";
    this.client.raw(sql).then(function(rows) {
            callback(null, rows[0]);
        })
        .catch(function(err) {
            callback(err);
        });
};

PdService.prototype.getPostsDetail = function (postIdList, callback) {
    var sql = "SELECT id, "+
        "name, "+
        "name AS title, "+
        "brand, "+
        "info AS description, "+
        "info, "+
        "DATE_FORMAT(add_time,'%Y-%m-%d %T') as add_time, "+
        "category, "+
        "price, "+
        "en_name, "+
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time, "+
        "url, "+
        "remote_url "+
        "FROM xiabb_raw_product "+
        "WHERE id IN ("+ postIdList.join(",") + ")";
    this.client.raw(sql).then(function(rows) {
            var posts = rows[0];
            callback(null, posts);
        })
        .catch(function(err) {
            callback(err);
        });
};

module.exports = new PdService();
