import React, {memo, Fragment} from 'react';
import {MyTextFieldSimple} from "../../../../../../00_utilities/components/ui/forms/fields";

const ContactoFormBase = memo(props => {
    return (
        <Fragment>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Nombres'
                name='nombres'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Apellidos'
                name='apellidos'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Telefono'
                name='telefono'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Telefono 2'
                name='telefono_2'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Correo'
                name='correo_electronico'
                case='U'/>
            <div className="col-12">
                <div className="row">
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Pais'
                        name='pais'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Ciudad'
                        name='ciudad'
                        case='U'/>
                </div>
            </div>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Correo 2'
                name='correo_electronico_2'
                case='U'/>
            <MyTextFieldSimple
                className="col-12"
                nombre='Cargo'
                name='cargo'
                case='U'/>
        </Fragment>
    )
});

export default ContactoFormBase;