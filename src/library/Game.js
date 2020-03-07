import * as Colyseus from "colyseus.js";
import { serverUrl } from './Helper';

class Game {
    constructor(type) {
        this.Socket = serverUrl;
        this.Client = null;
        this.isConnect = false;
        this.Listen = [];
        this.type = type;
        this.error = this.error.bind(this)
    }
    error(err) {
        if (typeof err == 'string') {
            // if (err.indexOf('join invalid room') > 0) {
            //     if (this.Listen != 'undefined' && this.Listen['failedJoin'] != 'undefined');
            //     this.Listen['failedJoin'][0]();
            // }
        }
    }
    connect(open, error = null) {
        this.Client = new Colyseus.Client(this.Socket);
        this.Client.onError.add((err) => {
            console.log(err);
            if (error)
                error();
            this.error(err)

        });
        this.Client.onClose.add(() => {
            this.isConnect = false;
            if (this.Listen['disconnect'] != null) {
                for (let cb of this.Listen['disconnect']) {
                    cb();
                }
            }
        });
        this.Client.onOpen.add(() => {
            this.isConnect = true;
            open();
            if (this.Listen['connect'] != null) {
                for (let cb of this.Listen['connect']) {
                    cb();
                }
            }
        });
    }
    close() {
        this.Client.close();
    }
    leave(Room) {
        if ('inRoom' in Room && Room.inRoom == true)
            Room.leave();
    }
    getAvailableRooms(callback, type = this.type) {
        if (this.isConnect) {
            this.Client.getAvailableRooms(type, (rooms, err) => {
                callback(rooms);
            });
        }

    }
    onState(Room, callback) {
        Room.onStateChange.add((state) => {
            callback(state);
        });
    }
    send(Room, data) {
        if (Room != null)
            Room.send(data);
    }
    register(Room, key, callback, listen) {
        if (Room.Listen[key] == null) {
            Room.Listen[key] = [];
        }
        Room.Listen[key].push(callback);

        if (listen == true) {
            Room.listen(key, (state) => {
                callback(state.value, state);
            });
        }
    }
    on(key, callback) {
        if (this.Listen[key] == null) {
            this.Listen[key] = [];
        }
        this.Listen[key].push(callback);
    }
    listen(Room, key, callback) {
        Room.listen(key, (state) => {
            callback(state);
        });
    }

    join(roomId, option) {
        let Room = this.Client.join(roomId, option);
        this.addListner(Room);
        Room.Listen = [];
        return Room;
    }
    addListner(Room) {
        Room.onJoin.add(() => {
            Room.inRoom = true;
        });
        Room.onLeave.add(() => {
            Room.inRoom = false;
            if (Room.Listen['leave'] != null) {
                for (let cb of Room.Listen['leave']) {
                    cb();
                }
            }
        });
        Room.onMessage.add((data) => {
            let key = Object.keys(data)[0];
            if (Room.Listen[key] != null) {
                for (let cb of Room.Listen[key]) {
                    cb(data[key]);
                }
            }
            else {

            }

        });
    }
}
export default Game;