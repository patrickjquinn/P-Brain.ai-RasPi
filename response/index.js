const speak = require('../speak');
const timer = require('../timer');

function* handle_response(response) {
    let intent = response.type;
    let msg = response.msg;
    let response_funct = speak.vocalize;

    switch (intent) {
        case "time":
            response_funct = speak.vocalize;
            break;
        case "timer":
            response_funct = timer.set;
            break;
        case "weather":
            response_funct = speak.vocalize;
            break;
        case "joke":
            response_funct = speak.vocalize;
            break;
        case "fact":
            response_funct = speak.vocalize;
            break;
        default:
            response_funct = speak.vocalize;
    }

    yield response_funct(msg);
}

module.exports = {
    handle: handle_response
};