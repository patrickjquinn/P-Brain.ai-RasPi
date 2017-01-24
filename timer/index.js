var speak = require('../speak');
var player_sync = require('play-sound')(opts = {})



function get_time_remaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function* initialize_clock(time) {

    var deadline = new Date(Date.parse(new Date()) + time * 1000);

    function update_clock() {
        var t = get_time_remaining(deadline);

        if (t.total <= 0) {
            clearInterval(timeinterval);
            player_sync.play('timer.wav', function(err){
                if (err) throw err;
                speak.vocalize_sync('Hey there! Your timer is finished!');
            });
        }
    }

    update_clock();
    var timeinterval = setInterval(update_clock, 1000);
}


function* set_timer(timer) {
    timer = timer.replace(':timer:', '');

    var countdown, time, message;

    if (timer.indexOf('DAY') != -1) {
        time = timer.toUpperCase().split('DAY')[0].trim();
        countdown = parseInt(time) * 86400;

        message = time + " Days";
    } else if (timer.indexOf('HOUR') != -1) {
        time = timer.toUpperCase().split('HOUR')[0].trim();
        countdown = parseInt(time) * 3600;
        message = time + " Hours";
    } else if (timer.toUpperCase().indexOf('MINUTE') != -1) {
        time = timer.toUpperCase().split('MINUTE')[0].trim();
        countdown = parseInt(time) * 60;
        message = time + " Minutes";
    } else {
        time = timer.toUpperCase().split('SECOND')[0].trim();
        countdown = parseInt(time);

        message = time + " Seconds";
    }

    yield initialize_clock(countdown);

    yield speak.vocalize('Okay, timer set for ' + message);
}

module.exports = {
    set: set_timer
};