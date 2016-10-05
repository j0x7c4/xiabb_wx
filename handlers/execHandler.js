var config = require('config').exe;
const spawnSync = require('child_process').spawnSync;

var getFirstImg = function(html) {
    var exec = spawnSync(config.python,[config.firstimg, html]);
    return exec.stdout.toString('utf8');
};

var parseHtml = function (html) {
    var exec = spawnSync(config.python,[config.htmlparser, html]);
    return exec.stdout.toString('utf8');
}

module.exports = {
    getFirstImg: getFirstImg,
    parseHtml: parseHtml
}