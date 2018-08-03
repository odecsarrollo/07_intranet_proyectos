import React, {Component, Fragment} from 'react';
import AddItemListadoMaterialesForm from './forms/add_item_form';
import RowTabla from './listado_materiales_tabla_fila';

const style = {
    table: {
        tr: {
            td_numero: {
                paddingTop: '1px',
                paddingBottom: '1px',
                fontSize: '0.6rem',
                textAlign: 'right'
            },
            td: {
                paddingTop: '1px',
                fontSize: '0.6rem',
                paddingBottom: '1px'
            },
            th: {
                paddingTop: '1px',
                fontSize: '0.6rem',
                paddingBottom: '1px'
            },
        }
    }
};

class ListadoMateriales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listado_actual: null,
            add_material: false,
        };
        this.onChangeItem = this.onChangeItem.bind(this);
        this.addMaterial = this.addMaterial.bind(this);
    }

    componentDidMount() {
        const {
            items_listados_materiales,
        } = this.props;
        this.setState({listado_actual: items_listados_materiales});
    }

    onChangeItem(fila) {
        this.setState((s) => {
            const listado_cargue_modificado = {...s.listado_actual, [fila.id]: fila};
            return {listado_actual: listado_cargue_modificado}
        });
    }

    onActualizarCambios() {
        const {
            actualizarItemsListadoMateriales,
            literal,
            cargando,
            noCargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        const cambios = this.obtenerCambios();
        actualizarItemsListadoMateriales(
            literal.id,
            cambios,
            (res) => {
                noCargando();
                this.setState({listado_actual: _.mapKeys(res, 'id')})
            },
            notificarErrorAjaxAction
        );
    }

    addMaterial(linea) {
        const {listado_actual} = this.state;
        const {literal} = this.props;
        const id = _.max(_.map(listado_actual, e => e.id));
        const nueva_linea = {
            ...linea,
            id: id + 1,
            cantidad_a_comprar: 0,
            cantidad_reservada_inventario: 0,
            literal_id: literal.id,
            nuevo: true,
        };
        const listado_actual_nuevo = {...listado_actual, [id + 1]: nueva_linea};
        this.setState({listado_actual: listado_actual_nuevo, add_material: false});
    }

    obtenerCambios() {
        const {
            items_listados_materiales,
        } = this.props;

        const {listado_actual} = this.state;

        let con_cambios = {};

        if (!_.isEqual(listado_actual, items_listados_materiales)) {
            con_cambios = _.pickBy(listado_actual, list => {
                return !_.isEqual(list, items_listados_materiales[list.id])
            })
        }

        const para_eliminar = _.map(_.pickBy(con_cambios, e => e.eliminar), e => e);
        const para_adicionar = _.map(_.pickBy(con_cambios, e => e.nuevo), e => e);
        let cambia_fecha = _.map(_.pickBy(con_cambios, e => !e.nuevo && e.cambio_fecha), ele => ele);
        let cambia_cantidad = _.map(_.pickBy(con_cambios, e => !e.nuevo && e.cantidad_anterior), ele => ele);
        let cambia_cantidad_reservada_inventario = _.map(_.pickBy(con_cambios, e => !e.nuevo && e.cantidad_reservada_inventario_anterior), ele => ele);
        let cambia_cantidad_a_comprar = _.map(_.pickBy(con_cambios, e => !e.nuevo && e.cantidad_a_comprar_anterior), ele => ele);

        if (
            cambia_fecha.length === 0 &&
            para_eliminar.length === 0 &&
            cambia_cantidad.length === 0 &&
            para_adicionar.length === 0 &&
            cambia_cantidad_reservada_inventario.length === 0 &&
            cambia_cantidad_a_comprar.length === 0
        ) {
            return null;
        }
        return {
            para_eliminar,
            cambia_fecha,
            cambia_cantidad,
            para_adicionar,
            cambia_cantidad_reservada_inventario,
            cambia_cantidad_a_comprar
        };
    }

    render() {
        const {
            items_listados_materiales,
            literal,
            modo_planeador = false,
            modo_almacen = false,
            modo_compras = false,
        } = this.props;
        const {
            listado_actual,
            add_material,
        } = this.state;
        const mostrar_botones = !modo_almacen && !modo_compras && !modo_planeador;
        const cambios = this.obtenerCambios();
        return (
            <Fragment>
                {
                    mostrar_botones &&
                    <Fragment>
                        {
                            !add_material ?
                                <div>
                                    <button
                                        className='btn btn-primary m-3'
                                        onClick={() => {
                                            this.setState({add_material: true})
                                        }}
                                    >
                                        Adicionar Material
                                    </button>
                                    <button
                                        className='btn btn-primary m-3'
                                        onClick={() => {
                                            this.props.history.push(`/app/proyectos/listado_materiales/planeador_materiales/${literal.id}`)
                                        }}
                                    >
                                        Abrir Planeador
                                    </button>
                                </div> :
                                <AddItemListadoMaterialesForm
                                    onSubmit={(e) => this.addMaterial(e)}
                                    onCancel={() => {
                                        this.setState({add_material: false})
                                    }}
                                />
                        }
                    </Fragment>
                }
                <table style={style.table} className='table table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th></th>
                        <th style={style.table.tr.th}>Id CGUNO</th>
                        <th style={style.table.tr.th}>Codigo</th>
                        <th style={style.table.tr.th}>Descripción</th>
                        <th style={style.table.tr.th}>Material</th>
                        <th style={style.table.tr.th}>Cant. Material</th>
                        <th style={style.table.tr.th}>Proceso</th>
                        <th style={style.table.tr.th}>Acabado</th>
                        <th style={style.table.tr.td_numero}>Cant.</th>
                        <th style={style.table.tr.td_numero}>Reser. Inv</th>
                        <th style={style.table.tr.td_numero}>Compr.</th>
                        <th style={style.table.tr.td_numero}>Falta</th>
                        <th style={style.table.tr.th}>Fecha Requerido</th>
                        <th style={style.table.tr.th}>Elim.</th>
                        <th style={style.table.tr.th}>Eliminado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        _.map(listado_actual, e => {
                            return <RowTabla
                                onChangeItem={this.onChangeItem}
                                key={e.id}
                                fila={e}
                                fila_original={items_listados_materiales[e.id]}
                            />
                        })
                    }
                    </tbody>
                </table>
                {
                    cambios &&
                    <div>
                        <button
                            className='btn btn-primary m-3'
                            onClick={() => this.onActualizarCambios()}
                        >
                            Actualizar
                        </button>
                        <button
                            className='btn btn-primary m-3'
                            onClick={() => {
                                this.setState({listado_actual: items_listados_materiales})
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                }
            </Fragment>
        )
    }
}

export default ListadoMateriales;