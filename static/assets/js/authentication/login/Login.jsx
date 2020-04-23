import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {reduxForm} from 'redux-form';
import {Redirect} from "react-router-dom";
import * as actions from "../../01_actions/01_index";
import {MyTextFieldSimple} from '../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import asyncValidate from "./asyncValidate";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


let Login = props => {
    const dispatch = useDispatch();
    const onSubmit = (e) => {
        const {username, password} = e;
        dispatch(actions.login(username, password));
    };
    const {
        handleSubmit,
        pristine,
        submitting,
        reset
    } = props;

    const auth = useSelector(state => state.auth);
    const esta_cargando = useSelector(state => state.esta_cargando);

    if (auth.isAuthenticated) {
        return <Redirect to="/"/>
    }

    const error_login = auth && auth.errors ? auth.errors : null;
    const mensaje_error = error_login && error_login.error ? error_login.error[0] : null;
    return (
        <div className="container form-signin pt-3 text-center" style={{width: '400px'}}>
            <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <MyTextFieldSimple
                    name='username'
                    nombre='Nombre de Usuario'
                    disabled={esta_cargando.cargando}
                    className='col-12'
                    onChange={() => {
                        dispatch(actions.clear_authentication_errors());
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
                        dispatch(actions.clear_authentication_errors());
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
};

Login = reduxForm({
    form: "loginForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Login);

export default Login;