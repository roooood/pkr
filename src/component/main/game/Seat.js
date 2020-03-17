
import React, { Component } from 'react';
import Context from 'library/Context';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import autoBind from 'react-autobind';
import PersonAdd from '@material-ui/icons/PersonAdd';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Timer from './Timer';
import { t } from 'locales';
import play from 'library/Sound';
// import CountUp from 'react-countup';
import { toMoney, getOffset, amountLen, isFloat, add } from 'library/Helper';
import avatars from 'library/Avatar';
import chip from 'assets/img/chip.png';

class Item extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.Room = this.props.Room;
        this.state = {
            cards: ['3c', 'Kd'],
            cardType: 'front',
            mySit: 0,
            timer: false,
            winner: [],
            loser: []
        };
        this.cdir = {
            back: {
                c2: {
                    right: { top: -50 },
                    up: { left: -60 },
                    down: { right: -70},
                    left: { bottom: -44 }
                },
                c4: {
                    right: { top: -55 },
                    up: { left: -125 },
                    down: { right: -125 },
                    left: { bottom: -42 }
                }
           }
        ,front: {
                c2: {
                    right: { top: -50 },
                    up: { left: -90 },
                    down: { right: -90 },
                    left: { bottom: -65 }
                },
                c4: {
                    right: { top: -75 },
                    up: { left: -165 },
                    down: { right: -165 },
                    left: { bottom: -70 }
                }
           }
        }
        this.adir = {
            right: { left: -80 },
            up: { bottom: -55 },
            down: { top: -55 },
            left: { right: -80 }
        }
        this.dir = {
            left: 'row',
            up: 'column',
            down: 'column-reverse',
            right: 'row-reverse'
        }
        this.timer = null;
        autoBind(this);
    }
    reset() {
        clearTimeout(this.timer);
        this.setState({
            timer: false,
            winner: [],
            loser: [],
            cards: []
        });
    }
    componentDidMount() {
        this.context.game.register(this.Room, 'mySit', this.mySit);
        this.context.game.register(this.Room, 'myCards', this.myCards);
        this.context.game.register(this.Room, 'takeAction', this.takeAction);
        this.context.game.register(this.Room, 'newLevel', this.newLevel);
        this.context.game.register(this.Room, 'gameResult', this.gameResult);
        this.context.game.register(this.Room, 'reset', this.reset);
        this.context.game.register(this.Room, 'guest', this.guest);
        this.context.game.register(this.Room, 'actionIs', this.actionIs);
    }

    actionIs([sit, type]) {
        if (sit == this.props.sit) {
            if (type == 'fold')
                this.reset();
                this.move(sit)
        }
    }
    guest() {
        window.ee.emit('notify', { message: t('needLogin'), type: 'error' })
    }
    mySit(mySit) {
        if (this.props.sit == mySit) {
            this.setState({
                mySit,
                timer: false,
            })
        }
    }
    myCards(cards) {
        if (this.state.mySit == this.props.sit)
            this.setState({ cards ,cardType:'front' })
        else
            this.setState({ cards: new Array(cards.length).fill('back'), cardType: 'back'})
    }
    newLevel(level) {
        this.hideTimer();
        clearTimeout(this.timer);
    }
    takeAction(sit) {
        this.hideTimer();
        clearTimeout(this.timer);
        if (this.props.sit == sit) {
            this.showTimer();
        }
    }
    gameResult(res) {
        let winner = res.win;
        let loser = res.lose;
        this.setState({ winner, loser });
        setTimeout(() => {
            this.setState({ winner: [], loser: [] });
        }, 4900)
    }
    showTimer() {
        this.setState({ timer: true });
    }
    hideTimer() {
        this.setState({ timer: false });
    }
    move(sit) {
        let sr = 'sit-' + sit;
        let ds = 'bet-value';
        let el = document.querySelector('.' + sr);
        let dl = document.querySelector('.' + ds);
        if (dl && el) {
            dl = dl.parentElement
            let spos = getOffset(el);
            let dpos = getOffset(dl);
            console.log(dpos)
            let cl = el.cloneNode(true);
            document.body.appendChild(cl);
            cl.classList.remove(sr);
            cl.classList.add('moving');
            cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
            setTimeout(() => {
                cl.classList.add('blur-out-contract-bck');
                cl.style.left = dpos.left + 200 + 'px';
                cl.style.top = dpos.top +5 + 'px';
            }, 100);
        }
    }
    sit() {
        play('click');
        this.context.game.send(this.Room, { sit: this.props.sit })
    }
    render() {
        const { align, sit } = this.props;
        const { winner, loser, cards, mySit } = this.state;
        const { players, turn, started } = this.props.state;

        if (players != undefined) {
            if (sit in players) {
                return (
                    <Grid className={"scale-in-center " + players[sit].state} style={styles.info} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                        <div style={styles.xinfo}>
                            {'type' in players[sit] &&
                                <Box style={styles.type} display="flex" alignItems="center" className="focus-in-expand">
                                <Typography variant="body"  >{players[sit].type}</Typography>
                                </Box>
                            }
                            <Typography variant="body2" className="focus-in-expand" style={styles.name}>{players[sit].name}</Typography>
                            <Box style={styles.balance} display="flex" alignItems="center" className="focus-in-expand">
                                <AttachMoney style={styles.moneyIcon} />
                                <Typography variant="body2" >{toMoney(players[sit].balance)}</Typography>
                            </Box>
                        </div>
                        <div style={styles.dAvatar} className={winner.includes(sit) ? "pulsate-fwd" : ""}>
                            <div style={styles.cinfo}>
                                {this.state.timer &&
                                    <Timer border time={this.Room.data.setting.timer} big={mySit == sit} />
                                }
                                <Avatar
                                    src={avatars[players[sit].avatar || null]}
                                    className={started ? (turn == sit ? "avatar active" : "avatar") : (mySit == sit ? "avatar active" : "avatar")}
                                    style={{ ...styles.avatar, backgroundColor: 'rgb(27, 26, 30)' }} >
                                    {players[sit].name[0].toUpperCase()}
                                </Avatar>
                                {(cards.length > 0 && players[sit].state != 'fold') &&
                                    <div className={"hand-card c" + cards.length + ' t-' + this.state.cardType} style={this.cdir[this.state.cardType]['c'+cards.length][align]} >
                                        {
                                            cards.map((card, i) => (
                                                <div key={card} >
                                                    <div className={'card hand _' + card + ' card-anim' + (i + 1) + (mySit == sit ? '  my-hand' : '')} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                                {('bet' in players[sit] && players[sit].state != 'fold') &&
                                <div style={{ ...styles.box, ...this.adir[align] }}>
                                    <Box style={styles.amount} display="flex" alignItems="center" className={"focus-in-expand sit-" + sit}>
                                        <img className="bet-chip" src={chip} />
                                        <Typography variant="body2" style={styles.Text}>
                                            {toMoney(players[sit].bet)}
                                        </Typography>
                                    </Box>
                                    {players[sit].state != 'new' &&
                                        <Box style={styles.state} display="flex" alignItems="center" className="focus-in-expand">
                                            <Typography variant="body2" style={styles.Text}>
                                                {t(players[sit].state)}
                                            </Typography>
                                        </Box>
                                    }
                                    </div>
                                }
                            </div>
                        </div>
                    </Grid >
                )
            }
        }
        return (
            <Grid className="scale-in-center" style={{ animationDelay: '.' + sit / 3 + 's' }} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                <Grid item style={styles.info} direction={this.dir[align]} >
                    <div style={styles.xinfo}>
                        <Typography style={styles.name}>&nbsp;</Typography>
                        <Box display="flex" alignItems="center">
                            <Typography  >&nbsp;</Typography>
                        </Box>
                    </div>
                    <Avatar className={"avatar"} style={{ ...styles.avatar, backgroundColor: '#332c44' }} onClick={this.sit}>
                        <PersonAdd />
                    </Avatar>
                </Grid>
                <Grid item style={styles.content} >

                </Grid>
            </Grid >
        );
    }
}

let theme = createMuiTheme()
const styles = {
    info: {
        color: '#ddd',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(.5),
    },
    name: {
        width: 85,
        textAlign: 'center',
        overflow: 'hidden',
        direction: 'ltr',
        textOverflow: 'ellipsis'
    },
    dAvatar: {
        position: 'relative'
    },
    avatar: {
        color: '#faa001',
        boxShadow: '1px 2px 2px 1px #00000066',
        cursor: 'pointer',
    },
    moneyIcon: {
        fontSize: '1rem',
        color: 'rgb(242, 185, 12)',
    },
    moneyText: {
        color: '#fff'
    },
    xinfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(.5),
    },
    cinfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chip: {
        position: 'absolute',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        margin: theme.spacing(.5),
        color: '#fff',
        padding: 3,
        borderRadius: 30,
        boxShadow: 0
    },
    hold: {
        background: 'linear-gradient(0deg, rgba(229, 33, 17, 1) 0%, rgba(214, 7, 77, 1) 100%)'
    },
    roll: {
        background: 'linear-gradient(0deg, rgb(79, 157, 70) 0%, rgb(22, 189, 20) 100%)'
    },
    balance: {
        background: '#1a283f',
        borderRadius: 20,
        padding: ' 0px 6px',
        boxShadow: '0 0 4px #0e1635 inset',
        alignItems: 'center',
    },
    type: {
        background: 'rgba(47, 45, 44, 0.84) ',
        borderRadius: 12,
        padding: '0px 10px',
        boxShadow: '0 0 4px #0e1635 inset',
        alignItems: 'center',
        position: 'absolute',
        top: '-10%'
    },
    box: {
        flexDirection: 'column',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
    },
    amount: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(87, 87, 87, 0.3)',
        borderRadius: 20,
        
    },
    state: {
        background: '#b17d42',
        borderRadius: 20,
        margin:5
    },
    Text: {
        color: '#fff',
        padding: ' 0px 6px',
    },
    stateText: {
        fontSize:12,
        color: '#fff',
        padding: ' 0px 6px',
    },
}

export default Item;