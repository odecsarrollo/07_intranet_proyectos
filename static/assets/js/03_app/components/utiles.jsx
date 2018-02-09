import React from 'react';
import PropTypes from "prop-types";
import TextField from 'material-ui/TextField';

export const SinPermisos = (props) => {
    const {mis_permisos, can_see} = props;
    if (!mis_permisos) {
        return (<div>Cargando...</div>)
    }
    else if (can_see) {
        return (<div>{`No tiene suficientes permisos para ver ${props.nombre}.`}</div>)
    }
    return props.children;
};
SinPermisos.propTypes = {
    can_see: PropTypes.bool,
    nombre: PropTypes.string,
    mis_permisos: PropTypes.any.isRequired
};

export const ListaTitulo = (props) => {
    return (
        <div>
            <h3 className="h3-responsive">{props.titulo}</h3>
            {
                props.can_add &&
                <button
                    className="btn btn-primary"
                    style={{cursor: "pointer"}}
                    onClick={props.onClick}
                >
                    <i className="fas fa-plus"
                       aria-hidden="true"></i>
                </button>
            }
        </div>
    )
};
ListaTitulo.propTypes = {
    titulo: PropTypes.string
};


export const ListaBusqueda = (props) => {
    return (
        <TextField
            floatingLabelText="A buscar"
            fullWidth={true}
            onChange={props.onChange}
            autoComplete="off"
            value={props.busqueda}
        />
    )
};
ListaBusqueda.propTypes = {
    busqueda: PropTypes.string,
    onChange: PropTypes.func
};