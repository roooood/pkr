import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import Lobby from './lobby/Lobby';
import Game from './game/Game';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography style={{ width: '100%' }} component="div" role="tabpanel" hidden={value != index} {...other}>
            {children}
        </Typography>
    );
}
class Tabbar extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    componentDidMount() {

    }
    changeIndex(index) {
        let a = 0;
        for (let i in this.context.state.tab.data) {
            if (a++ == index) {
               // this.props.dispatch(TabbarActive(i));
            }
        }

    }
    render() {
        const tab = this.context.state.tab.data;
        const tabs = Object.keys(tab);
        let index = -1;
        for (let i in this.context.state.tab.data) {
            index++;
            if (this.context.state.tab.active == i) {
                break;
            }
        }
        if (this.context.state.isMobile)
            return (
                <SwipeableViews index={index} onChangeIndex={this.changeIndex} enableMouseEvents slideStyle={{ width: '100vw', height: '100vh' }}>
                    {tabs.map((item) => {
                        return (
                            <div key={item} className="puff-in-center" style={{ ...styles.root }} >
                                {item == 'lobby'
                                    ? <Lobby />
                                    : <Game parent={tab[item]} inView={this.context.state.tab.active == item} />
                                }
                            </div>
                        )
                    })}
                </SwipeableViews>
            )
        return (
            <>
                {tabs.map((item) => {
                    return (
                        <TabPanel key={item} className="puff-in-center" value={this.context.state.tab.active} index={item}>
                            <div style={styles.root} >
                                {item == 'lobby'
                                    ? <Lobby />
                                    : <Game parent={tab[item]} inView={this.context.state.tab.active == item} />
                                }
                            </div>
                        </TabPanel>
                    )
                })
                }
            </>
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        height: '100%',

    }
}
export default Tabbar;