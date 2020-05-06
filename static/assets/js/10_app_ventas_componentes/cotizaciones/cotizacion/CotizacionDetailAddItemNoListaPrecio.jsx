import React, {memo} from "react";
import Typography from "@material-ui/core/Typography";

import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import BotoneriaModalForm from "../../../00_utilities/components/ui/forms/botoneria_modal_form";
import validate from "./validate_add_item_no_lista_precios";

let Form = memo(props => {
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        initialValues,
        adicionarItem,
        cerrarDialog
    } = props;
    return (
        <div className="col-12">
            <form onSubmit={handleSubmit((v) => {
                adicionarItem(
                    'Otro',
                    v.precio_unitario,
                    v.item_descripcion,
                    v.item_referencia,
                    v.item_unidad_medida,
                    'PERSONALIZADO',
                    null,
                    'PERSONALIZADO',
                    null,
                    null,
                    null,
                    cerrarDialog
                );
            })}>
                <div className="row">
                    <div className="col-12">
                        <MyTextFieldSimple
                            case='U'
                            nombre='Referencia'
                            name='item_referencia'
                            className='col-3 pl-3'
                        />
                        <MyTextFieldSimple
                            case='U'
                            nombre='Descripción'
                            name='item_descripcion'
                            className='col-9 pl-3'
                        />
                        <MyTextFieldSimple
                            case='U'
                            nombre='Unidad Medida'
                            name='item_unidad_medida'
                            className='col-4 pl-3'
                        />
                        <MyTextFieldSimple
                            type='number'
                            nombre='Precio Unitario'
                            name='precio_unitario'
                            className='col-4 pl-3'
                        />
                    </div>
                </div>
                <BotoneriaModalForm
                    mostrar_submit={true}
                    mostrar_limpiar={true}
                    mostrar_cancelar={false}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </form>
        </div>
    )
});


Form = reduxForm({
    form: "adicionarItemPersonalizadoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;