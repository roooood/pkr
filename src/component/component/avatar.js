import React from 'react';
import autoBind from 'react-autobind';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Context from 'library/Context';
import avatars from 'library/Avatar';
import { t } from 'locales';
import request from 'library/Fetch';

class Avatar extends React.Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    pick(avatar) {
        request('avatar/' + avatar + '/' + this.context.state.userKey, res => {
        });
        this.context.state.user.avatar = avatar;
        window.ee.emit('hideModal')
    }
    render() {
        return (
            <>
                <h1 style={styles.title}>{t('pickavatar')}</h1>
                {
                    Object.keys(avatars).map((src, i) => (
                        <IconButton key={i} onClick={() => this.pick(src)}>
                            <img src={avatars[src]} style={styles.img} />
                        </IconButton>
                    ))

                }
            </>
        );
    }
}

var styles = {
    title: {
        textAlign: 'center',
        paddingBottom: 10,
        fontSize: 20,
        marginTop: -10,
        borderBottom: '1px solid #555'
    },
    img: {
        width:60
    }

}
export default Avatar;