var express = require('express');
var router = express.Router();
var xmlparser = require('express-xml-bodyparser');
var o2x = require('object-to-xml');
var basicApi = require('../handlers/wxApiHandler');

router.get('/delete', function(req, res, next){
    basicApi.deleteMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/create', function(req, res, next){
    basicApi.createMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/query', function(req, res, next){
    basicApi.queryMenu(function(err, resData){
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

router.get('/show', function(req, res, next) {
    basicApi.getCurrentSelfMenuInfo(function(err, resData) {
        if (err) {
            next(err);
        } else {
            res.send(resData);
        }
    });
});

module.exports = router;