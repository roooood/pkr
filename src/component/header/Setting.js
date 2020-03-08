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
import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';
import play from 'library/Sound';

class Setting extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
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
            <div>
                {this.props.tab.active == 'lobby'
                    ? <>
                        < IconButton onClick={this.leave}  >
                            <Refresh style={styles.icon} />
                        </IconButton>
                        < IconButton onClick={this.leave}  >
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
            </div>
        );
    }
}
const styles = {
    icon: {
        color: '#fff'
    },
}

export default connect(state => state)(Setting);