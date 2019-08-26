import React, {memo} from 'react';
import {Link} from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';

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

const DrawerListItem = memo(props => {
    const classes = useStyles();
    const {link, texto, icono, type = 'main', size = null} = props;
    return (
        <Link to={link}>
            <ListItem className={type === 'main' ? classes.main : classes.nested}>
                {
                    icono &&
                    <Tooltip title={texto}>
                        <ListItemIcon>
                            <FontAwesomeIcon className={classes.iconColor} icon={icono} size={size}/>
                        </ListItemIcon>
                    </Tooltip>
                }
                <ListItemText primary={texto}/>
            </ListItem>
        </Link>
    )
});

export default DrawerListItem;