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
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

const StyledDrawer = withStyles({
    root: {
        zIndex: 999999
    },
    paper: {
        backgroundColor: '#181b28',
        padding: '5px 20px',
        color:'#fff'
    },
})(props => <Drawer {...props} />);

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
            open: false
        };
        autoBind(this);
        window.ee.on('removeTab', this.removeTab)
    }
    componentDidMount() {

    }
    handleChangeList(e, active) {
        this.setState({ open: false });
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
    toggleDrawer(event) {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({open:!this.state.open });
    }
    render() {
        const tab = this.context.state.tab.data;
        const keys = Object.keys(tab);

        if (this.context.state.isMobile)
            return (
                <>
                {keys.length > 1 &&
                <IconButton onClick={this.toggleDrawer}  style={styles.fab} >
                    <DashboardIcon style={{ color: '#fff' }}/>
                </IconButton>
                }
                <StyledDrawer anchor={'left'} transitionDuration={300} open={this.state.open} onClose={this.toggleDrawer}>
                    <List>
                        {keys.map((item, i) => (
                            <ListItem button key={i} onClick={(e)=>this.handleChangeList(e,item)}>
                                <ListItemIcon>{item == 'lobby'
                                    ? <GamepadIcon style={{ color:'rgb(219, 151, 21)'}} />
                                    : <SportsEsportsIcon style={{ color: 'rgb(219, 151, 21)' }} />
                                }</ListItemIcon>
                                <ListItemText style={{ marginLeft: -20 }} primary={tab[item].name} />
                            </ListItem>
                        ))}
                    </List>
                </StyledDrawer>
                </>
            )
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
    },
    fab: {
        position: 'fixed',
        bottom: 10,
        right: 10,
        background:'#201e1e',
        zIndex: 999,
        padding:8,
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px 2px 2px 1px'
    }
}
export default Appbar;