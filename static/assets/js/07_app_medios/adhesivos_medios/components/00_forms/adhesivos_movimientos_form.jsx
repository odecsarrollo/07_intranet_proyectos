import React, {useEffect, memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

import validate from './validate_movimiento_adhesivo';

const selector = formValueSelector('adhesivosMovimientosForm');

let Form = memo((props) => {
    const {
        pristine,
        submitting,
        reset,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchAdhesivosMedios());
        return () => dispatch(actions.clearAdhesivoMedios());
    }, []);
    const adhesivos = useSelector(state => state.medios_adhesivos);
    const tipo = useSelector(state => selector(state, 'tipo'));
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <div className="col-12">
                <MyCombobox
                    data={[{id: 'E', tipo: 'Entrada'}, {id: 'S', tipo: 'Salida'}]}
                    valuesField='id'
                    textField='tipo'
                    autoFocus={true}
                    name='tipo'
                    placeholder='Tipo de Movimiento'
                    filter='contains'
                />
                <MyCombobox
                    data={_.map(adhesivos, e => {
                        return {
                            'codigo': `${e.codigo} - ${e.descripcion} - ${e.disponible} Disponibles`,
                            'id': e.id
                        }
                    })}
                    name='adhesivo'
                    autoFocus={true}
                    textField='codigo'
                    filter='contains'
                    valuesField='id'
                    placeholder='Seleccione el Adhesivos'
                />
                <MyTextFieldSimple
                    className="col-6"
                    nombre='Cantidad'
                    name='cantidad'
                    type="number"
                />
                {tipo === 'S' &&
                <MyTextFieldSimple
                    className="col-6"
                    nombre='Responsable'
                    name='responsable'
                    type='text'
                />
                }
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Descripcion'
                    name='descripcion'
                    multiline
                    rows="4"
                />
            </div>
        </MyFormTagModal>
    )

});

Form = reduxForm({
    form: "adhesivosMovimientosForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;