const Sound = {
    click: new Audio(require('assets/sound/click.mp3')),
    win: new Audio(require('assets/sound/win.mp3')),
    lose: new Audio(require('assets/sound/lose.mp3')),
    message: new Audio(require('assets/sound/message.mp3')),
    turn: new Audio(require('assets/sound/turn.mp3')),
    raise: new Audio(require('assets/sound/raise.mp3')),
    check: new Audio(require('assets/sound/check.mp3')),
    call: new Audio(require('assets/sound/call.mp3')),
    allin: new Audio(require('assets/sound/allin.mp3')),
    fold: new Audio(require('assets/sound/fold.mp3')),
}
let Vulume = true;
export default function play(key) {
    if (typeof key == "boolean") {
        Vulume = key;
    }
    else if (Vulume) {
        try {
            // Sound[key].play();
            const playedPromise = Sound[key].play();
            if (playedPromise) {
                playedPromise.catch((e) => {
                    if (e.name === 'NotAllowedError' ||
                        e.name === 'NotSupportedError') {
                        //console.log(e.name);
                    }
                });
            }
        } catch (error) {

        }
    }
}