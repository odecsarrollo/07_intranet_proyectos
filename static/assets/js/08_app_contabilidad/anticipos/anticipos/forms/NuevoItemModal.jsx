import React, {memo} from 'react';
import {MyTextFieldSimple} from "../../../../00_utilities/components/ui/forms/fields";
import {MyFormTagModal} from "../../../../00_utilities/components/ui/forms/MyFormTagModal";
import {formValueSelector, reduxForm} from "redux-form";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {numeroFormato} from "../../../../00_utilities/common";
import validate from './validate_new_item';

const selector = formValueSelector('nuevoItemModalForm');
let NuevoItemModal = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
    } = props;
    const myValues = useSelector(state => selector(state, 'cantidad', 'valor_unitario', 'descripcion', 'referencia'));
    const {cantidad = 0, valor_unitario = 0} = myValues;

    return <MyFormTagModal
        onCancel={onCancel}
        onSubmit={handleSubmit(onSubmit)}
        reset={reset}
        initialValues={initialValues}
        submitting={submitting}
        modal_open={modal_open}
        pristine={pristine}
        element_type={'Nuevo Item'}
    >
        <MyTextFieldSimple
            className="col-12 col-md-4"
            nombre='Referencia'
            name='referencia'
            case='U'/>
        <MyTextFieldSimple
            className="col-12"
            nombre='Descripción'
            name='descripcion'
            multiline={true}
            rows={4}
            case='U'/>

        <MyTextFieldSimple
            className="col-12 col-md-2"
            nombre='Cantidad'
            name='cantidad'
            type='number'
            case='U'/>

        <MyTextFieldSimple
            className="col-12 col-md-3"
            nombre='Valor Unitario'
            name='valor_unitario'
            type='number'
            case='U'/>
        <div className="col-12">
            {numeroFormato(valor_unitario * cantidad, 2)}
        </div>
        <div style={{height: '300px'}}>

        </div>
    </MyFormTagModal>
});

NuevoItemModal = reduxForm({
    form: "nuevoItemModalForm",
    validate,
    enableReinitialize: true
})(NuevoItemModal);

export default NuevoItemModal;