module.exports = {
    properties: {
        post_id: {type: 'integer'},
        post_title: {type: 'string'},
        post_content: {type: 'string'},
        term_name: {type: 'string'},
        display_name: {type: 'string', index:'not_analyzed'},
        comment_count: {type: 'integer'},
        post_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
        update_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
    }
}