import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import Combobox from 'react-widgets/lib/Combobox';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_hoja';
import moment from "moment-timezone";

class Form extends Component {
    componentDidMount() {
        this.props.fetchConfiguracionesCostos()
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
            colaboradores_list,
            permisos_object,
            configuracion_costos,
        } = this.props;
        const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
        let fecha_cierre_costos = new Date(1900, 0, 1);

        if (configuracion_costos) {
            const cierre_costos = moment(configuracion_costos.fecha_cierre).tz('America/Bogota').toDate();
            fecha_cierre_costos = new Date(cierre_costos.getFullYear(), cierre_costos.getMonth(), cierre_costos.getDate())
        }

        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => {
                    if (!permisos_object.add_para_otros) {
                        if (mi_cuenta.colaborador) {
                            onSubmit({...v, colaborador: mi_cuenta.colaborador.id})
                        }
                    } else {
                        onSubmit(v)
                    }
                })}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                {
                    permisos_object.add_para_otros &&
                    <MyCombobox
                        data={_.map(_.pickBy(_.orderBy(colaboradores_list, ['nombres'], ['asc']), a => {
                            return (
                                a.autogestion_horas_trabajadas === false ||
                                a.usuario === mi_cuenta.id
                            )
                        }), e => {
                            return (
                                {
                                    id: e.id,
                                    nombre: `${e.nombres} ${e.apellidos}`
                                }
                            )
                        })}
                        className='col-12'
                        valuesField='id'
                        textField='nombre'
                        autoFocus={true}
                        name='colaborador'
                        placeholder='Colaborador'
                        filter='contains'
                    />
                }
                <MyDateTimePickerField
                    min={fecha_cierre_costos}
                    className='col-12 mb-5'
                    name='fecha'
                    nombre='Fecha'
                    dropUp={false}
                />
                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado,
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0]
    }
}

Form = reduxForm({
    form: "hojaTrabajoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;