import React, {memo, useEffect} from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import clsx from 'clsx';


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
}));

const DrawerMenu = memo(props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const menu_status = useSelector(state => state.menu_status);
    const {open_menu, submenu_abiertos} = menu_status;
    const {lista_menu, titulo = 'Colocar Titulo'} = props;
    const menu_abierto = submenu_abiertos > 0 || open_menu;
    useEffect(() => {
        dispatch(actions.resetMenu());
        return () => dispatch(actions.resetMenu());
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: menu_abierto,
                })}
            >
                <Toolbar disableGutters={!menu_abierto}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={() => dispatch(actions.openMenu())}
                        className={clsx(classes.menuButton, {
                            [classes.hide]: menu_abierto,
                        })}
                    >
                        <FontAwesomeIcon icon={'bars'}/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        {titulo}
                    </Typography>
                    <div className='text-right' style={{position: 'absolute', right: 0}}>
                        <Button
                            color="inherit"
                            onClick={() => dispatch(actions.logout())}
                        >
                            Salir
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={menu_abierto}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => dispatch(actions.closeMenu())}>
                        {theme.direction === 'rtl' ?
                            <FontAwesomeIcon icon={'angle-right'} className={classes.iconColor}/> :
                            <FontAwesomeIcon icon={'angle-left'} className={classes.iconColor}/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    {lista_menu}
                    <Divider/>
                    <Link to='/app/'>
                        <ListItem>
                            <img src={`${img_static_url}/logo.png`} width="40"
                                 className="d-inline-block align-top mr-2"
                                 alt=""
                                 style={{position: 'relative', right: 10}}
                            />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: menu_abierto,
                })}
            >
                <div className={classes.drawerHeader}/>
                {props.children}
            </main>
        </div>
    )
});
export default DrawerMenu;