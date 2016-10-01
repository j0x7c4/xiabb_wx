var express = require('express');
var router = express.Router();
var Basic = require('../handlers/wxApiHandler').Basic;
var WxMenuHandler = require('../handlers/wxMenuHandler').WxMenuHandler;
var xmlparser = require('express-xml-bodyparser');
var o2x = require('object-to-xml');

router.get('/delete', function(req, res, next){
    (new Basic()).getAccessToken(function(err, accessToken) {
        if (err) {
            next(err);
        } else {
            (new WxMenuHandler()).delete(accessToken, function(err, resData){
                if (err) {
                    next(err);
                } else {
                    res.send(resData);
                }
            });
        }
    });
});

router.get('/create', function(req, res, next){
    (new Basic()).getAccessToken(function(err, accessToken) {
        if (err) {
            next(err);
        } else {
            (new WxMenuHandler()).create(accessToken, function(err, resData){
                if (err) {
                    next(err);
                } else {
                    res.send(resData);
                }
            });
        }
    });
});

router.get('/query', function(req, res, next){
    (new Basic()).getAccessToken(function(err, accessToken) {
        if (err) {
            next(err);
        } else {
            (new WxMenuHandler()).query(accessToken, function(err, resData){
                if (err) {
                    next(err);
                } else {
                    res.send(resData);
                }
            });
        }
    });
});

router.get('/show', function(req, res, next) {
    (new Basic()).getAccessToken(function(err, accessToken) {
        if (err) {
            next(err);
        } else {
            (new WxMenuHandler()).getCurrentSelfMenuInfo(accessToken, function(err, resData){
                if (err) {
                    next(err);
                } else {
                    res.send(resData);
                }
            });
        }
    });
});

module.exports = router;