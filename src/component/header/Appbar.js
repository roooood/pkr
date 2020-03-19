import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Context from 'library/Context';
import { t } from 'locales';
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
        minHeight: 50,
        height: 50,
        marginTop: 15,
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
            boxShadow: '0px 0px 5px #111',
            backgroundColor: '#212334',
            color: '#dbb316'
        }
    },
    selected: {}
}))(props => <Tab {...props} />);

function tabGenerator(id, props) {
    return (
        <div style={styles.list}>
            {id == 'lobby'
                ? <GamepadIcon />
                : <SportsEsportsIcon />
            }
            <div style={styles.listText}>
                <Typography variant="subtitle1" display="block" style={{ fontSize: 13 }} >
                    {props.name}
                </Typography>
                <Typography variant="subtitle2" display="block" style={{ fontSize: 11, marginTop: -4 }} >
                    {props.desc || ''}
                </Typography>
            </div>
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
        window.ee.on('removeTab', this.removeTab)
    }
    componentDidMount() {

    }
    handleChangeList(e, active) {
        const { tab } = this.context.state
        if (active != tab.active) {
            let keys = Object.keys(tab.data);
            if (keys.includes(active)) {
                this.context.state.tab.active = active;
                this.context.update();
            }
        }
    }
    removeTab(id) {
        delete this.context.state.tab.data[id];
        
        let keys = Object.keys(this.context.state.tab.data);
        let index = keys.indexOf(id);
        if (keys[index + 1] != 'undefined') {
            this.handleChangeList(null, keys[index + 1])
        }
        else if (keys[index - 1] != 'undefined') {
            this.handleChangeList(null, keys[index - 1])
        }
    }
    render() {
        const tab = this.context.state.tab.data;
        const keys = Object.keys(tab);

        if (keys.length === 0)
            return null;
        return (
            <div style={styles.root}>
                <div style={{ ...styles.tabs }} >
                    <StyledTabs
                        value={this.context.state.tab.active + ""}
                        onChange={this.handleChangeList}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {keys.map((item) => {
                            return (
                                <StyledTab key={item} disableRipple={true} value={item} label={tabGenerator(item, tab[item])} />
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
export default Appbar;