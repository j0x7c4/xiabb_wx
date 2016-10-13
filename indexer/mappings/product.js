module.exports = {
    properties: {
        id: {type: 'integer'},
        name: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        en_name: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        content: {type: 'string', analyzer:'ik_max_word', search_analyzer: 'ik_max_word'},
        category: {type: 'string'},
        brand: {type: 'string'},
        add_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
        update_time: {type: 'date', format: "yyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"},
    }
}
