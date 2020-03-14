import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';

import Context from './library/Context';
import { t } from './locales';

import Setting from './component/header/Setting';
import Appbar from './component/header/Appbar';
import Menu from './component/header/Menu';

import Tabbar from './component/main/Tabbar';

class Route extends Component {
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
        if (this.context.state.isMobile)
            return (
                <div id="content" className={"container mobile theme-default"} >
                    <div style={styles.top}>
                        <Setting />
                    </div>
                    <Tabbar />
                </div>
            )
        return (
            <div id="content" className={"container column theme-default"} >
                <div className="container top" >
                    <div className="item1" >
                        <Menu />
                    </div>
                    <div className="item2">
                        <Appbar />
                    </div>
                    <div className="item3" >
                        <Setting />
                    </div>
                </div>
                <div className="container center" >
                    <Tabbar />
                </div>
            </div >
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
    },
    dir: {
        display: 'flex',
        margin: 10,
        borderRadius: 10,
        position: 'relative',
    },
    top: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: '100%'
    }
}

export default connect(state => state)(Route);