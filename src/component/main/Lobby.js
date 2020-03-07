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
                <Scrollbars style={{ direction: 'ltr', height: '82vh' }} ref="scroll">
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
                <div container style={styles.bottom}>
                    <div style={styles.space}>
                        <Typography style={styles.text} display="inline">{t('tableCount')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.state.rooms.length}</Typography>
                    </div>
                    <div style={styles.space}>
                        <Typography style={styles.text} display="inline">{t('users')} :</Typography>
                        <Typography style={styles.xtext} display="inline">{this.context.state.onlines || 0}</Typography>
                    </div>
                </div>
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
    },
    bottom: {
        display: 'flex',
        background: 'rgb(17, 17, 17)',
        marginTop: 10,
        borderRadius: 5,
        padding: 10
    },
    space: {
        flex: 1
    },
    text: {
        fontSize: '.9rem'
    },
    xtext: {
        color: 'rgb(116, 219, 110)',
        marginRight: 10,
        marginLeft: 10
    }
}
export default connect(state => state)(ListTable);