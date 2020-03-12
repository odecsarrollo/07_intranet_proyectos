import React from "react";
import PropTypes from "prop-types";
import DetailInfoItem from "./DetailInfoItem";
import DetailInfoIListLink from "./DetailInfoIListLink";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    texto_principal: {
        fontSize: '0.8rem',
        margin: 0
    },
    texto_principal_grupo: {
        fontSize: '0.8rem',
        margin: 3,
        marginBottom: -10,
        backgroundColor: '#fafafa',
        zIndex: 10
    },
    texto_secondario: {
        fontSize: '0.7rem',
        paddingLeft: '10px',
        margin: 0,
        wordBreak: 'break-all',
        whiteSpace: 'pre-line'
    },
    texto_secondario_grupo: {
        textAlign: 'center',
        fontSize: '0.7rem',
        margin: 0,
        wordBreak: 'break-all',
        whiteSpace: 'pre-line'
    },
    list_items_div: {
        borderRadius: '5px',
        border: 'solid black 1px',
        padding: '5px',
        marginBottom: '10px'
    }
}));

const DetailLayout = (props) => {
    const {children, titulo, info_items = [], info_list_items_link = []} = props;
    const classes = useStyles();
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h3" gutterBottom color="primary">
                {titulo}
            </Typography>
        </div>
        {info_items.length > 0 && <div className="col-12">
            <div className="row">
                {info_items.map(i => <DetailInfoItem
                        classes={classes}
                        key={i.label}
                        label={i.label}
                        text_value={i.text_value}
                        icon_value={i.icon_value}
                        className={i.className}
                    />
                )}
            </div>
        </div>}
        {info_list_items_link.length > 0 && <div className="col-12">
            <div className="row">
                {info_list_items_link.map(i =>
                    <DetailInfoIListLink
                        items={i.items}
                        titulo={i.titulo}
                        className={i.className}
                        classes={classes}
                        key={i.titulo}
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
    info_list_items_link: PropTypes.array,
};
export default DetailLayout;