import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
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
    render() {
        const tab = this.props.tab.data || {};
        if (this.context.state.isMobile)
            return (
                <SwipeableViews index={this.state.mobile} enableMouseEvents slideStyle={{ width: '100vw', height: '100vh' }}>
                    {Object.keys(tab).map((item) => {
                        return (
                            <div key={item} className="puff-in-center" style={{ ...styles.root, direction: this.context.state.dir }} >
                                {item == 'lobby'
                                    ? <Lobby />
                                    : <Game parent={tab[item]} inView={this.props.tab.active == item} />
                                }
                            </div>
                        )
                    })}
                </SwipeableViews>
            )
        return (
            <>
                {Object.keys(tab).map((item) => {
                    return (
                        <TabPanel key={item} className="puff-in-center" value={this.props.tab.active} index={item}>
                            <div style={styles.root} >
                                {item == 'lobby'
                                    ? <Lobby />
                                    : <Game parent={tab[item]} inView={this.props.tab.active == item} />
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
export default connect(state => state)(Tabbar);