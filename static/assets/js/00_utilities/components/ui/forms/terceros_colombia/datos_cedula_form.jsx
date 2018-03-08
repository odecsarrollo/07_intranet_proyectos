import React, {Component, Fragment} from 'react';

import {MySelectField, MyRadioButtonGroup, MyDateTimePickerField, MyTextFieldSimple} from '../fields';

export default class DatosCedulaForm extends Component {
    render() {
        return (
            <Fragment>
                <div className="col-12">
                    <h4>Información Personal</h4>
                </div>

                <MyTextFieldSimple
                    className='col-12 col-md-6 col-xl-3'
                    nombre='Nombre'
                    name='nombre'
                    case='U'
                />

                <MyTextFieldSimple
                    className='col-12 col-md-6 col-xl-3'
                    nombre='Segundo Nombre'
                    name='nombre_segundo'
                    case='U'
                />

                <MyTextFieldSimple
                    className='col-12 col-md-6 col-xl-3'
                    nombre='Apellido'
                    name='apellido'
                    case='U'
                />

                <MyTextFieldSimple
                    className='col-12 col-md-6 col-xl-3'
                    nombre='Segundo Apellido'
                    name='apellido_segundo'
                    case='U'
                />
                <MySelectField
                    className="col-12 col-md-6 col-xl-3"
                    name="tipo_documento"
                    nombre='Tipo de documento'
                    options={[
                        {value: "CC", primaryText: "Cédula Ciudadania"},
                        {value: "CE", primaryText: "Cédula Extrangería"},
                        {value: "PS", primaryText: "Pasaporte"},
                        {value: "TI", primaryText: "Tarjeta de Identidad"},
                    ]}
                />
                <MyTextFieldSimple
                    className='col-12 col-md-6 col-xl-3'
                    nombre='Nro. Identificación'
                    name='nro_identificacion'
                />
                <MySelectField
                    className="col-12 col-md-6"
                    name="grupo_sanguineo"
                    nombre='Grupo Sanguineo'
                    options={[
                        {value: "APOSITIVO", primaryText: "A Positivo"},
                        {value: "OPOSITIVO", primaryText: "O Positivo"},
                        {value: "ONEGATIVO", primaryText: "O Negativo"},
                        {value: "ANEGATIVO", primaryText: "A Negativo"},
                    ]}
                />
                <div className="col-12">
                    <div className="row">
                        <MyDateTimePickerField
                            className="col-12 col-lg-6"
                            nombre='Fecha de Nacimiento'
                            name='fecha_nacimiento'
                            show_edad={true}
                        />
                        <MyRadioButtonGroup
                            className="col-12 col-lg-6"
                            nombre='Genero'
                            name='genero'
                            options={[
                                {value: "M", label: "Masculino"},
                                {value: "F", label: "Femenino"}
                            ]}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
