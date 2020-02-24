import React from "react";
import PropTypes from "prop-types";
import DetailInfoItem from "./DetailInfoItem";
import Typography from "@material-ui/core/Typography";

const DetailLayout = (props) => {
    const {children, titulo, info_items} = props;
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h3" gutterBottom color="primary">
                {titulo}
            </Typography>
        </div>
        {info_items.length > 0 && <div className="col-12">
            <div className="row">
                {info_items.map(i => <DetailInfoItem
                        key={i.label}
                        label={i.label}
                        text_value={i.text_value}
                        icon_value={i.icon_value}
                        className={i.className}
                    />
                )}
            </div>
        </div>}
        <div className="col-12">
            {children}
        </div>
    </div>
};
DetailLayout.propTypes = {
    titulo: PropTypes.string.isRequired,
    info_items: PropTypes.array,
};
export default DetailLayout;