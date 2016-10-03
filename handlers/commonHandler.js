var config = require('config');
var logger = require('../logger/logger').logger(__filename);
var parseRsp = function(rsp, callback) {
    var body = '';
    rsp.setEncoding('utf8');
    rsp.on('data', function(d) {
        body += d;
    });
    rsp.on('end', function() {
        var json = "";
        try {
            json = JSON.parse(body);
        } catch (err) {
            logger.error(err, body);
        }
        if (json) {
            callback(null,json);
        } else {
            callback(new Error("fail to parse "+body));
        }
    });
    rsp.on('error', function(e) {
        callback(e);
    });
}
var _post = function(host, port, path, data,next) {
    var options = {
        hostname: host,
        port: port,
        path: path,
        method: 'POST',
        agent: false,
        headers: {
            "Content-Type": "application/json",
            'Content-Length': Buffer.byteLength(data)
        }
    };
    // Set up the request
    var protocal = require('http');
    if (port==443) {
        protocal = require('https');
    }
    var postReq = protocal.request(options, function(rsp){
        parseRsp(rsp, next);
    }).on('error', function(e) {
        logger.error(options.path,e.stack || e);
        next(e);
    });
    postReq.write(JSON.stringify(data));
    postReq.end();
};

var _get = function(host, port, path, next) {
    var options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        agent: false
    };
    var protocal = require('http');
    if (port==443) {
        protocal = require('https');
    }
    var req = protocal.request(options, function(rsp){
            parseRsp(rsp, next);
        })
        .on('error', function(e) {
            logger.error(options.path,e.stack || e);
            next(e);
        });
    req.end();
}

module.exports = {
    post:_post,
    get:_get
};