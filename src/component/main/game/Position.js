import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AccountBalance from '@material-ui/icons/AccountBalance';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Item from './Seat';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { toMoney, getOffset, amountLen, isFloat, add } from 'library/Helper';
import { t } from 'locales';

import play from 'library/Sound';
import Milf from 'assets/img/milf.png';

class Position extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
            sit: context.state.table.player,
            mySit: 0,
            start: 0,
            end: 0,
        };
        autoBind(this);
    }
    componentDidMount() {
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('actionResult', this.actionResult);
        this.context.game.register('gameResult', this.result);
        this.context.game.register('reset', this.reset);

    }
    mySit(mySit) {
        this.setState({ mySit })
    }
    company() {
        setTimeout(() => {
            play('company')
            this.setState({
                start: this.state.end,
                end: add(this.state.end, this.context.state.bet),
            })
        }, 900);
    }
    actionResult() {

    }
    reset() {
        this.state.start = 0;
        this.state.end = 0;
        // this.setState({
        //     start: 0,
        //     end: 0,
        // })
    }
    gameResult(res) {
        let winer = res.win;
        let sr = 'bet-value';
        let el = document.querySelector('.' + sr);
        if (el) {
            let spos = getOffset(el);
            el.innerText = '0';
            for (let i of winer) {
                let cl = el.cloneNode(true);
                cl.innerText = toMoney(this.state.end / winer.length)
                document.body.appendChild(cl);
                cl.classList.add('moving');
                cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
                (function (cl, sit) {
                    setTimeout(function () {
                        let dl = document.querySelector('.sit' + sit);
                        let dpos = getOffset(dl);
                        cl.classList.add('blur-out-contract-bck');
                        cl.style.left = dpos.left + 'px';
                        cl.style.top = dpos.top + 'px';
                    }, 100);
                })(cl, i);
            }
        }
    }
    render() {
        const { sit, mySit } = this.state;
        return (
            <div style={styles.root}>
                <div class="pocker-desc">
                    <div class="leather">
                        <div class="wood">
                            <div class="top positions">
                                <Item align="up" sit={1} />
                                <img src={Milf} style={styles.milf} />
                                <Item align="up" sit={7} />
                            </div>
                            <div class="left positions">
                                <Item align="left" sit={6} />
                            </div>
                            <div class="bottom positions">
                                <Item align="down" sit={5} />
                                <Item align="down" sit={4} />
                                <Item align="down" sit={3} />
                            </div>
                            <div class="right positions">
                                <Item align="right" sit={2} />
                            </div>
                            <div class="board">
                                <div class="board-line">
                                    <AttachMoney style={styles.money} />
                                    <div class="bet-value">1,000</div>
                                </div>
                                <div class="board-cards">
                                    <div class="card anim _2h"></div>
                                    <div class="card anim _2c"></div>
                                    <div class="card anim _Ah"></div>
                                    <div class="card"></div>
                                    <div class="card"></div>
                                </div>
                                <div></div>
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