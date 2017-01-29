const player_sync = require('play-sound')(opts = {})
const speak = require('../speak')

function get_time_remaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date())
    const seconds = Math.floor((t / 1000) % 60)
    const minutes = Math.floor((t / 1000 / 60) % 60)
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    const days = Math.floor(t / (1000 * 60 * 60 * 24))
    return {
        total: t,
        days,
        hours,
        minutes,
        seconds
    }
}

function * initialize_clock(time) {
    const deadline = new Date(Date.parse(new Date()) + time * 1000)
    const timeinterval = setInterval(update_clock, 1000)

    function update_clock() {
        const t = get_time_remaining(deadline)
        if (t.total <= 0) {
            clearInterval(timeinterval)
            player_sync.play('timer.wav', err => {
                if (err) {
                    throw err
                }
                speak.vocalize_sync('Hey there! Your timer is finished!')
            })
        }
    }

    update_clock()
}

function * set_timer(timer) {
    timer = timer.replace(':timer:', '').toUpperCase()

    let countdown
    let time
    let message

    if (timer.indexOf('DAY') !== -1) {
        time = timer.toUpperCase().split('DAY')[0].trim()
        countdown = parseInt(time, 10) * 86400
        message = time + ' Days'
    } else if (timer.indexOf('HOUR') !== -1) {
        time = timer.split('HOUR')[0].trim()
        countdown = parseInt(time, 10) * 3600
        message = time + ' Hours'
    } else if (timer.indexOf('MINUTE') !== -1) {
        time = timer.split('MINUTE')[0].trim()
        countdown = parseInt(time, 10) * 60
        message = time + ' Minutes'
    } else {
        time = timer.split('SECOND')[0].trim()
        countdown = parseInt(time, 10)
        message = time + ' Seconds'
    }

    yield initialize_clock(countdown)
    yield speak.vocalize('Okay, timer set for ' + message)
}

module.exports = {
    set: set_timer
}
