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
        height: '100%'
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
    { id: 'id', label: t('id') },
    { id: 'myCards', label: t('myCards') },
    { id: 'board', label: t('board') },
    { id: 'pot', label: t('pot') },
];

class ListTable extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
        autoBind(this);
    }

    componentDidMount() {
        
    }

    render() {
        const { list } = this.state;
        return (
            <div style={styles.root} >
                <Scrollbars style={{ direction: 'ltr', height : '45vh', overflow: 'hidden' }} ref="scroll" className="scrollbar">
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
                            {list.map((row, i) => {
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
            </div>
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        height: '100%',
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