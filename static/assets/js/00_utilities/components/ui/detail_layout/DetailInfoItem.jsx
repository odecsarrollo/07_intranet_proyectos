import React, {Fragment} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

const DetailInfoItem = (props) => {
    const {classes, label, text_value = null, icon_value = null, className = 'col-12', link = null} = props;
    return <Fragment>
        {(text_value || icon_value) && <div className={className}>
            <div className="row">
                <Typography variant="body1" className={classes.texto_principal} gutterBottom color="primary">
                    <span>{label}:</span>
                </Typography>
                {text_value &&
                <Typography variant="body1" className={classes.texto_secondario} gutterBottom
                            color="secondary">
                    {link ? <Link to={link} target='_blank'>{text_value}</Link> : text_value}
                </Typography>}
                {icon_value && <FontAwesomeIcon icon={icon_value}/>}
            </div>
        </div>}
    </Fragment>
};
DetailInfoItem.propTypes = {
    link: PropTypes.string,
    label: PropTypes.string,
    text_value: PropTypes.string,
    icon_value: PropTypes.string,
    className: PropTypes.string,
};
export default DetailInfoItem;