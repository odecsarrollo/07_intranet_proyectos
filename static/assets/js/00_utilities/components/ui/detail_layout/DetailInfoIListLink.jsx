import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import DetailInfoItemLink from './DetailInfoItemLink'
import classNames from "classnames";

const DetailInfoIListLink = (props) => {
    const {classes, titulo, items, className = 'col-12'} = props;
    return <div className={className}>
        {items.length > 0 && <div className="row">
            <Typography variant="body1" className={classes.texto_principal_grupo} gutterBottom color="primary">
                {titulo}
            </Typography>
            <div className={classNames("col-12", classes.list_items_div)}>
                <div className="row">
                    {items.map(l => <DetailInfoItemLink className={classNames(l.className, classes.texto_secondario_grupo)}
                                                        classes={classes} label={l.label}
                                                        link={l.link}
                                                        key={l.id}/>)}
                </div>
            </div>
        </div>}
    </div>
};
DetailInfoIListLink.propTypes = {
    titulo: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};
export default DetailInfoIListLink;