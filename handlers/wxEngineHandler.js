var logger = require('../logger/logger').logger(__filename);
var wxTextHandler = require('./wxTextHandler');
var wxLocationHandler = require('./wxLocationHandler');


WxEngineHandler = function(data, callback) {
    if (!data || !data.xml) {
        callback(new Error("no data found"));
    } else if (data.xml.msgtype == "text") {
        var xml = data.xml;
        wxTextHandler(xml, function(err, response) {
            if (err) {
                callback(err);
            } else {
                callback(null, response);
            }
        });
    } else if (data.xml.msgtype == "event") {
        var xml = data.xml;
        var eventType = xml.event;
        if (eventType == "Location") {

        }
    } else if (data.xml.msgtype == "location") {
        var xml = data.xml;
        wxLocationHandler(xml, function(err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        });
    }
};

module.exports = WxEngineHandler;