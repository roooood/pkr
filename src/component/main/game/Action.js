
import React, { Component } from 'react';
import Context from 'library/Context';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import autoBind from 'react-autobind';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import play from 'library/Sound';
import { toMoney } from 'library/Helper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';



const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const IOSSlider = withStyles({
    root: {
        color: '#d58328',
        height: 4,
        // margin: '20px 5% 0 2%',
        width: '100%',
        padding: 0
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: '#d58328',
        boxShadow: iOSBoxShadow,
        marginTop: -9,
        '&:focus,&:hover,&$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 11px)',
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#fff',
        },
    },
    track: {
        height: 4,
    },
    rail: {
        height: 4,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        backgroundColor: 'currentColor',
    },
})(Slider);

const StyledBtn = withStyles(theme => ({
    root: {
        padding: '10px 0',
        margin: 5,
        fontSize: '.9rem',
        background: 'linear-gradient(0deg,#2b3365 0%, #171f3a 100%)',
        transition: 'all 0.3s ease-out',
        '&:hover': {
            opacity: .8,
        },
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        color: '#616994'
    }
}))(Button);


class Action extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.Room = this.props.Room;
        this.state = {
            mySit: 0,
            canTake: false,
            bet: this.Room.data.min,
        };
        autoBind(this);
    }
    componentDidMount() {
        this.context.game.register(this.Room, 'mySit', this.mySit);
        this.context.game.register(this.Room, 'takeAction', this.takeAction);
        this.context.game.register(this.Room, 'newLevel', this.reset);
        this.context.game.register(this.Room, 'reset', this.reset);
        this.context.game.register(this.Room, 'actionIs', this.reset);
    }
    reset() {
        this.setState({ canTake: false });
    }
    mySit(mySit) {
        this.setState({
            mySit,
            canTake: false,
        })
    }
    plusBet() {
        const { players, bet } = this.props.state;
        const player = players[this.state.mySit] || {};

        let max = player.balance;
        let newBet = this.state.bet + this.Room.data.min;
        if (newBet > max) {
            newBet = max;
        }
        this.setState({ bet: newBet })
    }
    minesBet() { 
        const { players, bet } = this.props.state;
        const player = players[this.state.mySit] || {};

        let less = bet - (player.bet || 0);
        let min = less + this.Room.data.min;
        let newBet = this.state.bet - this.Room.data.min;
        if (newBet < min) {
            newBet = min;
        }
        this.setState({ bet: newBet})
    }
    changeBet(e, bet) {
        this.setState({ bet })
    }
    valuetext(value) {
        return toMoney(value);
    }
    takeAction(sit) {
        if (this.state.mySit == sit) {
            play('turn')
            setTimeout(() => {
                this.setState({ canTake: true });
            }, 500);
            this.timer = setTimeout(() => {
                this.setState({ canTake: false });
            }, this.Room.data.setting.timer + 1000);
        }
        else {
            this.setState({ canTake: false });
        }
    }
    actionIs(type) {
        play('click')
        this.context.game.send(this.Room, { action: [type, this.state.bet] })
    }
    render() {
        const { players ,bet} = this.props.state;
        const player = players[this.state.mySit] || {};
        const less = bet - (player.bet || 0);
        if (this.state.canTake == false)
            return null;
        return (
            <Grid className="scale-up-bottom" style={this.context.state.isMobile ? styles.mbox : styles.box} container >
                {player.balance > less 
                ?bet == player.bet 
                    ? <StyledBtn className="btn-act" onClick={() => this.actionIs('check')}>
                        <Typography style={styles.text}>{t('check')}</Typography>
                        <Typography style={styles.sub}>✓</Typography>
                    </StyledBtn>
                    : <StyledBtn className="btn-act" onClick={() => this.actionIs('call')}>
                        <Typography style={styles.text}>{t('call')}</Typography>
                        <Typography style={styles.sub}>{toMoney(less)}</Typography>
                    </StyledBtn>
                :null
                }
                <StyledBtn className="btn-act" onClick={() => this.actionIs('fold')}>
                    <Typography style={styles.text}>{t('fold')}</Typography>
                    <Typography style={styles.sub}>✗</Typography>
                </StyledBtn>
                {player.balance > less &&
                    <div style={styles.slider} >
                        <IconButton onClick={this.minesBet} style={styles.fab} >
                            <RemoveIcon style={{ color: '#fff' }} />
                        </IconButton>
                        <IOSSlider
                            track={false}
                            value={this.state.bet}
                            onChange={this.changeBet}
                            valueLabelDisplay="on"
                            min={less + this.Room.data.min}
                            max={player.balance}
                            step={this.Room.data.min}
                            valueLabelFormat={this.valuetext}
                        />
                        <IconButton onClick={this.plusBet} style={styles.fab} >
                            <AddIcon style={{ color: '#fff' }} />
                        </IconButton>
                    </div>
                }
                {player.balance > less &&
                    <StyledBtn className="btn-act" onClick={() => this.actionIs('raise')} disabled={player.balance < this.state.bet}>
                        <Typography style={styles.text}>{t('raise')}</Typography>
                        <Typography style={styles.sub}>{this.valuetext(this.state.bet)}</Typography>
                    </StyledBtn>
                }
                <StyledBtn className="btn-act" onClick={() => this.actionIs('allin')}>
                    <Typography style={styles.text}>{t('allin')}</Typography>
                    <Typography style={styles.sub}>{this.valuetext(player.balance)}</Typography>
                </StyledBtn>
            </Grid >
        )
    }

}

const styles = {
    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
        right: 0,
        background: 'rgb(37, 39, 58)',
        zIndex: 99999,
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px -4px 5px 4px',
        borderRadius: '70px 70px 0 0',
        height: 75,
        padding:'1px 20px'
    },
    text: {
        fontSize: '.8em'
    },
    sub: {
        color: '#fff',
    },
    fab: {
        background: '#ab7840',
        borderRadius: 5,
        padding: 5 ,
        zIndex: 99
    },
    slider: {
        margin: '0 10px',
        width: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export default Action;