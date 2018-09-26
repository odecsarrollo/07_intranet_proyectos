import React, {Fragment, Component} from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";

const ItemTablaCentroCosto = (props) => {
    const {item} = props;
    return (
        <tr>
            <td>{item.nombre}</td>
            <td>{pesosColombianos(item.costo_total)}</td>
            <td>{Math.floor(item.total_minutos / 60)} horas y {item.total_minutos % 60} minutos</td>
        </tr>
    )
};

const ItemTablaManoObra = (props) => {
    const {item} = props;
    const style_inicial = {backgroundColor: 'black', color: 'white', fontWeight: 'bold'};
    return (
        <tr style={item.inicial ? style_inicial : null}>
            <td>{item.colaborador_nombre}</td>
            <td>{item.centro_costo_nombre}</td>
            <td>{item.fecha}</td>
            <td>{item.horas} horas y {item.minutos} minutos</td>
            <td>{pesosColombianos(item.tasa_valor_hora)}</td>
            <td>{pesosColombianos(item.costo_total)}</td>
            <td>{item.verificado && <i className='fas fa-check-circle' style={{color: 'green'}}></i>}</td>
            <td>{item.inicial && <i className='fas fa-check-circle' style={{color: 'green'}}></i>}</td>
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            (item.colaborador_nombre && item.colaborador_nombre.toUpperCase().includes(busqueda.toUpperCase())) ||
            (item.inicial && busqueda.toUpperCase().includes('INICIAL')) ||
            (item.centro_costo_nombre && item.centro_costo_nombre.toUpperCase().includes(busqueda.toUpperCase()))
        )
    });
};

class TablaProyectosLiteralesManoObra extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.clearHorasColaboradoresProyectosIniciales();
        this.props.clearHorasHojasTrabajos();
    }

    componentDidMount() {
        const {id_literal} = this.props;
        this.cargarDatos(id_literal);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.cargarDatos(nextProps.id_literal);
        }
    }

    cargarDatos(id_literal) {
        const {
            notificarErrorAjaxAction,
            fetchHorasColaboradoresProyectosInicialesxLiteral,
            fetchHorasHojasTrabajosxLiteral,
            noCargando,
        } = this.props;
        const cargarHorasManoObraInicialLiteral = () => fetchHorasColaboradoresProyectosInicialesxLiteral(id_literal, () => noCargando(), notificarErrorAjaxAction);
        fetchHorasHojasTrabajosxLiteral(id_literal, () => cargarHorasManoObraInicialLiteral(), notificarErrorAjaxAction);
    }

    render() {
        const {horas_hojas_trabajos_list, horas_colaboradores_proyectos_iniciales_list} = this.props;
        const union_cc = _.map(horas_hojas_trabajos_list, e => {
            return {
                cc_nombre: e.centro_costo_nombre,
                costo_total: e.costo_total,
                cantidad_minutos: e.cantidad_minutos
            }
        });
        const union_inicial_cc = _.map(horas_colaboradores_proyectos_iniciales_list, e => {
            return {
                cc_nombre: e.centro_costo_nombre,
                costo_total: Number(e.valor),
                cantidad_minutos: e.cantidad_minutos
            }
        });
        const todas_horas_x_centro_costo = _.concat(union_cc, union_inicial_cc);
        let centros_costos_list = _.groupBy(todas_horas_x_centro_costo, 'cc_nombre');
        let otro = [];
        _.mapKeys(centros_costos_list, (v, k) => {
            otro = [...otro, {horas: v, nombre: k}]
        });
        centros_costos_list = otro.map(e => {
            return {
                nombre: e.nombre,
                costo_total: _.sumBy(e.horas, h => h.costo_total),
                total_minutos: _.sumBy(e.horas, h => h.cantidad_minutos)
            }
        });


        const union_horas = _.map(horas_hojas_trabajos_list, e => {
            return {
                id: `e${e.id}`,
                colaborador_nombre: e.colaborador_nombre,
                centro_costo_nombre: e.centro_costo_nombre,
                fecha: fechaFormatoUno(e.fecha),
                horas: e.horas,
                minutos: e.minutos,
                tasa_valor_hora: e.tasa_valor_hora,
                costo_total: e.costo_total,
                verificado: e.verificado,
                inicial: false,
            }
        });


        const union_horas_iniciales = _.map(horas_colaboradores_proyectos_iniciales_list, e => {
            return {
                id: `i${e.id}`,
                colaborador_nombre: e.colaborador_nombre,
                centro_costo_nombre: e.centro_costo_nombre,
                fecha: 'Inicial',
                horas: e.horas,
                minutos: e.minutos,
                tasa_valor_hora: e.valor / (((e.horas * 60) + e.minutos) / 60),
                costo_total: e.valor,
                verificado: true,
                inicial: true,
            }
        });

        const todas_horas = _.concat(union_horas, union_horas_iniciales);
        return (
            <Fragment>
                <table className="table table-responsive table-striped tabla-maestra">
                    <thead>
                    <tr>
                        <th>Centro de Costo</th>
                        <th>Costo Total</th>
                        <th>Tiempo Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {centros_costos_list.map(e => <ItemTablaCentroCosto key={e.nombre} item={e}/>)}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
                <ListaBusqueda>
                    {
                        busqueda => {
                            const listado_mano_obra = buscarBusqueda(todas_horas, busqueda);
                            return (
                                <table className="table table-responsive table-striped tabla-maestra">
                                    <thead>
                                    <tr>
                                        <th>Colaborador</th>
                                        <th>Centro de Costo</th>
                                        <th>Fecha</th>
                                        <th>Tiempo</th>
                                        <th>Valor Hora</th>
                                        <th>Costo Total</th>
                                        <th>Estado</th>
                                        <th>Inicial</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {_.map(_.orderBy(listado_mano_obra, ['inicial', 'fecha', 'colaborador_nombre'], ['asc', 'desc', 'asc']), item => {
                                        return <ItemTablaManoObra key={item.id} item={item} {...this.props}/>
                                    })}
                                    </tbody>
                                    <tfoot>

                                    </tfoot>
                                </table>
                            )
                        }
                    }
                </ListaBusqueda>
            </Fragment>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        horas_hojas_trabajos_list: state.horas_hojas_trabajos,
        horas_colaboradores_proyectos_iniciales_list: state.horas_colaboradores_proyectos_iniciales,
    }
}

export default connect(mapPropsToState, actions)(TablaProyectosLiteralesManoObra);