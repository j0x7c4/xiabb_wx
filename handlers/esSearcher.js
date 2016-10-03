var elasticsearch = require('elasticsearch');
var config = require('config').es;

function EsSearcher () {
    this.client = new elasticsearch.Client({
        host: config.host+":"+config.port,
        log: 'trace'
    });
};

EsSearcher.prototype.search = function(request, callback) {

};


module.exports = new EsSearcher();



