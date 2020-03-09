
import React, { Component } from 'react';
import Context from 'library/Context';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import autoBind from 'react-autobind';
import PersonAdd from '@material-ui/icons/PersonAdd';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { toMoney } from 'library/Helper';

class Item extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {

        };
        this.cdir = {
            right: { top: -60 },
            up: { left: -80 },
            down: { right: -80 },
            left: { bottom: -60 }
        }
        this.adir = {
            right: { left: -80 },
            up: { bottom: -40 },
            down: { top: -40 },
            left: { right: -80 }
        }
        this.dir = {
            left: 'row',
            up: 'column',
            down: 'column-reverse',
            right: 'row-reverse'
        }
        autoBind(this);
    }
    render() {
        const { align, sit } = this.props;
        const players = this.props.state.users;
        console.log(this.props.state)
        if (players != undefined) {
            if (sit in players) {
                return (
                    <Grid className="scale-in-center" style={styles.info} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                        <div style={styles.xinfo}>
                            <Typography variant="body2" className="focus-in-expand" style={styles.name}>{players[sit].name}</Typography>
                            <Box style={styles.balance} display="flex" alignItems="center" className="focus-in-expand">
                                <AttachMoney style={styles.moneyIcon} />
                                <Typography style={styles.moneyText} className={"sit" + sit}>{toMoney(players[sit].balance)}</Typography>
                            </Box>
                        </div>
                        <div style={styles.dAvatar} >
                            <div style={styles.cinfo}>
                                <Avatar style={{ ...styles.avatar, backgroundColor: 'rgb(27, 26, 30)' }} >
                                    {players[sit].name[0].toUpperCase()}
                                </Avatar>
                            </div>
                        </div>
                    </Grid >
                )
            }
        }
        return (
            <Grid className="scale-in-center" style={{ animationDelay: '.' + sit + 's' }} container direction={this.dir[align]} alignItems="center" wrap="nowrap" >
                <Grid item style={styles.info} direction={this.dir[align]} >
                    <div style={styles.xinfo}>
                        <Typography style={styles.name}>&nbsp;</Typography>
                        <Box display="flex" alignItems="center">
                            <Typography  >&nbsp;</Typography>
                        </Box>
                    </div>
                    <Avatar style={{ ...styles.avatar, backgroundColor: '#332c44' }} onClick={this.sit}>
                        <PersonAdd style={{ fontSize: 12 }} />
                    </Avatar>
                </Grid>
                <Grid item style={styles.content} >

                </Grid>
            </Grid >
        );
    }
}

let theme = createMuiTheme()
const styles = {
    info: {
        color: '#ddd',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(.5),
    },
    name: {
        width: 60,
        fontSize: '.7rem',
        textAlign: 'center',
        overflow: 'hidden',
        direction: 'ltr',
        textOverflow: 'ellipsis'
    },
    dAvatar: {
        position: 'relative'
    },
    avatar: {
        width: 35,
        height: 35,
        color: '#faa001',
        border: '1px solid #ddd',
        cursor: 'pointer',
    },
    moneyIcon: {
        fontSize: '.7rem',
        color: 'rgb(242, 185, 12)',
    },
    moneyText: {
        color: '#fff',
        fontSize: '.7rem',
    },
    xinfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(.5),
    },
    cinfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        margin: theme.spacing(.5),
        color: '#fff',
        padding: 3,
        borderRadius: 30,
        boxShadow: 0
    },
    hold: {
        background: 'linear-gradient(0deg, rgba(229, 33, 17, 1) 0%, rgba(214, 7, 77, 1) 100%)'
    },
    roll: {
        background: 'linear-gradient(0deg, rgb(79, 157, 70) 0%, rgb(22, 189, 20) 100%)'
    },
    balance: {
        background: '#1a283f',
        borderRadius: 20,
        padding: ' 0px 6px',
        boxShadow: '0 0 4px #0e1635 inset',
        alignItems: 'center',
    },
    amount: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(87, 87, 87, 0.3)',
        borderRadius: 20,
        alignItems: 'center',
        position: 'absolute',
    },
    amountText: {
        padding: ' 0px 6px',
    }
}

export default Item;