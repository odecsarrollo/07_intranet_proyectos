import React from 'react';
import PropTypes from "prop-types";
import TextField from 'material-ui/TextField';
import Loading from '../components/utilidades/loading_overlay';

export const SinPermisos = (props) => {
    const {mis_permisos, can_see, cargando} = props;
    if (can_see || !mis_permisos) {
        return (
            <Loading cargando={!mis_permisos || cargando}>
                {props.children}
            </Loading>
        );
    } else {
        return (<div>{`No tiene suficientes permisos para ver ${props.nombre}.`}</div>)
    }
};
SinPermisos.propTypes = {
    can_see: PropTypes.bool,
    cargando: PropTypes.bool,
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