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
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time "+
        "FROM xiabb_product";
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
        "a.brand, "+
        "info AS description, "+
        "info, "+
        "DATE_FORMAT(add_time,'%Y-%m-%d %T') as add_time, "+
        "category, "+
        "en_name, "+
        "DATE_FORMAT(update_time,'%Y-%m-%d %T') AS update_time, "+
        "a.url AS url, "+
        "remote_url, "+
        "b.url AS pic_url "+
        "FROM xiabb_product a JOIN (SELECT brand, max(url) as url FROM xiabb_product_img WHERE type = 2 GROUP BY brand)b on (a.brand = b.brand)"+
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
