
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

const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const IOSSlider = withStyles({
    root: {
        color: '#d58328',
        height: 4,
        margin: '20px 3% 0 2%',
        width: 300,
        padding: 0
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundColor: '#d58328',
        boxShadow: iOSBoxShadow,
        marginTop: -14,
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

const IOSSliderV = withStyles({
    root: {
        color: '#d58328',
        height: 4,
        margin: '5px 1% 20px 3%',

        padding: 0
    },
    vertical: {
        height: '30% !important',
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundColor: '#d58328',
        boxShadow: iOSBoxShadow,
        marginTop: -14,
        marginRight: -15,
        '&:focus,&:hover,&$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        top: 'calc(-50% + 22px)',
        left: -26,
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
            <Grid className="scale-in-center" style={this.context.state.isMobile ? styles.mbox : styles.box} container >
                {bet == player.bet 
                    ? <StyledBtn className="btn-act" onClick={() => this.actionIs('check')}>
                        <Typography style={styles.text}>{t('check')}</Typography>
                        <Typography style={styles.sub}>-</Typography>
                    </StyledBtn>
                    : <StyledBtn className="btn-act" onClick={() => this.actionIs('call')}>
                        <Typography style={styles.text}>{t('call')}</Typography>
                        <Typography style={styles.sub}>{toMoney(less)}</Typography>
                    </StyledBtn>
                }
                <StyledBtn className="btn-act" onClick={() => this.actionIs('fold')}>
                    <Typography style={styles.text}>{t('fold')}</Typography>
                    <Typography style={styles.sub}>X</Typography>
                </StyledBtn>
                {!this.context.state.isMobile
                    ? <IOSSlider
                        track={false}
                        value={this.state.bet}
                        onChange={this.changeBet}
                        valueLabelDisplay="on"
                        min={less+this.Room.data.min}
                        max={player.balance}
                        step={this.Room.data.min}
                        valueLabelFormat={this.valuetext}
                    />
                    : <IOSSliderV
                        track={false}
                        orientation="vertical"
                        value={this.state.bet}
                        onChange={this.changeBet}
                        valueLabelDisplay="on"
                        min={less+this.Room.data.min }
                        max={player.balance}
                        step={this.Room.data.min}
                        valueLabelFormat={this.valuetext}
                    />
                }
                <StyledBtn className="btn-act" onClick={() => this.actionIs('raise')} disabled={player.balance < this.state.bet }>
                    <Typography style={styles.text}>{t('raise')}</Typography>
                    <Typography style={styles.sub}>{this.valuetext(this.state.bet)}</Typography>
                </StyledBtn>
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
        flexDirection: 'column',
        width: 100,
        height: '100%'
    },
    text: {
        fontSize: '.8em'
    },
    sub: {
        color: '#fff',
    }
}

export default Action;