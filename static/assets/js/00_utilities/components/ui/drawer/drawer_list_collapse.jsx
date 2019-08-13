import React, {Fragment, memo, useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import {useDispatch} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    main: {
        paddingLeft: theme.spacing.unit * 2,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
}));

const ListCollapse = memo(props => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {icono, texto, children} = props;
    return (
        <Fragment>
            <ListItem
                button
                onClick={() => {
                    if (open) {
                        dispatch(actions.closeTMenu());
                    } else {
                        dispatch(actions.openTMenu());
                    }
                    setOpen(!open);
                }}
            >
                <Tooltip title={texto}>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={icono} size='lg' className={classes.iconColor}/>
                    </ListItemIcon>
                </Tooltip>
                <ListItemText primary={texto}/>
                {open ?
                    <FontAwesomeIcon icon={'angle-up'} className={classes.iconColor}/> :
                    <FontAwesomeIcon icon={'angle-down'} className={classes.iconColor}/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children}
                </List>
            </Collapse>
        </Fragment>
    )
});

export default ListCollapse;