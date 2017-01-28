const rec = require('node-record-lpcm16'),
    record = require('node-record-lpcm16'),
    request = require('request'),
    snowboy = require("snowboy"),
    thunkify = require('thunkify-wrap'),
    co = require('co'),
    q = require('q'),
    stdin = process.openStdin();


const Detector = snowboy.Detector,
    Models = snowboy.Models,
    models = new Models();

const api = require('./api'),
    response_handler = require('./response'),
    speak = require('./speak');

var is_recognizing = false;
const witToken = 'UBBQSYVZACKPUKF5J7B3ZHGYDP7H45E3';

models.add({
    file: './resources/Brain.pmdl',
    sensitivity: '0.5',
    hotwords: 'brain'
});

const detector = new Detector({
    resource: "./resources/common.res",
    models: models,
    audioGain: 1.0
});

const hotword = thunkify.event(detector, 'hotword');

const hotword_recorder = record.start({
    threshold: 0,
    verbose: false
});

function* parseResult(body) {
    console.log(body);
    try {
        body = JSON.parse(body[0].body);
        let query = body._text;
        if (query && query !== "" && !is_recognizing) {
            is_recognizing = true;
            let response = yield api.get(query);
            yield response_handler.handle(response);
            is_recognizing = false;
        }
    } catch (e) {
        console.log(e);
        speak.vocalize("Ooops, I didn't get that", 'Alex', 1.1);
    }
}

function generatorify(fn, context) {
    return function() {
        let deferred = q.defer(),
            callback = make_callback(deferred),
            args = Array.prototype.slice.call(arguments).concat(callback);
        fn.apply(context, args);
        return deferred.promise;
    };
}

function make_callback(deferred) {
    return function(err) {
        if (err) {
            deferred.reject(err);
        } else if (arguments.length < 2) {
            deferred.resolve();
        } else if (arguments.length === 2) {
            deferred.resolve(arguments[1]);
        } else {
            deferred.resolve(Array.prototype.slice.call(arguments, 1));
        }
    };
}

function recognizer(callback) {
    rec.start({
        encoding: 'LINEAR16'
    }).pipe(request.post({
      'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&v=20160526',
      'headers' : {
        'Accept'        : 'application/vnd.wit.20160526+json',
        'Authorization' : 'Bearer ' + witToken,
        'Content-Type'  : 'audio/wav',
        'Transfer-encoding' : 'chunked'
      }
    }, callback));
}

function* start_recognition() {
    console.log('recognizing');
    var gen_recognizer = generatorify(recognizer);
    var recognized = yield gen_recognizer();

    yield parseResult(recognized);

    rec.stop();
}

function* start_hotword_detection() {
    try {
        yield hotword();
        yield speak.vocalize_affirm();
        yield start_recognition();
        yield start_hotword_detection();
    } catch (e){
        console.log(e);
        throw e;
    }
    
}

function console_input(query) {
    return co(function*() {
        query = query.toString().trim();
        var response = yield api.get(query);
        yield response_handler.handle(response);
    }).catch(function(err) {
        console.log(err);
        throw err;
    });
}

stdin.addListener("data",console_input);

hotword_recorder.pipe(detector);

co(function*() {
    console.log("P-Brain Says: Say 'Hey Brain','Brain' or 'Okay Brain' followed by your command!");
    console.log("P-Brain Says: You can also type your command into the terminal!");
    yield start_hotword_detection();
}).catch(function(err) {
    console.log(err);
    throw err;
});