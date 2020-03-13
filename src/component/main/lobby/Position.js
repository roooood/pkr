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
        let { player } = this.props.state;
        return (
            <div style={styles.root} className="mini-table">
                <div className="pocker-desc">
                    <div className="leather">
                        <div className={"wood p" + player}>
                            <div className="top positions">
                                {[9, 8, 7, 6, 5, 4, 3].includes(player) &&
                                    <Item align="up" state={this.props.state} sit={1} />
                                }
                                {[9, 8, 7, 6, 5, 4, 3].includes(player) &&
                                    <Item align="up" state={this.props.state} sit={9} />
                                }
                            </div>
                            <div className="left positions">
                                {[9, 8, 7, 6, 5].includes(player) &&
                                    <Item align="left" state={this.props.state} sit={7} />
                                }
                                {[8, 9, 2].includes(player) &&
                                    <Item align="left" state={this.props.state} sit={8} />
                                }
                            </div>
                            <div className="bottom positions">
                                {[9, 8, 7, 6, 4].includes(player) &&
                                    <Item align="down" state={this.props.state} sit={6} />
                                }
                                {[5, 7, 9, 3].includes(player) &&
                                    <Item align="down" state={this.props.state} sit={5} />
                                }
                                {[9, 8, 7, 6, 4].includes(player) &&
                                    <Item align="down" state={this.props.state} sit={4} />
                                }
                            </div>
                            <div className="right positions">
                                {[9, 8, 7, 6, 5].includes(player) &&
                                    <Item align="right" state={this.props.state} sit={2} />
                                }
                                {[8, 9, 2].includes(player) &&
                                    <Item align="right" state={this.props.state} sit={3} />
                                }
                            </div>
                            <div className="board">
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