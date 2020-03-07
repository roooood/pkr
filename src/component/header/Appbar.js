import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { TabbarRemove, TabbarActive, TabbarAdd } from 'redux/action/tab';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Context from 'library/Context';
import Button from '@material-ui/core/Button';
import { t } from 'locales';
import IconButton from '@material-ui/core/IconButton';
import GamepadIcon from '@material-ui/icons/GamepadOutlined';
import SportsEsportsIcon from '@material-ui/icons/SportsEsportsOutlined';



const StyledTabs = withStyles({
    root: {
        overFlow: 'hidden',
        borderRadius: 10,
    },
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > div': {
        },
    },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        color: '#b5b5b5',
        fontSize: theme.typography.pxToRem(13),
        minWidth: 30,
        minHeight: 60,
        height: 60,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 5,
        borderRadius: 0,
        minWidth: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: .7,
        },
        '&$selected': {
            backgroundColor: '#212334',
            color: '#dbb316'
        }
    },
    selected: {}
}))(props => <Tab {...props} />);

function tabGenerator(id, props, onRemove, inList = false) {
    return (
        <div style={styles.list}>
            {id == 'lobby'
                ? <GamepadIcon />
                : <SportsEsportsIcon />
            }
            <div style={{ ...styles.listText, ...(inList ? { marginLeft: 10 } : {}) }}>
                <Typography variant="subtitle1" display="block" style={{ fontSize: 13 }} >
                    {props.name}
                </Typography>
                <Typography variant="subtitle2" display="block" style={{ fontSize: 11, marginTop: -4 }} >
                    {props.desc || ''}
                </Typography>
            </div>
            {/* {onRemove != null &&
                <IconButton color="secondary" style={styles.listRemove} onClick={() => onRemove(id)}>
                    <CloseRoundedIcon style={{ fontSize: 18, color: 'rgb(195, 68, 110)' }} />
                </IconButton>
            } */}
        </div>
    )
}
class Appbar extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    componentDidMount() {

    }
    addTab({ id, symbol, display, type }) {
        this.props.dispatch(TabbarAdd({
            key: 't' + id,
            value: {
                id,
                symbol,
                name: display,
                type,
                resolution: this.context.state.setting.reolution,
                chartType: this.context.state.setting.chartType
            }
        }));
    }
    handleChangeList(e, tab) {
        if (tab != this.context.state.tabbar) {
            let keys = Object.keys(this.props.tab.data);
            if (keys.includes(tab))
                this.props.dispatch(TabbarActive(tab));
        }
    }
    onRemove(id) {
        this.props.dispatch(TabbarRemove(id));
        let keys = Object.keys(this.props.tab.data);
        let index = keys.indexOf(id);
        if (keys[index + 1] != 'undefined') {
            this.handleChangeList(null, keys[index + 1])
        }
        else if (keys[index - 1] != 'undefined') {
            this.handleChangeList(null, keys[index - 1])
        }
    }
    render() {
        const tab = this.props.tab.data || {};
        const keys = Object.keys(tab);

        if (keys.length === 0)
            return null;
        return (
            <div style={styles.root}>
                <div style={{ ...styles.tabs }} >
                    <StyledTabs
                        value={this.props.tab.active + ""}
                        onChange={this.handleChangeList}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {keys.map((item) => {
                            return (
                                <StyledTab key={item} disableRipple={true} value={item} label={tabGenerator(item, tab[item], item == 'lobby' ? null : this.onRemove)} />
                            )
                        })
                        }
                    </StyledTabs>
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        display: 'flex',
        alignItems: 'center'

    },
    tabs: {
        maxWidth: '90%'
    },
    list: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    listText: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',

    },
    listRemove: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        zIndex: 9999
    },
    listPort: {
        marginBottom: 5,
        border: '1px solid #444',
        borderRadius: 5
    }
}
export default connect(state => state)(Appbar);