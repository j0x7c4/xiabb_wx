var express = require('express');
var router = express.Router();
var wxMessageReplyHandler = require('../handlers/wxMessageReplyHandler.js');
var xmlparser = require('express-xml-bodyparser');
var o2x = require('object-to-xml');

router.post('/reply', xmlparser({trim: true, explicitArray: false}), function(req, res, next){
    wxMessageReplyHandler(req.body, function(err, response) {
        if (err) {
            next(err);
        }
        res.set('Content-Type', 'text/xml');
        //response['?xml version="1.0" encoding="utf-8"?'] = null;
        var xml_response = "<xml>"+o2x(response)+"</xml>";
        res.send(xml_response);
    });
});

module.exports = router;
