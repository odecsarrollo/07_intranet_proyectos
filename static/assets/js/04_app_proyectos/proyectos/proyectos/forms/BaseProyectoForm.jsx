import React from 'react';
import {
    MyTextFieldSimple,
    MyCheckboxSimple, MyCombobox
} from '../../../../00_utilities/components/ui/forms/fields';


const BaseProyectoForm = (props) => {
    const {initialValues, myValues} = props;
    //proyecto_id
    return (
        <div className="row">
            {((initialValues && !initialValues.id) || !initialValues) && <MyCheckboxSimple
                className="col-12"
                label='Consecutivo Automático'
                name='nro_automatico'/>}
            {(initialValues &&
                initialValues.id_proyecto &&
                !initialValues.en_cguno) || (myValues && !myValues.nro_automatico) && <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='OP Proyecto'
                name='id_proyecto'
                case='U'/>}
            {
                myValues && myValues.nro_automatico &&
                <MyCombobox
                    label='Tipo de Proyecto'
                    label_space_xs={5}
                    className="col-12"
                    data={[
                        {id: 'OP', nombre: 'OP'},
                        {id: 'OS', nombre: 'OS'},
                        {id: 'OO', nombre: 'OO'},
                    ]}
                    filter='contains'
                    placeholder='Seleccionar Tipo de Proyecto...'
                    valueField='id'
                    textField='nombre'
                    name='tipo_id_proyecto'
                />}
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Nro. Cotización Componentes'
                name='cotizacion_componentes_nro_cotizacion'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Nro. Orden Compra'
                name='cotizacion_componentes_nro_orden_compra'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Precio Venta Componente'
                name='cotizacion_componentes_precio_venta'
                type='number'/>
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Proyecto'
                name='nombre'
                case='U'/>
            {initialValues && <MyCheckboxSimple
                className="col-12"
                label='Abierto'
                name='abierto'/>}
        </div>
    )
};

export default BaseProyectoForm;