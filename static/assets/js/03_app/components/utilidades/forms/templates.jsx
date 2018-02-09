import React from 'react';
import BotoneriaForm from "../../../components/utilidades/forms/botoneria_form";
import PropTypes from "prop-types";

export const MyFormTag = (props) => {
    return (
        <form className="card" onSubmit={props.onSubmit}>
            <div className="m-2">
                <h5 className="h5-responsive mt-2">{props.initialValues ? 'Editar ' : 'Crear '} {props.nombre}</h5>
                <div className="row">
                    {props.children}
                    <BotoneriaForm
                        texto_botones={props.nombre}
                        pristine={props.pristine}
                        submitting={props.submitting}
                        reset={props.reset}
                        initialValues={props.initialValues}
                        onCancel={props.onCancel}
                        onDelete={props.onDelete}
                        can_delete={props.can_delete}
                    />
                </div>
            </div>
        </form>
    )
};
MyFormTag.propTypes = {
    nombre: PropTypes.string,
    onSubmit: PropTypes.func
};