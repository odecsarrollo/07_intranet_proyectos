import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import moment from "moment-timezone";
import PrinJs from 'print-js';
import Button from "@material-ui/core/Button";
import NuevoItemModal from './NuevoItemModal';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_adicionar_item: false
        }
    }


    imprimirCobro() {
        const {initialValues} = this.props;
        const imprimir_liquidacion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        this.props.printCobroProformaAnticipo(initialValues.id, {callback: imprimir_liquidacion});
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit,
            modal_open,
            singular_name,
        } = this.props;
        const {show_adicionar_item} = this.state;
        return (
            <MyFormTagModal
                fullScreen={true}
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => onSubmit(
                    {...v, fecha: moment(v.fecha).format('YYYY-MM-DD')},
                    null,
                    null,
                    false
                ))
                }
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    className="col-12 col-md-6 col-lg-4"
                    data={[
                        {id: 'USD', nombre: 'USD'},
                        {id: 'EUR', nombre: 'EUR'},
                    ]}
                    filter='contains'
                    placeholder='Tipo Divisa'
                    valueField='id'
                    textField='nombre'
                    name='divisa'
                />
                <MyCombobox
                    className="col-12 col-md-6 col-lg-4"
                    data={[
                        {id: 'PROFORMA', nombre: 'Proforma'},
                        {id: 'CUENTA_COBRO', nombre: 'Cuenta Cobro'},
                    ]}
                    filter='contains'
                    placeholder='Tipo Documento'
                    valueField='id'
                    textField='nombre'
                    name='tipo_documento'
                />
                <MyDateTimePickerField
                    className='col-12 col-md-6 col-lg-4'
                    name='fecha'
                    nombre='Fecha'
                    dropUp={false}
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-4 pr-4"
                    nombre='Nombre Cliente'
                    name='nombre_cliente'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-3 pr-3"
                    nombre='Nit'
                    name='nit'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-2 pr-3"
                    nombre='Nro. Orden Compra'
                    name='nro_orden_compra'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-3 pr-2"
                    nombre='Condición Pago'
                    name='condicion_pago'
                />
                <div className='col-12'>
                    <div className="row">
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-6  pr-3"
                            nombre='Cliente'
                            name='informacion_cliente'
                            case='U'/>
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-6  pr-3"
                            nombre='Locatario'
                            name='informacion_locatario'
                            case='U'/>
                    </div>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">Items:
                            <FontAwesomeIcon
                                className='puntero'
                                icon={'plus-circle'}
                                onClick={() => this.setState(s => ({show_adicionar_item: !s.show_adicionar_item}))}
                            />
                        </div>
                        <MyTextFieldSimple
                            className="col-12 col-md-6 pr-3"
                            nombre='Impuesto'
                            name='impuesto'
                            case='U'
                            type='number'
                        />
                    </div>
                </div>
                {
                    show_adicionar_item &&
                    <div className='col-12'>
                        <NuevoItemModal
                            is_open={show_adicionar_item}
                            onCancel={() => this.setState({show_adicionar_item: false})}
                        />
                    </div>
                }
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">Destinatario Correo:</div>
                        <MyTextFieldSimple
                            className="col-12 col-md-6 pr-3"
                            nombre='Email Destino'
                            name='email_destinatario'
                            case='U'
                            type='email'
                        />
                        <MyTextFieldSimple
                            className="col-12 col-md-6 pr-3"
                            nombre='Email Destino Dos'
                            name='email_destinatario_dos'
                            case='U'
                            type='email'
                        />
                    </div>
                </div>
                <div className="col-12">
                    <Button
                        color="primary"
                        onClick={() => this.imprimirCobro()}
                    >
                        Imprimir Comprobante
                    </Button>
                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "proformaAnticipoForm",
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;