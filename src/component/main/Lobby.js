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
import Visibility from '@material-ui/icons/Visibility';
import { connect } from 'react-redux';
import { TabbarAdd } from 'redux/action/tab';

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#2c3e62',
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
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    {
        id: 'player',
        label: 'Player',
    },
    {
        id: 'min',
        label: 'Min Bet',
        format: value => <div style={styles.center}><ArrowRight style={{ color: 'rgb(219, 110, 110)' }} />{toMoney(value)}</div>,
    },
    {
        id: 'max',
        label: 'Max Bet',
        format: value => <div style={styles.center}><ArrowLeft style={{ color: 'rgb(116, 219, 110)' }} />{toMoney(value)} </div>,
    },

];

class ListTable extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        };
        autoBind(this);
        this.timer = null;
        this.inGame = false;
        this.getedList = false;
    }
    componentDidMount() {
        this.context.game.register('leave', this.leave);
        this.context.game.register('welcome', this.welcome);
        this.context.game.register('connect', this.connected);

        request('tableList', rooms => {
            this.setState({ rooms: [...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms, ...rooms] })
        });
    }
    connected() {
        this.getList()
        this.timer = setInterval(() => {
            this.getList()
        }, 5000);
    }
    welcome() {
        this.inGame = true;
        setTimeout(() => {
            this.getList();
        }, 500);
    }
    leave() {
        this.inGame = false;
        this.refresh();
    }
    refresh() {
        this.getList();
    }
    getList() {
        this.context.game.getAvailableRooms((rooms) => {
            this.getedList = true;
            this.setState({ rooms })
        });
    }
    have(arr, prop, id) {
        let i;
        for (i in arr) {
            if (typeof arr[i].metadata == 'object' && arr[i].metadata[prop] == id)
                return true;
        }
        return false
    }
    create() {
        let xalert = this.context.app('alert');
        if (!this.getedList) {
            xalert.show({ message: t('pleaseWait'), type: 'warning' });
        }
        else if (!('id' in this.context.state)) {
            xalert.show({ message: t('guestLimit'), type: 'warning' });
        }
        else if (this.have(this.state.rooms, 'ownerId', this.context.state.id)) {
            xalert.show({ message: t('cantCreate'), type: 'error' });
        }
        else if (this.inGame) {
            xalert.show({ message: t('inGameLimit'), type: 'error' });
        }
        else if (this.state.rooms.length >= this.context.state.setting.tableLimit) {
            xalert.show({ message: t('tableCreateLimit'), type: 'error' });
        }
        else if (this.context.state.balance < this.context.state.setting.minbet) {
            xalert.show({ message: t('balanceLimit'), type: 'error' });
        }
        else {
            this.modal.show();
        }

    }
    join(id) {
        if (this.inGame) {
            let xalert = this.context.app('alert');
            xalert.show({ message: t('inGameLimit'), type: 'error' });
        }
        else {
            const key = this.context.state.userKey;
            this.context.game.join(id, { key });
        }

    }
    addTab({ id, name, type }) {
        this.props.dispatch(TabbarAdd({
            key: 't' + id,
            value: {
                id,
                name,
                type,
            }
        }));
    }
    render() {
        return (
            <div style={styles.root} >
                {/* <Grid container>
                    <Grid container xs={6} justify="center" alignItems="center"  >
                        <Typography style={styles.text} display="inline">{t('tableCount')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.state.rooms.length}</Typography>
                    </Grid>
                    <Grid container xs={6} justify="center" alignItems="center">
                        <Typography style={styles.text} display="inline">{t('users')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.context.state.onlines}</Typography>
                    </Grid>
                </Grid> */}
                <Scrollbars style={{ direction: 'ltr', height: '100%' }} ref="scroll">
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
                            {this.state.rooms.map(row => {
                                return (
                                    <StyledTableRow hover onClick={() => this.addTab(row)} tabIndex={-1} key={row.id}>
                                        {columns.map(column => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {/* <Scrollbars style={{ direction: 'ltr', height: '100%' }} ref="scroll">
                        <List style={{ direction: this.context.state.dir }}>
                            {this.state.rooms.map((room, i) => {
                                let { name, player, min, max, ready } = room;
                                return (
                                    <ListItem key={i} style={styles.item}>
                                        <ListItemAvatar style={styles.avatarItem}>
                                            <Avatar style={styles.avatar}>
                                                A
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText style={styles.listItem} primary={
                                            <>
                                                <Typography style={styles.itemText} >{name}</Typography>
                                                <Typography style={styles.subText} >owner</Typography>
                                            </>
                                        } />
                                        <ListItemText style={styles.listItem} primary={
                                            <div style={{ display: 'flex' }}>
                                                <PeopleOutline style={styles.icon} />
                                                <Typography style={styles.itemText} >{player}/{ready}</Typography>
                                                <Stop style={{ ...styles.icon, color: ready != player ? green[500] : pink[500], transform: 'rotate(45deg)' }} />
                                            </div>
                                        } />
                                        <ListItemText style={styles.listItem} primary={
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <ArrowRight style={{ color: 'rgb(219, 110, 110)' }} />
                                                    <Typography style={styles.subText} >{toMoney(min)}</Typography>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <ArrowLeft style={{ color: 'rgb(116, 219, 110)' }} />
                                                    <Typography style={styles.subText} >{toMoney(max)}</Typography>
                                                </div>
                                            </>
                                        } />
                                        <ListItemText style={{ justifyContent: 'flex-end', display: 'flex' }} primary={
                                            ready != player
                                                ? < Button onClick={() => this.join(room.roomId)} style={{ ...styles.btn, ...styles.start }} >
                                                    {t('start')}
                                                </Button>
                                                : < Button onClick={() => this.join(room.roomId)} style={{ ...styles.btn, ...styles.view }} >
                                                    <Visibility style={styles.viewIcon} />
                                                </Button>
                                        } />
                                    </ListItem>
                                )
                            })
                            }
                        </List>
                    </Scrollbars>
                 */}
                </Scrollbars>
            </div >
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        height: '98%',
        flexDirection: 'column',
        padding: 20
    },
    table: {
        borderRadius: 5,
        overflow: 'hidden'
    },
    center: {
        display: 'flex',
        alignItems: 'center',
    }
}
export default connect(state => state)(ListTable);