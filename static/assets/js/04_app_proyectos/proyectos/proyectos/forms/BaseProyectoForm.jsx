import React from 'react';
import {
    MyTextFieldSimple,
    MyCheckboxSimple, MyCombobox
} from '../../../../00_utilities/components/ui/forms/fields';


const BaseProyectoForm = (props) => {
    const {initialValues} = props;
    console.log(initialValues)
    return (
        <div className="row">
            {initialValues &&
            !initialValues.en_cguno && <MyTextFieldSimple
                className="col-12"
                nombre='OP Proyecto'
                name='id_proyecto'
                case='U'/>}
            {!initialValues && <MyCombobox
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