module.exports = {
    properties: {
        post_id: {type: 'integer'},
        post_title: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        post_content: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        term_name: {type: 'string'},
        display_name: {type: 'string'},
        comment_count: {type: 'integer'},
        post_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
        update_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
    }
}