var express = require('express');
var router = express.Router();
var wxStartHandler = require('../handlers/wxStartHandler.js');
var wxEngineHandler = require('../handlers/wxEngineHandler.js');
var xmlparser = require('express-xml-bodyparser');
var o2x = require('object-to-xml');
var postIndexer = require('../indexer/postIndexer');
var ksIndexer = require('../indexer/ksIndexer');

router.get('/', function(req, res, next){
    wxStartHandler(req.query, function(err, response) {
        if (err) {
            next(err);
        }
        res.send(response);
    });
});

router.post('/', xmlparser({trim: true, explicitArray: false}), function(req, res, next){
    wxEngineHandler(req.body, function(err, response) {
        if (err) {
            next(err);
        } else {
            res.set('Content-Type', 'text/xml');
            //response['?xml version="1.0" encoding="utf-8"?'] = null;
            var xml_response = "<xml>" + o2x(response) + "</xml>";
            res.send(xml_response);
        }
    });
});

router.get('/health', function(req, res){
    res.send("alive");
});

router.get('/indexer/post', function(req, res, next) {
    postIndexer.createAllIndex(function(err, data) {
        if (err) {
            next(err);
        } else {
            res.send(data);
        }
    });
});

router.get('/indexer/ksproject', function(req, res, next) {
    ksIndexer.createAllIndex(function(err, data) {
        if (err) {
            next(err);
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
