import React, { Component } from 'react';
import CountUp from 'react-countup';
import { createMuiTheme } from '@material-ui/core/styles';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Item from './Seat';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { toMoney, getOffset, amountLen, isFloat, add } from 'library/Helper';
import { t } from 'locales';
import play from 'library/Sound';
import Milf from 'assets/img/milf.png';

import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
const LightTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);



class Position extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.Room = this.props.Room;
        this.state = {
            sit: this.Room.data.player,
            mySit: 0,
            start: 0,
            end: 0,
            hand : [],
            type : null,
            seat: null,
            seatCards: null
        };
        autoBind(this);
    }
    componentDidMount() {       
        this.context.game.register(this.Room, 'win', this.win);
        this.context.game.register(this.Room, 'lose', this.lose);
        this.context.game.register(this.Room, 'mySit', this.mySit);
        this.context.game.register(this.Room, 'winner', this.result);
        this.context.game.register(this.Room, 'reset', this.reset);
        this.context.game.register(this.Room, 'cantStandErr', this.cantStandErr);
        this.context.game.register(this.Room, 'balance', this.balance);
        this.context.game.register(this.Room, 'gameResult', this.gameResult);
    }
    balance(value) {
        const [balance, amount] = value;
        let end = add(balance, amount);
        this.context.state.user.balance = end;
        this.context.update();
        // this.setState({
        //     balance: true,
        //     start: balance,
        //     end: end
        // })
    }
    lose(amount) {
        play('lose');
        // this.alert(t('loseMsg').replace('#', amount))
    }
    win(amount) {
        play('win');
        // this.alert(t('winMsg').replace('#', amount),'success')
    }
    mySit(mySit) {
        this.setState({ mySit })
    }
    cantStandErr() {
        this.alert(t('cantStandErr'))
    }
    alert(message,type='error') {
        window.ee.emit('notify', { message, type })
    }
    reset() {
        this.setState({
            start: 0,
            end: 0,
        })
    }
    gameResult(winer) {
        this.move(winer);
        let c = 0;
        for (let i in winer) {
            ((winer, i)=> {
                setTimeout(()=>{
                    this.setState({
                        hand: winer[i][0],
                        type: winer[i][2],
                        seat: i,
                        seatCards: winer[i][1]
                    })
                }, c*4500);
            })(winer, i);
            c++;
        }
        setTimeout(() => {
            this.setState({
                hand: [],
                type: null,
                seat: null,
                seatCards: null
            })
        }, c * 4000);
    }
    move(winer) {
        let sr = 'bet-value';
        let el = document.querySelector('.' + sr);
        if (el) {
            let spos = getOffset(el);
            el.innerText = '0';
            el.style.display = 'none';
            let c = 0;
            for (let i in winer) {
                let cl = el.cloneNode(true);
                cl.innerText = toMoney(this.props.state.bank / Object.keys(winer).length)
                document.body.appendChild(cl);
                cl.classList.add('moving');
                cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
                (function (cl, sit) {
                    setTimeout(function () {
                        let dl = document.querySelector('.user-' + sit);
                        let dpos = getOffset(dl);
                        cl.classList.add('blur-out-contract-bck');
                        cl.style.left = dpos.left + 'px';
                        cl.style.top = dpos.top + 'px';
                    }, c*5000);
                })(cl, i);
                c++;
            }
        }
    }
    render() {
        let { deck, bank } = this.props.state;
        let decks = deck || [];
        if (decks.length > 0) {
            let size = 5 - decks.length;
            for (let i = 0; i < size; i++)
                decks.push('')
        }
        const { player } = this.Room.data;
        let commission = (Number(this.Room.data.setting.commission) * this.props.state.bank) / 100;
        const { hand,type} = this.state;
        return (
            <div style={styles.root}>
                <div className="pocker-desc">
                    <div className="leather">
                        <div className={"wood p" + player}>
                            <div className="top positions">
                                {[9, 8, 7, 6, 5, 4, 3].includes(player) &&
                                    <Item align="up" Room={this.Room} state={this.props.state} parent={this.state} sit={1} />
                                }
                                <LightTooltip title={t('commission') +': '+commission}>
                                    <img src={Milf} className="milf" style={player==2 ?{ maxWidth:70} : {}} />
                                </LightTooltip>
                                {[9, 8, 7, 6, 5, 4, 3].includes(player) &&
                                    <Item align="up" Room={this.Room} state={this.props.state} parent={this.state} sit={9} />
                                }
                            </div>
                            <div className="left positions">
                                {[9, 8, 7, 6, 5].includes(player) &&
                                    <Item align="left" Room={this.Room} state={this.props.state} parent={this.state} sit={7} />
                                }
                                {[8, 9, 2].includes(player) &&
                                    <Item align="left" Room={this.Room} state={this.props.state} parent={this.state} sit={8} />
                                }
                            </div>
                            <div className="bottom positions">
                                {[9, 8, 7, 6, 4].includes(player) &&
                                    <Item align="down" Room={this.Room} state={this.props.state} parent={this.state} sit={6} />
                                }
                                {[5, 7, 9, 3].includes(player) &&
                                    <Item align="down" Room={this.Room} state={this.props.state} parent={this.state} sit={5} />
                                }
                                {[9, 8, 7, 6, 4].includes(player) &&
                                    <Item align="down" Room={this.Room} state={this.props.state} parent={this.state} sit={4} />
                                }
                            </div>
                            <div className="right positions">
                                {[9, 8, 7, 6, 5].includes(player) &&
                                    <Item align="right" Room={this.Room} state={this.props.state} parent={this.state} sit={2} />
                                }
                                {[8, 9, 2].includes(player) &&
                                    <Item align="right" Room={this.Room} state={this.props.state} parent={this.state} sit={3} />
                                }
                            </div>
                            <div className="board">
                                {bank > 0 &&
                                    <div className="board-line">
                                        <AttachMoney style={styles.money} />
                                        <div className="bet-value">
                                            {bank > 0
                                                ? <CountUp
                                                    start={0}
                                                    end={bank}
                                                    decimals={amountLen(bank)}
                                                    {...(isFloat(bank) ? undefined : { formattingFn: e => toMoney(e) })}
                                                />
                                                : 0
                                            }
                                        </div>
                                    </div>
                                }
                                <div className="board-cards">
                                    {type != null &&
                                        <div className="text">{type.type}</div>
                                    }
                                    <div className="cards">
                                    {
                                        (decks).map((card, i) => {
                                            let cls = '';
                                            if (hand.length > 0) {
                                                cls = hand.includes(card) ? '' :'card-blur'
                                            }
                                            return (
                                                <div key={i} className={"card  _" + card + ' ' + cls + (card == ''? '' :' anim-'+(i+1))}></div>
                                            )
                                        })
                                        }
                                    </div>
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

let theme = createMuiTheme();

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