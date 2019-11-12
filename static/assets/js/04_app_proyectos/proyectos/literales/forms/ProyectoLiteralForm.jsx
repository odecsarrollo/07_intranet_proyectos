import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import BaseFormLiteral from './base_form';
import validate from './validate';
import {pesosColombianos, fechaFormatoUno} from "../../../../00_utilities/common";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';


let Form = memo((props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onDelete,
        handleSubmit,
        onSubmit,
        onCancel
    } = props;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {!initialValues.en_cguno && <div className="row">
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Literal'
                    name='id_literal'
                    case='U'/>
            </div>}
            <BaseFormLiteral initialValues={initialValues}/>
            <BotoneriaModalForm
                onCancel={onCancel}
                pristine={pristine}
                reset={reset}
                submitting={submitting}
                initialValues={initialValues}
            />
            {initialValues.valor_cliente && <div className='col-md-12'>
                        <span>
                            <strong>Precio Orden Compra: </strong>
                            {pesosColombianos(initialValues.valor_cliente)}
                            </span>
            </div>}
            {initialValues.orden_compra_nro && <div className='col-md-12'>
                <span>
                    <strong>Nro Orden Compra: </strong>
                    {initialValues.orden_compra_nro}
                </span>
            </div>}
            {initialValues.orden_compra_fecha && <div className='col-md-12'>
                    <span>
                        <strong>Fecha Orden Compra: </strong>
                        {fechaFormatoUno(initialValues.orden_compra_fecha)}
                    </span>
            </div>}
            {initialValues.fecha_entrega_pactada && <div className='col-md-12'>
                <span>
                    <strong>Fecha Entrega Pactada: </strong>
                    {fechaFormatoUno(initialValues.fecha_entrega_pactada)}
                </span>
            </div>}
            {!initialValues.en_cguno && <div className='col-12 text-right'>
                <MyDialogButtonDelete
                    onDelete={() => {
                        onDelete(initialValues)
                    }}
                    element_name={initialValues.id_literal}
                    element_type='Literal'
                    tamano_icono={'2x'}
                />
            </div>}
        </form>
    )
});

Form = reduxForm({
    form: "literalEditForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;