import * as videojs from 'video.js'

var myPlayer = videojs('some-player-id');

myPlayer.on('ended', function () {
    this.dispose();
});

