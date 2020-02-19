import React, {memo, Fragment} from 'react';
import {Link} from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';
import classNames from "classnames";

const useStyles = makeStyles(theme => ({
    main: {
        paddingLeft: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
}));

const ActionOnClikItem = (props) => {
    const {link, onClick, children} = props;
    if (link) {
        return (
            <Link to={link}>
                {children}
            </Link>
        )
    } else if (onClick) {
        return (<Fragment>{children}</Fragment>)
    }
};

const DrawerListItem = memo(props => {
    const classes = useStyles();
    const {link = null, onClick = null, texto, icono, type = 'main', size = null} = props;
    return (
        <ActionOnClikItem link={link} onClick={onClick}>
            <ListItem className={classNames(type === 'main' ? classes.main : classes.nested, 'puntero')}>
                {icono && <Tooltip title={texto} onClick={onClick}>
                    <ListItemIcon>
                        <FontAwesomeIcon className={classes.iconColor} icon={icono} size={size}/>
                    </ListItemIcon>
                </Tooltip>}
                <ListItemText primary={texto}/>
            </ListItem>
        </ActionOnClikItem>
    )
});

export default DrawerListItem;