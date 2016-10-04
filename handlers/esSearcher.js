var elasticsearch = require('elasticsearch');
var config = require('config').es;

function EsSearcher () {
    this.client = new elasticsearch.Client({
        host: config.host+":"+config.port,
        log: {
            type: 'file',
            level: 'trace',
            path: config.log
        }
    });
};

EsSearcher.prototype.search = function(request, callback) {
    this.client.search({
        index: request.index,
        body: {
            query: request.query
        }
    }, function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};


module.exports = new EsSearcher();



