import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { toMoney } from 'library/Helper';
import { t } from 'locales';
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import request from 'library/Fetch';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import { connect } from 'react-redux';
import { TabbarAdd } from 'redux/action/tab';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Position from './Position';
import Loading from 'component/component/Loading';
import play from 'library/Sound';

const StyledCard = withStyles(theme => ({
    root: {
        backgroundColor: 'rgba(0,0,0,.3)',
        width: '100%',
        height: '97%'
    },
}))(Card);

const StyledCardHeader = withStyles(theme => ({
    root: {
        color: '#dbb316',
        textAlign: 'center',
        backgroundColor: '#2c3762',
    },
    title: {
        fontSize: '1.1rem',
    },
    subheader: {
        color: '#999',
    }
}))(CardHeader);

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#2c3762',
        color: '#fff',
        border: 0,
        padding: 15
    },
    body: {
        fontSize: 14,
        border: 0,
        color: '#888',
        padding: 12,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        border: 0,
        cursor: 'pointer',
        '&:nth-of-type(even)': {
            backgroundColor: 'rgba(0,0,0,.3)',
        },
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,.5)!important',
        },
    },
}))(TableRow);


const columns = [
    { id: 'name', label: t('name') },
    { id: 'type', label: t('type') },
    { id: 'player', label: t('player') },
    {
        id: 'ready',
        label: t('ready'),
        format: value => value == null ? 0 : value,
    },
    {
        id: 'min',
        label: t('min'),
        format: value => <div style={styles.center}><ArrowRight style={{ color: 'rgb(219, 110, 110)' }} />{toMoney(value)}</div>,
    },
    {
        id: 'max',
        label: t('max'),
        format: value => <div style={styles.center}><ArrowLeft style={{ color: 'rgb(116, 219, 110)' }} />{toMoney(value)} </div>,
    },


];

class ListTable extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            active: 0,
            table: {},
            onlines: 0,
            loading: true
        };
        autoBind(this);
        this.timer = null;
        this.Room = {};
    }
    componentDidMount() {
        this.getTableList();
        // this.context.game.join('xxx', { create: true }); 
    }
    getTableList() {
        request('tableList', rooms => {
            if (rooms.length > 0) {
                this.connectToGame()
                this.setState({ rooms })
            }
        });
    }
    connectToGame() {
        if (!this.context.game.isConnect) {
            this.context.game.connect(
                () => {
                    this.conected();
                },
                () => setTimeout(() => { this.connectToGame() }, 5000)
            );
        }
    }
    refresh() {
        this.getList();
    }
    conected() {
        this.getList();
        this.timer = setInterval(() => {
            this.getList();
        }, 5000);

        setTimeout(() => {
            this.setState({ loading: false })
        }, 200);
    }
    getList() {
        this.context.game.getAvailableRooms((rooms) => {
            let onlines = 0;
            for (let room of this.state.rooms) {
                room.live = false;
                room.ready = 0;
                room.clients = 0;
                room.roomId = '';
                room.users = {};
            }
            for (let item of rooms) {
                if (!('metadata' in item) || typeof item.metadata == 'undefined')
                    continue;
                let id = item.metadata.id;
                for (let room of this.state.rooms) {
                    onlines += item.clients || 0;
                    if (room.id == id) {
                        room.ready = item.metadata.ready;
                        room.clients = item.clients;
                        room.users = item.metadata.users;
                        room.live = true;
                        room.roomId = item.roomId;
                        break;
                    }
                }
            }
            this.setState({ onlines })
        });
    }

    join(id) {
        if (this.inGame) {
            let xalert = this.context.app('alert');
            xalert.show({ message: t('inGameLimit'), type: 'error' });
        }
        else {
            const key = this.context.state.userKey || '';
            this.context.game.join(id, { key });
        }

    }
    addTab({ id, name, type }) {
        play('click')
        this.props.dispatch(TabbarAdd({
            key: 't' + id,
            value: { id, name, type, }
        }));
    }
    setActive(active) {
        play('click')
        this.setState({ active })
    }
    render() {
        const { rooms, active } = this.state;
        if (this.state.loading)
            return (<Loading />)
        return (
            <div style={{ ...styles.root, padding: this.context.state.isMobile ? 5 : 20 }} >
                <div style={styles.lobby} className="lobby">
                    <Scrollbars style={{ direction: 'ltr', height: this.context.state.isMobile ? '100vh' : '82vh', overflow: 'hidden' }} ref="scroll" className="scrollbar">
                        <Table stickyHeader style={styles.table}>
                            <TableHead>
                                <StyledTableRow>
                                    {columns.map(column => (
                                        <StyledTableCell
                                            key={column.id}
                                            // align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((row, i) => {
                                    return (
                                        <StyledTableRow
                                            hover
                                            onDoubleClick={() => this.addTab(row)}
                                            onClick={() => this.setActive(i)}
                                            tabIndex={-1}
                                            style={row.id == rooms[active].id ? styles.active : {}}
                                            key={row.id}>
                                            {columns.map(column => {
                                                const value = row[column.id] || null;
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {column.format ? column.format(value) : value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Scrollbars>
                    <div style={styles.bottom}>
                        <div style={styles.space}>
                            <Typography style={styles.text} display="inline">{t('tableCount')} :</Typography>
                            <Typography style={styles.xtext} display="inline">{this.state.rooms.length}</Typography>
                        </div>
                        <div style={styles.space}>
                            <Typography style={styles.text} display="inline">{t('onlineUsers')} :</Typography>
                            <Typography style={styles.xtext} display="inline">{this.state.onlines}</Typography>
                        </div>
                    </div>
                </div>
                <div className="preview">
                    <StyledCard >
                        <StyledCardHeader
                            title={rooms[active].name}
                        // subheader={active.type}
                        />
                        <CardContent style={styles.prew}>
                            <Position state={rooms[active]} />
                        </CardContent>
                        <CardActions disableSpacing>

                        </CardActions>

                    </StyledCard>
                </div >
            </div >
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
    },
    lobby: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    prew: {
        paddingTop: '25%'
    },
    table: {
        borderRadius: 5,
        overflow: 'hidden',
    },
    center: {
        display: 'flex',
        alignItems: 'center',
    },
    bottom: {
        display: 'flex',
        background: 'rgba(0,0,0,.3)',
        marginTop: 10,
        borderRadius: 5,
        padding: 10
    },
    space: {
        flex: 1
    },
    text: {
        fontSize: '.85rem'
    },
    xtext: {
        color: '#dbb316',
        marginRight: 10,
        marginLeft: 10
    },
    active: {
        background: 'rgba(50, 98, 60, 0.18)'
    }
}
export default connect(state => state)(ListTable);