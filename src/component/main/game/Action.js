
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
        margin: '20px 2% 0 5%',
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
        this.state = {
            mySit: 0,
            timer: false,
            canTake: false,
            bet: context.state.table.min,
        };
        autoBind(this);
    }
    componentDidMount() {
        this.context.game.register('mySit', this.mySit);
        this.context.game.register('action', this.takeAction);
    }
    mySit(mySit) {
        this.setState({
            mySit,
            timer: false,
            canTake: false,
        })
    }
    changeBet(e, bet) {
        this.setState({ bet })
    }
    valuetext(value) {
        return toMoney(value);
    }
    render() {
        return (
            <Grid className="scale-in-center" style={styles.box} container >
                <RaiseBtn onClick={() => null}>
                    <Typography style={styles.text}>{t('raise')}</Typography>
                    <Typography style={styles.sub}>{this.valuetext(this.state.bet)}</Typography>
                </RaiseBtn>
                <IOSSlider
                    track={false}
                    value={this.state.bet}
                    onChange={this.changeBet}
                    valueLabelDisplay="on"
                    aria-labelledby="range-slider"
                    min={'bet' in this.context.state ? this.context.state.bet : this.context.state.table.min}
                    max={this.context.state.balance > this.context.state.table.max ? this.context.state.table.max : this.context.state.balance}
                    step={this.context.state.setting.step}
                    valueLabelFormat={this.valuetext}
                />
                <CallBtn onClick={() => null}>
                    <Typography style={styles.text}>{t('call')}</Typography>
                    <Typography style={styles.sub}>24.00</Typography>
                </CallBtn>
                <FoldBtn onClick={() => null}>
                    <Typography style={styles.text}>{t('fold')}</Typography>
                    <Typography style={styles.sub}>X</Typography>
                </FoldBtn>

            </Grid >
        )
    }

}

const styles = {
    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    text: {
        fontSize: '.8em'
    },
    sub: {
        color: '#fff',
    }
}

export default Action;