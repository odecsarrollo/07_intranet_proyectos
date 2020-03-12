import React, {memo} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const DetailInfoItemLink = memo((props) => {
    const {label, className = 'col-12', link} = props;
    return <div className={className}>
        <Link to={link} target='_blank'>
            {label}
        </Link>
    </div>
});
DetailInfoItemLink.propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
};
export default DetailInfoItemLink;