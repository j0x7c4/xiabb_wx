var mysqlConfig = require('config').mysql;

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

WpService.prototype.getIncIndexPosts = function(last_update_time, callback) {
    var sql = "SELECT po.ID AS post_id, "+
        "max(post_title) as post_title, "+
        "max(post_content) as post_content, "+
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
            callback(null, rows[0]);
        })
        .catch(function(err) {
            callback(err);
        });
};

WpService.prototype.getAllIndexPosts = function(callback) {
    var sql = "SELECT po.ID AS post_id, "+
        "max(post_title) as post_title, "+
        "max(post_content) as post_content, "+
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
            callback(null, rows[0]);
        })
        .catch(function(err) {
            callback(err);
        });
};

WpService.prototype.getPostsDetail = function (postIdList, callback) {
    var sql = "SELECT po.ID AS post_id, "+
        "max(post_title) as post_title, "+
            //"max(post_content) as post_content, "+
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
        "GROUP BY post_id ";
    this.client.raw(sql).then(function(rows) {
            callback(null, rows[0]);
        })
        .catch(function(err) {
            callback(err);
        });
};

module.exports = new WpService();