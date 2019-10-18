import React from 'react';
import {
    MyTextFieldSimple,
    MyCheckboxSimple
} from '../../../../00_utilities/components/ui/forms/fields';


const BaseProyectoForm = (props) => {
    const {initialValues = null} = props;
    return (
        <div className="row">
            {!initialValues || !initialValues.en_cguno &&
            <MyTextFieldSimple
                className="col-12"
                nombre='OP Proyecto'
                name='id_proyecto'
                case='U'/>}
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Proyecto'
                name='nombre'
                case='U'/>
            <MyCheckboxSimple
                className="col-12"
                nombre='Abierto'
                name='abierto'/>
        </div>
    )
};

export default BaseProyectoForm;