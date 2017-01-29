const request = require('co-request')

const url = 'http://localhost:4567/api/ask?q='

function * get_response(query) {
    query = url + query
    let data = yield request(query)
    data = JSON.parse(data.body)

    if (data.msg && data.msg !== '') {
        return data
    }
    return null
}

module.exports = {
    get: get_response
}
