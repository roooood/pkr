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
import Context from 'library/Context';
import play from 'library/Sound';
import CircularProgress from '@material-ui/core/CircularProgress';

import Tooltip from '@material-ui/core/Tooltip';

const LightTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const ColorButton = withStyles(theme => ({
    root: {
        background: '#201e1e',
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px 2px 2px 1px',
        padding: ' 1px 10px',
        marginTop: 3,
        borderRadius: 5,
        minWidth: 60,
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
    refreshList() {
        play('click')
        window.ee.emit('refreshList')
    }
    leave() {
        play('click')
        window.ee.emit('leave' + this.context.state.tab.active)
        window.ee.emit('removeTab', this.context.state.tab.active)
    }
    standUp() {
        play('click')
        window.ee.emit('standUp' + this.context.state.tab.active)
    }
    changeScreen() {
        play('click')
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
        play('click')
        let act = ('mute' in this.context.state) && this.context.state.mute ? false : true;
        play(!act);
        this.context.setState({ mute: act });
    }
    render() {
        const { tab, standing } = this.context.state;
        if (this.context.state.isMobile) {
            if (this.context.state.tab.active == 'lobby')
                return null;
            return (
                <div style={styles.root} >
                    <div>
                        <LightTooltip title={t('exit')} >
                        < IconButton onClick={this.leave} color="secondary" style={styles.fab} >
                            <Close />
                        </IconButton>
                        </LightTooltip>
                        <LightTooltip title={standing.includes(tab.data[tab.active].id) ? t('standing'):t('standUp')} >
                            <IconButton onClick={this.standUp} style={styles.fab}>
                                {standing.includes(tab.data[tab.active].id)
                                    ?<CircularProgress size={23} color="secondary" />
                                    :<ArrowUpward style={styles.icon} />
                                }
                        </IconButton>
                        </LightTooltip>
                        <LightTooltip title={t('mute')} >
                        <IconButton onClick={this.toggleSound} style={styles.fab}>
                            {('mute' in this.context.state) && this.context.state.mute
                                ? <VolumeOff style={styles.icon} />
                                : <VolumeUp style={styles.icon} />}
                            </IconButton>
                        </LightTooltip>
                    </div>
                    {'name' in this.context.state.user &&
                        <ColorButton onClick={this.openMenu} variant="contained" color="primary" >
                            <Typography component="div" style={styles.account}>
                                {this.context.state.user.name}
                                <Typography component="div" align="left" style={styles.accountSub}  >
                                    $ {toMoney(this.context.state.user.balance * 10000000 / 10000000)}
                                </Typography>
                            </Typography>
                        </ColorButton>
                    }
                </ div>
            );
        }
        return (
            <>
                {this.context.state.tab.active == 'lobby'
                    ? <>
                        <LightTooltip title={t('refresh')} >
                        < IconButton onClick={this.refreshList}  >
                            <Refresh style={styles.icon} />
                            </IconButton>
                        </LightTooltip>
                        {/* <LightTooltip title={t('filter')} >
                            < IconButton onClick={() => null}  >
                                <FilterList style={styles.icon} />
                            </IconButton>
                        </LightTooltip> */}
                    </>
                    : <>
                        <LightTooltip title={t('exit')} >
                            < IconButton onClick={this.leave} color="secondary" >
                                <Close />
                            </IconButton>
                        </LightTooltip>
                        <LightTooltip title={t('standUp')} >
                            <IconButton onClick={this.standUp} >
                                {standing.includes(tab.data[tab.active].id )
                                    ? <CircularProgress size={23} color="secondary" />
                                    : <ArrowUpward style={styles.icon} />
                                }
                            </IconButton>
                        </LightTooltip>
                        <LightTooltip title={t('mute')} >
                            <IconButton onClick={this.toggleSound} >
                                {('mute' in this.context.state) && this.context.state.mute
                                    ? <VolumeOff style={styles.icon} />
                                    : <VolumeUp style={styles.icon} />}
                            </IconButton>
                        </LightTooltip>
                    </>
                }
                <LightTooltip title={t('fullscreen')} >
                    <IconButton size="medium" onClick={this.changeScreen}>
                    {this.state.fullscreen
                        ? <FullscreenIcon style={styles.icon} />
                        : <FullscreenExitIcon style={styles.icon} />
                    }
                    </IconButton>
                </LightTooltip>
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
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    },
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
        color: '#dbb316',
    },
    fab: {
        background: '#201e1e',
        padding: 6,
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px 2px 2px 1px',
        borderRadius: 5,
        margin:5
    }
}

export default Setting;