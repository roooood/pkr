import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { t } from 'locales';
import { connect } from 'react-redux';
import Context from 'library/Context';


class Menu extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    openMenu() {
    }
    render() {
        return (
            <img style={{ width: 90 }} src={require('assets/img/logo.png')} />
        );
    }
}
const styles = {

}

export default connect(state => state)(Menu);