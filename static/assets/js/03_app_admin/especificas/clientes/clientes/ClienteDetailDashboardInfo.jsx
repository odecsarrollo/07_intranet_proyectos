import React, {Fragment} from 'react';
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

const ClienteDetailDashboardInfo = (props) => {
    const {
        cliente: {
            id,
            colaborador_componentes_nombre,
            colaborador_proyectos_nombre,
            sincronizado_sistemas_informacion,
            nit
        }
    } = props;
    const classes = useStyles();
    return <div className='row'>
        {colaborador_componentes_nombre && <Fragment>
            <div className="col-4 col-md-3">
                <Typography variant="body1" gutterBottom color="primary" className={classes.texto_principal}>
                    Vendedor Componentes:
                </Typography>
            </div>
            <div className="col-8 col-md-3">
                <Typography variant="body1" className={classes.texto_secondario} gutterBottom color="secondary">
                    {colaborador_componentes_nombre}
                </Typography>
            </div>
        </Fragment>}
        {colaborador_proyectos_nombre && <Fragment>
            <div className="col-4 col-md-3">
                <Typography variant="body1" gutterBottom color="primary" className={classes.texto_principal}>
                    Vendedor Proyectos:
                </Typography>
            </div>
            <div className="col-8 col-md-3">
                <Typography variant="body1" className={classes.texto_secondario} gutterBottom color="secondary">
                    {colaborador_proyectos_nombre}
                </Typography>
            </div>
        </Fragment>}
        <div className="col-2 col-md-2">
            <Typography variant="body1" gutterBottom color="primary" className={classes.texto_principal}>
                Nit:
            </Typography>
        </div>
        <div className="col-3 col-md-4">
            <Typography variant="body1" gutterBottom color="secondary">
                {nit}
            </Typography>
        </div>
        <div className="col-3 col-md-2">
            <Typography variant="body1" gutterBottom color="primary" className={classes.texto_principal}>
                Sincronizado:
            </Typography>
        </div>
        <div className="col-2 col-md-4">
            {sincronizado_sistemas_informacion && <FontAwesomeIcon
                icon={'check-circle'}
            />}
        </div>
    </div>
};

export default ClienteDetailDashboardInfo;