var mysqlConfig = require('config').mysql;
var execHandler = require('./execHandler');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : mysqlConfig.host,
        user : mysqlConfig.user,
        password : mysqlConfig.password,
        database : mysqlConfig.database
    }
});

function WpService() {
    this.client = knex;
}

WpService.prototype.getAllIndexPosts = function(callback) {
    var sql = "SELECT po.ID AS post_id, "+
        "max(post_title) as post_title, "+
        "CONCAT_WS(',', max(post_title), max(post_content)) AS post_content, "+
        "DATE_FORMAT(max(post_date),'%Y-%m-%d %T') as post_time, "+
        "max(usr.display_name) AS display_name, "+
        "max(comment_count) AS comment_count, "+
        //"max(guid) AS url, " +
        "group_concat(t.name) AS term_name, "+
        "DATE_FORMAT(max(post_modified),'%Y-%m-%d %T') AS update_time "+
        "FROM wp_posts po "+
        "LEFT OUTER JOIN  wp_users usr ON po.post_author = usr.ID "+
        "LEFT OUTER JOIN wp_term_relationships rel ON po.ID = rel.object_id "+
        "LEFT OUTER JOIN wp_term_taxonomy tax ON rel.term_taxonomy_id = tax.term_taxonomy_id "+
        "LEFT OUTER JOIN wp_terms t ON tax.term_id = t.term_id "+
        "WHERE post_status = 'publish' "+
        "AND post_type = 'post' "+
        "GROUP BY post_id ";
    this.client.raw(sql).then(function(rows) {
            var posts = rows[0];
            for (var i =0 ; i<posts.length ; i++ ) {
                posts[i].post_content = execHandler.parseHtml(posts[i].post_content);
            }
            callback(null, posts);
        })
        .catch(function(err) {
            callback(err);
        });
};

WpService.prototype.getPostsDetail = function (postIdList, callback) {
    var sql = "SELECT po.ID AS post_id, "+
        "max(post_title) as post_title, "+
        "max(post_content) as post_content, "+
        "DATE_FORMAT(max(post_date),'%Y-%m-%d %T') as post_time, "+
        "max(usr.display_name) AS display_name, "+
            //"max(comment_count) AS comment_count, "+
        "max(guid) AS url, " +
        "group_concat(t.name) AS term_name, "+
        "DATE_FORMAT(max(post_modified),'%Y-%m-%d %T') AS update_time "+
        "FROM wp_posts po "+
        "LEFT OUTER JOIN  wp_users usr ON po.post_author = usr.ID "+
        "LEFT OUTER JOIN wp_term_relationships rel ON po.ID = rel.object_id "+
        "LEFT OUTER JOIN wp_term_taxonomy tax ON rel.term_taxonomy_id = tax.term_taxonomy_id "+
        "LEFT OUTER JOIN wp_terms t ON tax.term_id = t.term_id "+
        "WHERE post_status = 'publish' "+
        "AND post_type = 'post' "+
        "AND po.ID in ("+ postIdList.join(" ")+ ") "+
        "GROUP BY post_id ";
    this.client.raw(sql).then(function(rows) {
            var posts = rows[0];
            for (var i =0 ; i<posts.length ; i++ ) {
                posts[i]['pic_url'] = execHandler.getFirstImg(posts[i].post_content);
            }
            callback(null, posts);
        })
        .catch(function(err) {
            callback(err);
        });
};

module.exports = new WpService();