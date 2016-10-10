module.exports = {
    properties: {
        name: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        creator: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        content: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        backers_count: {type: 'integer'},
        category_tag: {type: 'string'},
        pledged: {type: 'string'},
        location: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        add_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
        update_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
    }
}
