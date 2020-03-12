import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Refresh from '@material-ui/icons/Refresh';
import FilterList from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { toMoney } from 'library/Helper';
import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';
import play from 'library/Sound';

const ColorButton = withStyles(theme => ({
    root: {
        background: 'transparent',
        border: '1px solid rgba(185, 183, 183, 0.2)',
        padding: ' 1px 10px',
        marginTop: 3,
        borderRadius: 5,
        minWidth: 60,
        boxShadow: 'none',
        '&:hover': {
            background: 'transparent',
        },
    },
}))(Button);

class Setting extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    leave() {
        window.ee.emit('leave' + this.props.tab.active)
        window.ee.emit('removeTab', this.props.tab.active)
    }
    standUp() {
        window.ee.emit('standUp' + this.props.tab.active)
    }
    changeScreen() {
        this.setState({ fullscreen: !this.state.fullscreen })
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    toggleSound() {
        let act = ('mute' in this.context.state) && this.context.state.mute ? false : true;
        play(!act);
        this.context.setState({ mute: act });
    }
    render() {
        return (
            <>
                {this.props.tab.active == 'lobby'
                    ? <>
                        < IconButton onClick={() => null}  >
                            <Refresh style={styles.icon} />
                        </IconButton>
                        < IconButton onClick={() => null}  >
                            <FilterList style={styles.icon} />
                        </IconButton>
                    </>
                    : <>
                        < IconButton onClick={this.leave} color="secondary" >
                            <Close />
                        </IconButton>
                        <IconButton onClick={this.standUp} >
                            <ArrowUpward style={styles.icon} />
                        </IconButton>
                        <IconButton onClick={this.toggleSound} >
                            {('mute' in this.context.state) && this.context.state.mute
                                ? <VolumeOff style={styles.icon} />
                                : <VolumeUp style={styles.icon} />}
                        </IconButton>
                    </>
                }
                <IconButton size="medium" onClick={this.changeScreen}>
                    {this.state.fullscreen
                        ? <FullscreenIcon style={styles.icon} />
                        : <FullscreenExitIcon style={styles.icon} />
                    }
                </IconButton>
                {'name' in this.context.state.user &&
                    <ColorButton disabled onClick={this.openMenu} variant="contained" color="primary" >
                        <Typography component="div" style={styles.account}>
                            {this.context.state.user.name}
                            <Typography component="div" align="left" style={styles.accountSub}  >
                                $ {toMoney(this.context.state.user.balance * 10000000 / 10000000)}
                            </Typography>
                        </Typography>
                    </ColorButton>
                }
            </>
        );
    }
}
const styles = {
    icon: {
        color: '#fff'
    },
    account: {
        fontSize: 13,
        whiteSpace: 'nowrap',
        color: '#fff'
    },
    accountSub: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#dbb316',
    },
}

export default connect(state => state)(Setting);