var express = require('express');
var router = express.Router();
var wxStartHandler = require('../handlers/wxStartHandler.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/start', function(req, res, next){
    wxStartHandler(req.query, function(err, data) {
        if (err) {
            next(err);
        }
        res.send(data);
    });
});

router.get('/health', function(req, res){
   res.send("alive");
});

module.exports = router;
