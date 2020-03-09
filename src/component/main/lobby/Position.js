import React, { Component } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Item from './Seat';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Milf from 'assets/img/milf.png';

class Position extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    render() {
        const sit = this.props.state.player;
        return (
            <div style={styles.root} class="mini-table">
                <div class="pocker-desc">
                    <div class="leather">
                        <div class="wood">
                            <div class="top positions">
                                <Item align="up" state={this.props.state} sit={1} />
                                <img src={Milf} style={styles.milf} />
                                <Item align="up" state={this.props.state} sit={7} />
                            </div>
                            <div class="left positions">
                                <Item align="left" state={this.props.state} sit={6} />
                            </div>
                            <div class="bottom positions">
                                <Item align="down" state={this.props.state} sit={5} />
                                <Item align="down" state={this.props.state} sit={4} />
                                <Item align="down" state={this.props.state} sit={3} />
                            </div>
                            <div class="right positions">
                                <Item align="right" state={this.props.state} sit={2} />
                            </div>
                            <div class="board">
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
let theme = createMuiTheme()

const styles = {
    root: {
        display: 'flex',
        flex: 1,
        position: 'relative',
        height: '300px',
        width: '100%',
    },
    sides: {
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(15),
    },
    midsides: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
    box: {
        background: 'rgba(0,0,0,.05)',
        margin: 5,
        borderRadius: 10,
        padding: 5,
        minWidth: 70,
        textAlign: 'center',
    },
    text: {
        fontSize: '.7rem',
        color: '#eee',
    },

    icon: {
        color: 'rgb(247, 224, 7)',
        fontSize: 15,
        margin: 4
    },
    milf: {
        marginTop: '-2vw',
        width: '10vw'
    },
    money: {
        color: '#fff',
        background: 'rgb(227, 133, 7)',
        borderRadius: '50%',
        border: '2px solid rgb(242, 242, 13)',
        fontSize: '1.5rem',
        margin: 4
    },
}

export default Position;