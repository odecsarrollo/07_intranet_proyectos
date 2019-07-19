import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyFieldFileInput,
    MyCheckboxSimple
} from '../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../01_actions/01_index';
import BotoneriaModalForm from "../../../00_utilities/components/ui/forms/botoneria_modal_form";

let ProformaConfiguracionForm = memo(props => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchProformaConfiguracion());
        return () => {
            dispatch(actions.clearProformaConfiguracion());
        };
    }, []);

    const {
        pristine,
        submitting,
        reset,
        initialValues,
        handleSubmit
    } = props;

    const onSubmit = (v) => {
        if (initialValues.id) {
            return dispatch(actions.updateProformaConfiguracion(initialValues.id, v))
        }
    };
    const submitObject = (item) => {
        let datos_formulario = _.omit(item, 'firma');
        datos_formulario = _.omit(datos_formulario, 'encabezado');
        let datos_a_subir = new FormData();
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.firma) {
            if (typeof item.firma !== 'string') {
                datos_a_subir.append('firma', item.firma[0]);
            }
        }
        if (item.encabezado) {
            if (typeof item.encabezado !== 'string') {
                datos_a_subir.append('encabezado', item.encabezado[0]);
            }
        }
        return datos_a_subir;
    };
    if(!initialValues){
        return <div>Cargando</div>
    }
    return (
        <form onSubmit={handleSubmit(v => {
            return onSubmit(submitObject(v))
        })}>
            <div className="row">
                {/*<MyTextFieldSimple*/}
                {/*    className="col-12 col-md-6"*/}
                {/*    nombre='Información Odecopack'*/}
                {/*    name='informacion_odecopack'*/}
                {/*    case='U'*/}
                {/*    multiline*/}
                {/*    rows={4}*/}
                {/*/>*/}
                <MyTextFieldSimple
                    className="col-12 col-md-6 pr-3"
                    nombre='Email Copia por defecto'
                    name='email_copia_default'
                    case='U'
                    type='email'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 pr-3"
                    nombre='Email Copia por defecto'
                    name='email_from_default'
                    case='U'
                    type='email'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 pr-3"
                    nombre='Información Bancaria'
                    name='informacion_bancaria'
                    case='U'
                    multiline
                    rows={4}
                />
                {
                    initialValues && initialValues.encabezado &&
                    <div className="col-12">
                        <img style={{width: '100%'}} src={initialValues.encabezado}></img>
                        <MyCheckboxSimple nombre='Borrar Encabezado?' name='borrar_encabezado'/>
                    </div>
                }
                {
                    initialValues && !initialValues.encabezado &&
                    <div className="col-12">
                        Encabezado (1190x228):
                        <MyFieldFileInput
                            name="encabezado"
                            accept="image/png, image/jpeg"
                        />
                    </div>
                }
                {
                    initialValues && initialValues.firma &&
                    <div className="col-12">
                        <img src={initialValues.firma}></img>
                        <MyCheckboxSimple nombre='Borrar Firma?' name='borrar_firma'/>
                    </div>
                }
                {
                    initialValues && !initialValues.firma &&
                    <div className="col-12">
                        Firma:
                        <MyFieldFileInput
                            name="firma"
                            accept="image/png, image/jpeg"
                        />
                    </div>
                }
                <BotoneriaModalForm
                    mostrar_submit={true}
                    mostrar_limpiar={true}
                    mostrar_cancelar={false}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </div>
        </form>
    )
});

ProformaConfiguracionForm = reduxForm({
    form: "proformaConfiguracionForm",
    enableReinitialize: true
})(ProformaConfiguracionForm);

export default ProformaConfiguracionForm;