var request = require('co-request');

var url = "http://localhost:4567/api/ask?q=";

function* get_response(query) {
    query = url + query;
    var data = yield request(query);
    data = JSON.parse(data.body);

    if (data.msg && data.msg !== "") {
        return data;
    } else {
        return null;
    }
}

module.exports = {
    get: get_response
};