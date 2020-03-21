import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Position from './Position';
import Action from './Action';
import Hand from './Hand';
import { t } from 'locales';
import Loading from 'component/component/Loading';
import Chat from 'component/chat/Chat';
import IconButton from '@material-ui/core/IconButton';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListIcon from '@material-ui/icons/List';


const StyledDrawer = withStyles({
    root: {
        zIndex: 999999
    },
    paper: {
        backgroundColor: '#181b28',
        padding: 0,
        color: '#fff'
    },
})(props => <Drawer {...props} />);

class Table extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            loading: true,
            players: {},
            history:[],
            deck: [],
            chat: false,
            hand:false
        };
        this.Room = null;
        this.roomId = this.props.parent.id;

        autoBind(this);
        window.ee.on('standUpt' + this.roomId, this.standUp)
        window.ee.on('leavet' + this.roomId, this.leave)
    }
    afterConnect() {
        return {
            welcome: [this.welcome],
            waitStand: [this.waitStand]
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
        setTimeout(() => {
           this.join() 
        }, Math.round(Math.random() * 1000) + 1);
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
    waitStand(type) {
        let { standing } = this.context.state;
        if (type) {
            standing.push(this.roomId)
        }
        else {
            standing = standing.filter(item => item != this.roomId);
            this.context.state.standing = standing;
        }
        this.context.update();
    }
    standUp() {
        this.context.game.send(this.Room, { stand: true });
    }
    leave() {
        this.context.game.leave(this.Room);
    }
    toggleChatDrawer(event) {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ chat: !this.state.chat });
    }
    toggleHandDrawer(event) {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ hand: !this.state.hand });
    }
    render() {
        if (this.state.loading)
            return (<Loading />)
        return (
            <div style={styles.root}>
                {this.context.state.isMobile 
                    ? <div style={styles.fab}>
                        <IconButton onClick={this.toggleChatDrawer} style={styles.xfab} >
                            <ChatBubbleOutlineIcon style={{ color: '#fff' }} />
                        </IconButton>
                        <IconButton onClick={this.toggleHandDrawer} style={styles.xfab} >
                            <ListIcon style={{ color: '#fff' }} />
                        </IconButton>
                        <StyledDrawer anchor={'right'} transitionDuration={300} open={this.state.chat} onClose={this.toggleChatDrawer}>
                            <Chat state={this.state} Room={this.Room} />
                        </StyledDrawer>
                        <StyledDrawer anchor={'right'} transitionDuration={300} open={this.state.hand} onClose={this.toggleHandDrawer}>
                            <Hand state={this.state} Room={this.Room} />
                        </StyledDrawer>
                    </div>
                    :<div style={styles.left}>
                        <Hand state={this.state} Room={this.Room} />
                        <Chat state={this.state} Room={this.Room} />
                    </div>
                }
                <div style={styles.main}>
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
    left: {
        display: 'flex',
        flex: 1,
        position: 'relative',
        flexDirection: 'column',
        flex:.2
    },
    main: {
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
    },
    fab: {
        position: 'fixed',
        bottom: 10,
        left: 10,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    xfab: {
        background: '#201e1e', 
        padding: 8,
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px 2px 2px 1px',
        marginRight: 5,
        marginLeft: 5
    }
}

export default Table;

