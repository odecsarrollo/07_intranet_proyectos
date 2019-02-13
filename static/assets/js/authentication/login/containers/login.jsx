import React, {Component} from "react";
import {connect} from "react-redux";
import {reduxForm} from 'redux-form';
import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import {MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import validate from '../components/forms/validate';
import asyncValidate from "../components/forms/asyncValidate";
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';

class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        const {username, password} = e;
        this.props.login(username, password);
    }

    render() {
        const {
            handleSubmit,
            pristine,
            submitting,
            reset,
            auth,
            esta_cargando,
            classes
        } = this.props;

        if (auth.isAuthenticated) {
            return <Redirect to="/"/>
        }

        const error_login = auth && auth.errors ? auth.errors : null;
        const mensaje_error = error_login && error_login.error ? error_login.error[0] : null;
        return (
            <div className="container form-signin pt-3 text-center" style={{width: '400px'}}>
                <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <MyTextFieldSimple
                        name='username'
                        nombre='Nombre de Usuario'
                        disabled={esta_cargando.cargando}
                        className='col-12'
                        onChange={() => {
                            this.props.clear_authentication_errors();
                        }}
                    />
                    <MyTextFieldSimple
                        name='password'
                        nombre='Contraseña'
                        className='col-12'
                        type='password'
                        disabled={esta_cargando.cargando}
                        autoFocus={true}
                        onChange={() => {
                            this.props.clear_authentication_errors();
                        }}
                    />
                    {
                        mensaje_error &&
                        <div className='mt-3'>
                            <Typography variant="caption" gutterBottom color="error">
                                {mensaje_error}
                            </Typography>
                        </div>

                    }

                    <Button
                        variant="contained"
                        className='ml-3'
                        color='primary'
                        disabled={submitting || pristine || esta_cargando.cargando}
                        type='submit'
                    >
                        Ingresar
                    </Button>

                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={reset}
                        disabled={submitting || pristine || esta_cargando.cargando}
                    >
                        Limpiar
                    </Button>
                </form>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        esta_cargando: state.esta_cargando,
        auth: state.auth
    }
}

Login = reduxForm({
    form: "loginForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Login);

const styles = theme => (
    {
        iconoMain: {
            color: theme.palette.primary.dark
        },
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(Login));