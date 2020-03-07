
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
import { toMoney, getOffset } from 'library/Helper';
import { t } from 'locales';
import play from 'library/Sound';


class Item extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            mySit: 0,
            timer: false,
            canTake: false,
            winner: [],
            loser: []
        };
        this.cdir = {
            right: { top: -60 },
            up: { left: -80 },
            down: { right: -80 },
            left: { bottom: -60 }
        }
        this.adir = {
            right: { left: -80 },
            up: { bottom: -40 },
            down: { top: -40 },
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
        this.setState({
            timer: false,
            winner: [],
            loser: []
        });
    }
    componentDidMount() {
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('myCards', this.myCards);
        this.context.game.register('takeAction', this.takeAction);
        this.context.game.register('actionResult', this.actionResult);
        this.context.game.register('gameResult', this.gameResult);
        this.context.game.register('reset', this.reset);
    }
    mySit(mySit) {
        this.setState({
            mySit,
            timer: false,
            canTake: false,
        })
    }
    myCards(cards) {
        this.setState({ cards })
    }
    takeAction(sit) {
        this.hideTimer();
        clearTimeout(this.timer);
        if (this.props.sit == sit) {
            this.showTimer();
        }
        setTimeout(() => {
            this.setState({ canTake: true });
        }, 500);
        this.timer = setTimeout(() => {
            this.setState({ canTake: false });
        }, this.context.state.setting.timer + 1000);

    }
    gameResult(res) {
        let winner = res.win;
        let loser = res.lose;
        this.setState({ winner, loser, canTake: false });
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
    company(sit) {
        if (this.props.sit == sit) {
            this.move(sit)
        }
    }
    move(sit) {
        let sr = 'sit' + sit;
        let ds = 'bet-value';
        let el = document.querySelector('.' + sr);
        let dl = document.querySelector('.' + ds);
        if (dl) {
            dl = dl.parentElement
            let spos = getOffset(el);
            let dpos = getOffset(dl);
            let cl = el.cloneNode(true);
            document.body.appendChild(cl);
            cl.classList.remove(sr);
            cl.classList.add('moving');
            cl.setAttribute("style", 'position: absolute;left:' + spos.left + 'px;top:' + spos.top + 'px;');
            setTimeout(() => {
                cl.classList.add('blur-out-contract-bck');
                cl.style.left = dpos.left + 10 + 'px';
                cl.style.top = dpos.top + 'px';
            }, 100);
        }
    }
    sit() {
        this.context.game.send({ sit: this.props.sit })
    }
    render() {
        const { align, sit } = this.props;
        const { winner, loser, cards, mySit } = this.state;
        const { players } = this.context.state;

        if (players != undefined) {
            if (sit in players) {
                return (
                    <Grid className="scale-in-center" style={styles.info} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                        <div style={styles.xinfo}>
                            <Typography variant="body2" className="focus-in-expand" style={styles.name}>{players[sit].name}</Typography>
                            <Box style={styles.balance} display="flex" alignItems="center" className="focus-in-expand">
                                <AttachMoney style={styles.moneyIcon} />
                                <Typography variant="body2" className={"sit" + sit}>{toMoney(players[sit].balance)}</Typography>
                            </Box>
                        </div>
                        <div style={styles.dAvatar} className={winner.includes(sit) ? "pulsate-fwd" : ""}>
                            <div style={styles.cinfo}>
                                {(this.state.timer || (this.state.rolling && !('dice' in players[sit]))) &&
                                    <Timer border time={this.context.state.setting.timer + 1000} />
                                }
                                <Avatar style={{ ...(mySit == sit ? styles.myAvatar : styles.avatar), backgroundColor: 'rgb(27, 26, 30)' }} >
                                    {players[sit].name[0].toUpperCase()}
                                </Avatar>
                                {cards.length > 0 &&
                                    <div class="hand-card" style={this.cdir[align]} >
                                        {
                                            cards.map((card, i) => (
                                                <div key={card}>
                                                    <div class={'card hand _' + card + ' card-anim' + (i + 1)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                                <Box style={{ ...styles.amount, ...this.adir[align] }} display="flex" alignItems="center" className="focus-in-expand">
                                    <div class="bet-chip">&nbsp;</div>
                                    <Typography variant="body2" style={styles.amountText}>{toMoney(players[sit].balance)}</Typography>
                                </Box>
                            </div>
                        </div>
                    </Grid >
                )
            }
        }
        return (
            <Grid className="scale-in-center" style={{ animationDelay: '.' + sit + 's' }} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                <Grid item style={styles.info} direction={this.dir[align]} >
                    <div style={styles.xinfo}>
                        <Typography style={styles.name}>&nbsp;</Typography>
                        <Box display="flex" alignItems="center">
                            <Typography  >&nbsp;</Typography>
                        </Box>
                    </div>
                    <Avatar style={{ ...styles.avatar, backgroundColor: '#332c44' }} onClick={this.sit}>
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
        width: 50,
        height: 50,
        color: '#faa001',
        border: '1px solid #ddd',
        cursor: 'pointer',
    },
    myAvatar: {
        width: 60,
        height: 60,
        color: '#faa001',
        border: '1px solid #faa001',
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
    amount: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(87, 87, 87, 0.3)',
        borderRadius: 20,
        alignItems: 'center',
        position: 'absolute',
    },
    amountText: {
        padding: ' 0px 6px',
    }
}

export default Item;