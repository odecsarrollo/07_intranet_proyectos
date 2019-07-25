import React from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import ErrorBoundary from './error_boundary';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import ReactSafeHtml from 'react-safe-html';


const LoadingOverlay = (props) => {
    const {esta_cargando: {cargando, mensaje, error, titulo}, classes} = props;
    let isActive = cargando ? 'block' : 'none';
    const style = {
        display: isActive
    };
    if (!props.isAuthenticated) {
        return <Redirect to="/"/>
    }
    return (
        <ErrorBoundary>
            <div className={classes.loadingOverloadUno}>
                <div className={classes.loadingOverloadDos} style={style}>
                    <div className={error ? classes.loadingOverloadTresError : classes.loadingOverloadTres}
                         style={{maxWidth: '500px', wordBreak: 'break-all'}}>
                        {
                            error ?
                                <FontAwesomeIcon icon={'exclamation-circle'} size='2x'/> :
                                <FontAwesomeIcon icon={'spinner-third'} size='2x' spin/>
                        }
                        <Typography variant="h4" color="inherit" noWrap>
                            {titulo}
                        </Typography>
                        <Typography variant="overline" color="inherit" gutterBottom>
                            <ReactSafeHtml html={mensaje}/>
                        </Typography>
                    </div>
                </div>
                <div className={classes.overlay} style={style}>
                </div>
                {props.children}
            </div>
        </ErrorBoundary>
    )
};

function mapPropsToState(state) {
    return {
        esta_cargando: state.esta_cargando,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

const styles = theme => (
    {
        loadingOverloadUno: {
            position: 'relative',
        },
        loadingOverloadDos: {
            content: '',
            background: 'rgba(255, 255, 255, 0.5)',
            //width: '100%',
            //height: '7000px',
            opacity: '.9',
            position: 'absolute',
            zIndex: 1400,
        },
        loadingOverloadTres: {
            maxHeight: '400px',
            overflowY: 'auto',
            borderRadius: '10px',
            position: 'fixed',
            textAlign: 'center',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1400,
            backgroundColor: theme.palette.primary.dark,
            padding: '0.8rem',
            color: 'white',
            filter: 'drop-shadow(0 0 8px darkgrey)'
        },
        loadingOverloadTresError: {
            maxHeight: '400px',
            overflowY: 'auto',
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
        },
        overlay: {
            position: 'fixed',
            display: 'none',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1399,
        }
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(LoadingOverlay));