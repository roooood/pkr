import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import play from 'library/Sound';



const StyledTableCell = withStyles(theme => ({
    head: {
        fontSize: 12,
        backgroundColor: '#1c1a29',
        color: '#fff',
        border: 0,
        padding: 12
    },
    body: {
        fontSize: 11,
        border: 0,
        color: '#888',
        padding: 10,
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
    // { id: 'myCards', label: t('myCards') },
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
            <div className="chat_window" >
                <Scrollbars style={{ direction: 'ltr', height : '44vh', overflow: 'hidden' }} ref="scroll" className="scrollbar">
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
                                        tabIndex={-1}
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