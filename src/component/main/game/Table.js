import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Position from './Position';
import Action from './Action';
import play from 'library/Sound';
import { t } from 'locales';
import './table.css';

class Table extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            loading: true
        };
        this.Room = null;
        this.roomId = this.props.parent.id;
        autoBind(this);
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

    }
    join() {
        this.context.game.getAvailableRooms((rooms) => {
            let roomId = 'poker';
            for (item of rooms) {
                if (!('metadata' in item))
                    continue;
                if (item.metadata.id == this.roomId) {
                    roomId = item.roomId;
                    break;
                }
            }
            this.Room = this.context.game.join(roomId, { create: roomId == 'poker', key: this.context.state.userKey });
        });
    }
    standUp() {
        this.context.game.send({ stand: true });
    }
    leave() {
        this.context.game.leave();
    }
    balanceLimit() {
        let xalert = this.context.app('alert');
        xalert.show({ message: t('balanceLimit'), type: 'error' });
    }
    toggleSound() {
        let act = ('mute' in this.context.state) && this.context.state.mute ? false : true;
        play(!act);
        this.context.setState({ mute: act });
    }
    render() {
        if (this.state.loading)
            return (<div>Loading</div>)
        return (
            <div style={styles.root}>
                <div style={styles.action}>
                    <div>
                        <IconButton onClick={this.leave} color="secondary" >
                            <Close />
                        </IconButton>
                        <IconButton onClick={this.standUp} style={{ color: '#fff' }} >
                            <ArrowUpward />
                        </IconButton>
                        <IconButton onClick={this.toggleSound} style={{ color: '#fff' }}>
                            {('mute' in this.context.state) && this.context.state.mute ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>
                    </div>
                </div>
                <Position />
                <Action />
            </div>
        )
    }
}
const styles = {
    root: {
        display: 'flex',
        flex: 1,
        position: 'relative',
        flexDirection: 'column',
    },
    action: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
    }
}

export default Table;

