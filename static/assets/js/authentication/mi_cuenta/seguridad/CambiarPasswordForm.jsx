import React, {memo} from 'react';
import {useDispatch} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {useAuth} from "../../../00_utilities/hooks";
import {MyTextFieldSimple} from "../../../00_utilities/components/ui/forms/fields";
import Button from "@material-ui/core/Button";
import {reduxForm} from "redux-form";
import validate from "./validate_cambiar_contrasena_form";
import Typography from '@material-ui/core/Typography';

let CambiarPasswordForm = memo(props => {
        const authentication = useAuth();
        const dispatch = useDispatch();
        const {auth: {user}} = authentication;
        const {
            pristine,
            submitting,
            reset,
            handleSubmit
        } = props;
        const onCambiarPassword = (v) => dispatch(actions.cambiarContrasenaUsuario(user.id, v.password_old, v.password, v.password_2, {callback: reset}));
        return <form onSubmit={handleSubmit(onCambiarPassword)}>
            <Typography variant="h4" gutterBottom color="primary">
                Cambiar Password
            </Typography>
            <MyTextFieldSimple
                className='col-12 col-md-4'
                nombre='Contraseña Actual'
                name='password_old'
                type='password'
            />
            <MyTextFieldSimple
                className='col-12 col-md-4'
                nombre='Contraseña Nueva'
                name='password'
                type='password'
            />
            <MyTextFieldSimple
                className='col-12 col-md-4'
                nombre='Confirmar Contraseña Nueva'
                name='password_2'
                type='password'
            />
            <div className="col-12">
                <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    className='ml-3'
                    disabled={submitting || pristine}
                >
                    Cambiar Contraseña
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    onClick={reset}
                    className='ml-3'
                    disabled={submitting || pristine}
                >
                    Limpiar
                </Button>
            </div>
        </form>
    }
);
CambiarPasswordForm = reduxForm({
    form: "cambiarContrasenaForm",
    validate,
    enableReinitialize: true
})(CambiarPasswordForm);

export default CambiarPasswordForm;