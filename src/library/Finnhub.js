class Finnhub {
    constructor() {
        this.socket = "wss://finnhub.io/ws";
        this.isConnect = false;
        this.Listen = [];
    }
    connect(cb) {
        if (window.MozWebSocket) {
            this.writeToScreen('Info', 'This browser supports WebSocket using the MozWebSocket constructor');
            window.WebSocket = window.MozWebSocket;
        }
        else if (!window.WebSocket) {
            this.writeToScreen('ERROR', 'This browser does not have support for WebSocket');
            return;
        }

        this.websocket = new WebSocket(this.socket);
        this.websocket.onopen = (evt) => { this.onOpen(evt); cb(); };
        this.websocket.onclose = (evt) => { this.onClose(evt) };
        this.websocket.onmessage = (evt) => { this.onMessage(evt) };
        this.websocket.onerror = (evt) => { this.onError(evt) };
    }
    register(key, callback) {
        if (this.Listen[key] == null) {
            this.Listen[key] = [];
            this.send(key);
        }
        this.Listen[key].push(callback);
    }
    removeListen(key) {
        this.Listen[key] = null;
    }
    doDisconnect() {
        this.websocket.close()
    }
    onOpen(evt) {
        this.isConnect = true;
    }

    onClose(evt) {
    }

    onMessage(evt) {
        let data = JSON.parse(evt.data);
        if (data.type == 52 && 'price' in data.content) {
            let key = data.content.ticker;
            if (this.Listen[key] != null) {
                for (let cb of this.Listen[key]) {
                    cb(data.content.price);
                }
            }
            else {

            }
        }
    }

    onError(evt) {
        this.writeToScreen(evt.data);
    }

    send(symbol) {
        if (this.isConnect) {
            try {
                this.websocket.send('{"type":50,"ticker":"' + symbol + '"}');
            } catch (error) {

            }

        }
    }

    writeToScreen(message) {
        console.log(message);
    }
}
export default Finnhub;
