import React, {Component} from 'react';
import {fechaFormatoDos, permisosAdapter, pesosColombianos, numeroFormato} from '../../../../00_utilities/common';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {
    PROYECTOS as permisos_view
} from "../../../../00_utilities/permisos/types";

const ItemTabla = (props) => {
    const {item, item: {item_biable}, ultimo_costo_item_biable} = props;
    return (
        <tr>
            <td>{fechaFormatoDos(item.lapso)}</td>
            <td>{item_biable.id_item}</td>
            <td>{item_biable.id_referencia}</td>
            <td>{item_biable.descripcion}</td>
            <td>{numeroFormato(item.cantidad)}</td>
            <td>{item_biable.unidad_medida_inventario}</td>
            {ultimo_costo_item_biable && <td>{pesosColombianos(item.costo_total)}</td>}
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            item.item_biable && (
                item.item_biable.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_referencia.toUpperCase().includes(busqueda.toUpperCase()) ||
                fechaFormatoDos(item.lapso).toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
            )
        )
    });
};

class TablaProyectosLiteralesMateriales extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.clearItemsLiterales();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.cargarDatos(nextProps.id_literal);
        }
    }

    componentDidMount() {
        const {id_literal} = this.props;
        this.cargarDatos(id_literal);
    }

    cargarDatos(id_literal) {
        this.props.fetchItemsLiterales(id_literal);
    }

    render() {
        const {
            mis_permisos,
            items_literales
        } = this.props;
        const permisos = permisosAdapter(permisos_view);
        return (
            <ListaBusqueda>
                {
                    busqueda => {
                        const listado_materiales = buscarBusqueda(_.orderBy(items_literales, ['lapso'], ['desc']), busqueda);
                        return (
                            <table className="table table-responsive table-striped tabla-maestra">
                                <thead>
                                <tr>
                                    <th>Lapso</th>
                                    <th>Id CGUNO</th>
                                    <th>Referencia</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Unidad</th>
                                    {permisos.ultimo_costo_item_biable && <th>Costo Total</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {_.map(listado_materiales, item => {
                                    return <ItemTabla
                                        key={item.id}
                                        item={item}
                                        ultimo_costo_item_biable={permisos.ultimo_costo_item_biable}
                                        {...this.props}
                                    />
                                })}
                                </tbody>
                                <tfoot>

                                </tfoot>
                            </table>
                        )
                    }
                }
            </ListaBusqueda>
        );
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        items_literales: state.items_literales,
    }
}

export default connect(mapPropsToState, actions)(TablaProyectosLiteralesMateriales)