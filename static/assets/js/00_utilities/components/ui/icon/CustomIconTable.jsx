import React from 'react';
import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from "@material-ui/core/styles/index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const useStyles = makeStyles(theme => ({
    icono: {
        color: theme.palette.primary.dark
    },
    icono_button: {
        margin: 0,
        padding: 4,
    }
}));

const CustomIconTable = (props) => {
    const {onClick = null, icon} = props;
    const classes = useStyles();
    return (
        <div className='text-center'>
            <IconButton
                className={classes.icono_button}
                onClick={onClick}
            >
                <FontAwesomeIcon
                    className={classes.icono}
                    icon={icon}
                    size='xs'
                />
            </IconButton>
        </div>
    )
};
CustomIconTable.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.string.isRequired,
};

export default CustomIconTable;