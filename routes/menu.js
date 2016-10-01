var express = require('express');
var router = express.Router();
var xmlparser = require('express-xml-bodyparser');
var o2x = require('object-to-xml');

router.get('/delete', function(req, res, next){
    req.basicApi.deleteMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/create', function(req, res, next){
    req.basicApi.createMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/query', function(req, res, next){
    req.basicApi.queryMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/show', function(req, res, next) {
    req.basicApi.getCurrentSelfMenuInfo(function(err, resData) {
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

module.exports = router;