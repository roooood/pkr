
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
        margin: '20px 1% 0 3%',
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

const FoldBtn = withStyles(theme => ({
    root: {
        padding: '10px 0',
        margin: 5,
        fontSize: '.9rem',
        background: 'linear-gradient(0deg,#ae1e1e 0%, #c81515 100%)',
        transition: 'all 0.3s ease-out',
        '&:hover': {
            opacity: .8,
        },
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        color: '#040404'
    }
}))(Button);

const CallBtn = withStyles(theme => ({
    root: {
        padding: '10px 0',
        margin: 5,
        fontSize: '.9rem',
        background: 'linear-gradient(0deg,#1b8212 0%, #429713 100%)',
        transition: 'all 0.3s ease-out',
        '&:hover': {
            opacity: .8,
        },
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        color: '#040404'
    }
}))(Button);

const RaiseBtn = withStyles(theme => ({
    root: {
        padding: '10px 0',
        margin: 5,
        fontSize: '.9rem',
        background: 'linear-gradient(0deg,#b58310 0%, #f9bd0a 100%)',
        transition: 'all 0.3s ease-out',
        '&:hover': {
            opacity: .8,
        },
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        color: 'rgb(53, 52, 52)'
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
        const { players } = this.props.state;
        if (this.state.canTake == false)
            return null;
        return (
            <Grid className="scale-in-center" style={styles.box} container >
                <CallBtn onClick={() => this.actionIs('call')}>
                    <Typography style={styles.text}>{this.props.state.bet == players[this.state.mySit].bet ? t('check') : t('call')}</Typography>
                    <Typography style={styles.sub}>{toMoney(this.props.state.bet)}</Typography>
                </CallBtn>
                <FoldBtn onClick={() => this.actionIs('fold')}>
                    <Typography style={styles.text}>{t('fold')}</Typography>
                    <Typography style={styles.sub}>X</Typography>
                </FoldBtn>
                <IOSSlider
                    track={false}
                    value={this.state.bet}
                    onChange={this.changeBet}
                    valueLabelDisplay="on"
                    min={'bet' in this.props.state ? this.props.state.bet : this.Room.data.min}
                    max={this.context.state.user.balance > this.Room.data.max ? this.Room.data.max : this.context.state.user.balance}
                    step={this.Room.data.setting.step}
                    valueLabelFormat={this.valuetext}
                />
                <RaiseBtn onClick={() => this.actionIs('raise')}>
                    <Typography style={styles.text}>{t('raise')}</Typography>
                    <Typography style={styles.sub}>{this.valuetext(this.state.bet)}</Typography>
                </RaiseBtn>
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
    text: {
        fontSize: '.8em'
    },
    sub: {
        color: '#fff',
    }
}

export default Action;