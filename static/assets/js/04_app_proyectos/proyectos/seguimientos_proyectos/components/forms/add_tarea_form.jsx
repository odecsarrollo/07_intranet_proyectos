import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {
    MyTextFieldSimple,
    MyDateTimePickerField,
    MyCombobox
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {mostrar_mas: false}
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
            miembros_literales_list
        } = this.props;
        const miembros = _.map(miembros_literales_list, e => {
            return (
                {
                    id: e.usuario,
                    nombre: `${e.colaborador}`
                }
            )
        });
        const {mostrar_mas} = this.state;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="m-2">
                    <h4>{initialValues ? 'Editar Tarea' : 'Nueva Tarea'}</h4>
                    <div className="row">
                        <MyTextFieldSimple
                            className='col-11'
                            nombre='Descripción'
                            name='descripcion'
                        />
                        <FontAwesomeIcon
                            className='puntero'
                            icon={`${mostrar_mas ? 'minus' : 'plus'}-circle`}
                            onClick={() => this.setState(s => {
                                return {mostrar_mas: !s.mostrar_mas}
                            })}
                        />
                        {
                            mostrar_mas &&
                            <Fragment>
                                <MyTextFieldSimple
                                    className='col-11'
                                    nombre='Opcional 1'
                                    name='campo_uno'
                                />
                                <MyTextFieldSimple
                                    className='col-11'
                                    nombre='Opcional 2'
                                    name='campo_dos'
                                />
                                <MyTextFieldSimple
                                    className='col-11'
                                    nombre='Opcional 3'
                                    name='campo_tres'
                                />
                            </Fragment>
                        }
                        <MyDateTimePickerField
                            className='col-12  col-sm-6'
                            label='Fecha Inicial'
                            label_space_xs={4}
                            name='fecha_inicial'
                            max={new Date(2999, 12, 31)}
                        />
                        <MyDateTimePickerField
                            className='col-12 col-sm-6'
                            label='Fecha Límite'
                            label_space_xs={4}
                            name='fecha_limite'
                            max={new Date(2999, 12, 31)}
                        />
                        <MyCombobox
                            className='col-12'
                            name='asignado_a'
                            data={[{id: null, nombre: 'SIN DEFINIR'}, ...miembros]}
                            placeholder='Seleccionar Asignado'
                            valueField='id'
                            textField='nombre'
                            filter='contains'
                        />
                        <div style={{height: '300px'}}>

                        </div>
                    </div>
                </div>
                <BotoneriaModalForm
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </form>
        )
    }
}

Form = reduxForm({
    form: "addTareaSeguimientoForm",
    enableReinitialize: true
})(Form);


export default Form;