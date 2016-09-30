var express = require('express');
var router = express.Router();
var wxMessageReplyHandler = require('../handlers/wxMessageReplyHandler.js');

router.post('/reply', function(req, res, next){
    wxMessageReplyHandler(req.query, function(err, data) {
        if (err) {
            next(err);
        }
        res.send(data);
    });
});

module.exports = router;
