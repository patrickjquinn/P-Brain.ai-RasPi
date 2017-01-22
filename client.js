var rec = require('node-record-lpcm16');
var record = require('node-record-lpcm16');
var request = require('request');
var say = require('say');
var snowboy = require("snowboy");
var Detector = snowboy.Detector;
var Models = snowboy.Models;
var models = new Models();

var is_recognizing = false;

var witToken = 'UBBQSYVZACKPUKF5J7B3ZHGYDP7H45E3';

exports.parseResult = function(err, resp, body) {
    body = JSON.parse(body);
    var query = body._text;
    var url = "http://localhost:4567/api/ask?q=";

    if (query && query !== "" && !is_recognizing) {
        is_recognizing = true;
        rec.stop();
        try {
            request(url + query, function(err, data) {
                data = JSON.parse(data.body);
                if (!err && data.msg && data.msg !== "") {
                    console.log('P-Brain Says: ' + data.msg);
                    say.speak(data.msg, 'Alex', 1.1, function(error) {
                        if (error) {
                            console.error(err);
                        }
                        is_recognizing = false;
                    });
                } else {
                    is_recognizing = false;
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
};

var start_recognition = function() {
    rec.start().pipe(request.post({
        'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
        'headers': {
            'Accept': 'application/vnd.wit.20160202+json',
            'Authorization': 'Bearer ' + witToken,
            'Content-Type': 'audio/wav'
        }
    }, exports.parseResult));
};

models.add({
    file: './resources/Brain.pmdl',
    sensitivity: '0.5',
    hotwords: 'brain'
});

var d = new Detector({
    resource: "./resources/common.res",
    models: models,
    audioGain: 2.0
});

d.on('hotword', function(index, a, b, c) {
    start_recognition();
});

var r = record.start({
    threshold: 0,
    verbose: false
});

r.pipe(d);