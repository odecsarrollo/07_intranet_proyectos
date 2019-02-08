import React from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';

const LoadingOverlay = (props) => {
    const {esta_cargando, classes} = props;
    let isActive = esta_cargando ? 'block' : 'none';
    const style = {
        display: isActive
    };
    return (
        <div className={classes.loadingOverloadUno}>
            <div className={classes.loadingOverloadDos} style={style}>
                <div className={classes.loadingOverloadTres}>
                    <FontAwesomeIcon icon={['fas', 'spinner-third']} size='2x' spin/>
                    <Typography variant="h4" color="inherit" noWrap>
                        Procesando...
                    </Typography>
                </div>
            </div>
            {props.children}
        </div>
    )
};

function mapPropsToState(state, ownProps) {
    return {
        esta_cargando: state.esta_cargando
    }
}

const styles = theme => (
    {
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
        }
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(LoadingOverlay));