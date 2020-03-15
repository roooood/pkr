import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Position from './Position';
import Action from './Action';
import { t } from 'locales';
import Loading from 'component/component/Loading';
import Chat from 'component/chat/Chat';

class Table extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            loading: true,
            players: {},
        };
        this.Room = null;
        this.roomId = this.props.parent.id;
        autoBind(this);
        window.ee.on('standUpt' + this.roomId, this.standUp)
        window.ee.on('leavet' + this.roomId, this.leave)
    }
    afterConnect() {
        return {
            welcome: [this.welcome]
        }
    }
    componentDidMount() {
        this.context.game.on('connect', this.connected);
        this.context.game.on('disconnect', this.disconnected);
        if (this.context.game.isConnect) {
            this.join()
        }
    }
    connected() {
        this.join()
    }
    disconnected() {
        this.setState({ loading:true})
    }
    join() {
        this.context.game.getAvailableRooms((rooms) => {
            let roomId = 'poker';
            for (let item of rooms) {
                if (!('metadata' in item) || typeof item.metadata == 'undefined')
                    continue;
                if (item.metadata.id == this.roomId) {
                    roomId = item.roomId;
                    break;
                }
            }
            this.Room =
                this.context.game.join(
                    roomId,
                    { create: roomId == 'poker', ...this.props.parent, key: this.context.state.userKey },
                    this.afterConnect()
                );
        });
    }
    welcome(data) {
        this.Room.data = data;
        this.setState({ loading: false })
        this.context.game.onState(this.Room, (state) => {
            this.setState(state);
        });
    }

    standUp() {
        this.context.game.send(this.Room, { stand: true });
    }
    leave() {
        this.context.game.leave(this.Room);
    }

    render() {
        if (this.state.loading)
            return (<Loading />)
        return (
            <div style={styles.root}>
                {!this.context.state.isMobile &&
                    <div style={styles.main}>
                        <Chat state={this.state} Room={this.Room} />
                    </div>
                }
                <div style={this.context.state.isMobile ? styles.mmain : styles.main}>
                    <Position state={this.state} Room={this.Room} />
                    <Action state={this.state} Room={this.Room} />
                </div>
            </div>
        )
    }
}
const styles = {
    root: {
        display: 'flex',
        flex: 1,
        position: 'relative',
    },
    main: {
        display: 'flex',
        flex: 1,
        position: 'relative',
        flexDirection: 'column',
    },
    mmain: {
        display: 'flex',
        flex: 1,
        position: 'relative',
    },
    action: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
    }
}

export default Table;

