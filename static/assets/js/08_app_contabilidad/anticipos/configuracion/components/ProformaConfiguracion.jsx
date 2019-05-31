import React, {Component} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {
    MyTextFieldSimple,
    MyFieldFileInput,
    MyCheckboxSimple
} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";


class ProformaConfiguracionForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    submitObject(item) {
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
    }

    onSubmit(v) {
        const {item_seleccionado} = this.props;
        this.props.updateProformaConfiguracion(item_seleccionado.id, v)
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            handleSubmit,
            form_values
        } = this.props;
        console.log(form_values)
        return (
            <form onSubmit={handleSubmit(v => this.onSubmit(this.submitObject(v)))}>
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
                        className="col-12 col-md-6"
                        nombre='Información Bancaria'
                        name='informacion_bancaria'
                        case='U'
                        multiline
                        rows={4}
                    />
                    {
                        initialValues && initialValues.encabezado &&
                        <div className="col-12">
                            <img style={{height: '200px', width: '280px'}} src={initialValues.encabezado}></img>
                            <MyCheckboxSimple nombre='Borrar Encabezado?' name='borrar_encabezado'/>
                        </div>
                    }
                    {
                        initialValues && !initialValues.encabezado &&
                        <div className="col-12">
                            Encabezado
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
    }
}

const selector = formValueSelector('proformaConfiguracionForm');

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const form_values = selector(state, 'pais', 'departamento');
    return {
        initialValues: item_seleccionado,
        form_values
    }
}

ProformaConfiguracionForm = reduxForm({
    form: "proformaConfiguracionForm",
    enableReinitialize: true
})(ProformaConfiguracionForm);

export default (connect(mapPropsToState, null)(ProformaConfiguracionForm));