var say = require('say');
var say_sync = require('say');
var genify = require('thunkify-wrap').genify;

say.speak = genify(say.speak);

function* speak_msg(msg) {
    console.log('P-Brain Says: ' + msg);
    yield say.speak(msg, null, '1.1');
    return;
}

function* speak_affirmation() {
    console.log("P-Brain Says: I'm Listening?");
    return;
}

function speak_msg_sync(msg) {
    console.log('P-Brain Says: ' + msg);
    say_sync.speak(msg, null, '1.1');
}

module.exports = {
    vocalize: speak_msg,
    vocalize_sync: speak_msg_sync,
    vocalize_affirm: speak_affirmation
};