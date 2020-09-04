import React, {memo} from 'react';
import {useSelector} from "react-redux";
import {formValueSelector, reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

const selector = formValueSelector('tipoEquipoCampoCRUDForm');
let TipoEquipoCampoCRUDForm = memo(props => {
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
    } = props;
    const myValues = useSelector(state => selector(state, 'tipo', ''));
    let tipo = [
        {id: 'NUMBER', text: 'Número'},
        {id: 'TEXT', text: 'Texto'},
        {id: 'LIST', text: 'Lista'},
    ];
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Etiqueta'
                name='label'
                case='U'/>
            <MyCombobox
                label_space_xs={4}
                label='Tipo Campo'
                className="col-12 col-md-6"
                name='tipo'
                busy={false}
                autoFocus={false}
                data={tipo}
                textField='text'
                filter='contains'
                valuesField='id'
                placeholder='Tipo de Campo...'
            />
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Tamaño'
                name='tamano'
                type='number'
            />
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Tamaño Columna'
                name='tamano_columna'
                type='number'
            />
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Orden del Campo'
                name='orden'
                type='number'
            />
            {myValues.tipo === 'LIST' && <MyTextFieldSimple
                className="col-12 col-md-6"
                multiline={true}
                nombre='Opciones Lista'
                name='opciones_list'
                rows={5}
                case='U'/>}
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Unidad Medida'
                name='unidad_medida'
            />
        </MyFormTagModal>
    )
});

TipoEquipoCampoCRUDForm = reduxForm({
    form: "tipoEquipoCampoCRUDForm",
    validate: validate,
    enableReinitialize: true
})(TipoEquipoCampoCRUDForm);

export default TipoEquipoCampoCRUDForm;