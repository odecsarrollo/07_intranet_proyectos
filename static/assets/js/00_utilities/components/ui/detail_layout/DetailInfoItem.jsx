import React, {Fragment} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const useStyles = makeStyles(theme => ({
    texto_principal: {
        fontSize: '0.8rem',
        margin: 0
    },
    texto_secondario: {
        fontSize: '0.7rem',
        paddingLeft: '10px',
        margin: 0,
        wordBreak: 'break-all',
        whiteSpace: 'pre-line'
    },
}));

const DetailInfoItem = (props) => {
    const classes = useStyles();
    const {label, text_value = null, icon_value = null, className = 'col-12'} = props;
    return <Fragment>
        {(text_value || icon_value) && <div className={className}>
            <div className="row">
                <Typography variant="body1" className={classes.texto_principal} gutterBottom color="primary">
                    <span>{label}:</span>
                </Typography>
                {text_value &&
                <Typography variant="body1" className={classes.texto_secondario} gutterBottom
                            color="secondary">{text_value}</Typography>}
                {icon_value && <FontAwesomeIcon icon={icon_value}/>}
            </div>
        </div>}
    </Fragment>
};
DetailInfoItem.propTypes = {
    label: PropTypes.string,
    text_value: PropTypes.string,
    icon_value: PropTypes.string,
    className: PropTypes.string,
};
export default DetailInfoItem;