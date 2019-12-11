import React, {memo} from 'react';
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import ErrorBoundary from './ErrorBoundary';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {makeStyles, withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    loadingOverloadUno: {
        position: 'relative'
    },
    loadingOverloadDos: {
        content: '',
        background: 'rgba(255, 255, 255, 0.5)',
        width: '100%',
        height: '7000px',
        opacity: '.9',
        position: 'absolute',
        zIndex: 1400
    },
    loadingOverloadTres: {
        maxHeight: '400px',
        overflow: 'scroll',
        borderRadius: '10px',
        position: 'fixed',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1400,
        backgroundColor: theme.palette.primary.dark,
        padding: '0.5rem',
        color: 'white'
    },
    loadingOverloadTresError: {
        maxHeight: '400px',
        overflow: 'scroll',
        borderRadius: '10px',
        position: 'fixed',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1400,
        backgroundColor: theme.palette.error.dark,
        padding: '0.5rem',
        color: 'white'
    }
}));


const LoadingOverlay = memo((props) => {
    const classes = useStyles();
    const esta_cargando = useSelector(state => state.esta_cargando);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    if (!isAuthenticated) {
        return <Redirect to="/"/>
    }
    const {cargando, mensajes, error, titulo} = esta_cargando;
    let isActive = cargando ? 'block' : 'none';
    const style = {
        loadingOverloadDos: {
            display: isActive
        },
        loadingOverloadTres: {
            maxWidth: '500px',
            wordBreak: 'break-all'
        }
    };
    return (
        <ErrorBoundary>
            <div className={classes.loadingOverloadUno}>
                <div className={classes.loadingOverloadDos} style={style.loadingOverloadDos}>
                    <div
                        className={error ? classes.loadingOverloadTresError : classes.loadingOverloadTres}
                        style={style.loadingOverloadTres}>
                        {
                            error ?
                                <FontAwesomeIcon icon={'exclamation-circle'} size='2x'/> :
                                <FontAwesomeIcon icon={'spinner-third'} size='2x' spin/>
                        }
                        <Typography variant="h4" color="inherit" noWrap>
                            {titulo}
                        </Typography>
                        <Typography variant="overline" color="inherit" gutterBottom>
                            {_.size(mensajes) > 0 && <div className='row'>
                                {_.map(mensajes, m => <div key={m} className="col-12">
                                    {m}
                                </div>)}
                            </div>}
                        </Typography>
                    </div>
                </div>
                {props.children}
            </div>
        </ErrorBoundary>
    )
});

export default LoadingOverlay;