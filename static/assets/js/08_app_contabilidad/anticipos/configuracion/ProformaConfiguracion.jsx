import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {PROFORMAS_ANTICIPOS_CONFIGURACION} from "../../../permisos";
import {
    MyTextFieldSimple,
    MyFieldFileInput,
    MyCheckboxSimple
} from '../../../00_utilities/components/ui/forms/fields';
import {useDispatch} from "react-redux";
import * as actions from '../../../01_actions/01_index';
import BotoneriaModalForm from "../../../00_utilities/components/ui/forms/botoneria_modal_form";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import ValidarPermisos from "../../../permisos/validar_permisos";

let ProformaConfiguracionForm = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(PROFORMAS_ANTICIPOS_CONFIGURACION);
    const {change, detail} = permisos;
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
    if (!initialValues) {
        return <div>Cargando</div>
    }
    return (
        <ValidarPermisos can_see={change || detail} nombre={'Configuración Proforma'}>
            <form onSubmit={handleSubmit(v => {return onSubmit(submitObject(v))})}>
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
                        disabled={!change}
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6 pr-3"
                        nombre='Email From por Defecto'
                        name='email_from_default'
                        case='U'
                        type='email'
                        disabled={!change}
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6 pr-3"
                        nombre='Información Bancaria'
                        name='informacion_bancaria'
                        case='U'
                        multiline
                        rows={4}
                        disabled={!change}
                    />
                    {
                        initialValues && initialValues.encabezado &&
                        <div className="col-12">
                            <img style={{width: '100%'}} src={initialValues.encabezado}></img>
                            {change && <MyCheckboxSimple label='Borrar Encabezado?' name='borrar_encabezado'/>}
                        </div>
                    }
                    {
                        initialValues && !initialValues.encabezado && change &&
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
                            {change && <MyCheckboxSimple label='Borrar Firma?' name='borrar_firma'/>}
                        </div>
                    }
                    {
                        initialValues && !initialValues.firma && change &&
                        <div className="col-12">
                            Firma:
                            <MyFieldFileInput
                                name="firma"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    }
                    {change &&
                    <BotoneriaModalForm
                        mostrar_submit={true}
                        mostrar_limpiar={true}
                        mostrar_cancelar={false}
                        pristine={pristine}
                        reset={reset}
                        submitting={submitting}
                        initialValues={initialValues}
                    />
                    }
                </div>
            </form>
        </ValidarPermisos>
    )
});

ProformaConfiguracionForm = reduxForm({
    form: "proformaConfiguracionForm",
    enableReinitialize: true
})(ProformaConfiguracionForm);

export default ProformaConfiguracionForm;