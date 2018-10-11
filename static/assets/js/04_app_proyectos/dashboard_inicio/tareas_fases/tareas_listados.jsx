import React, {Component, Fragment} from 'react';


class TareaAsignadaFila extends Component {
    render() {
        const {
            fila,
            tareas_asignadas,
            estado,
            literal,
            table_style,
            cambiarListaTablados
        } = this.props;
        const cantidad_nuevas = fila.cantidad_x_estados[1] ? fila.cantidad_x_estados[1] : 0;
        const cantidad_pendientes = fila.cantidad_x_estados[2] ? parseInt(fila.cantidad_x_estados[2]) : 0;
        const cantidad_en_proceso = fila.cantidad_x_estados[3] ? parseInt(fila.cantidad_x_estados[3]) : 0;

        const nuevas_vencidas = _.size(_.pickBy(tareas_asignadas, e => e.literal === fila.id && e.estado === 1 && e.vencido)) > 0;
        const pendientes_vencidos = _.size(_.pickBy(tareas_asignadas, e => e.literal === fila.id && e.estado === 2 && e.vencido)) > 0;
        const en_proceso_vencidas = _.size(_.pickBy(tareas_asignadas, e => e.literal === fila.id && e.estado === 3 && e.vencido)) > 0;
        return (
            <tr>
                <td style={table_style.td}>
                    {fila.nombre}
                </td>
                <td
                    className='text-center'
                    style={{
                        ...table_style.td,
                        backgroundColor: estado === 1 && literal === fila.id ? 'gray' : ''
                    }}
                >
                    {
                        cantidad_nuevas > 0 &&
                        <span
                            style={{color: nuevas_vencidas ? 'red' : '',}}
                            className='puntero'
                            onClick={() => cambiarListaTablados(1, fila.id)}
                        >
                                    {cantidad_nuevas}
                                    </span>
                    }
                </td>
                <td
                    style={{
                        ...table_style.td,
                        backgroundColor: estado === 2 && literal === fila.id ? 'gray' : '',
                    }}
                    className='text-center'
                >
                    {
                        cantidad_pendientes > 0 &&
                        <span
                            style={{color: pendientes_vencidos ? 'red' : '',}}
                            className='puntero'
                            onClick={() => cambiarListaTablados(2, fila.id)}
                        >
                                    {cantidad_pendientes}
                                    </span>
                    }
                </td>
                <td
                    style={{
                        ...table_style.td,
                        backgroundColor: estado === 3 && literal === fila.id ? 'gray' : ''
                    }}
                    className='text-center'
                >
                    {
                        cantidad_en_proceso > 0 &&
                        <span
                            style={{color: en_proceso_vencidas ? 'red' : '',}}
                            className='puntero'
                            onClick={() => cambiarListaTablados(3, fila.id)}
                        >
                                    {cantidad_en_proceso}
                                    </span>
                    }
                </td>
                <td
                    style={{
                        ...table_style.td,
                        backgroundColor: !estado && literal === fila.id ? 'gray' : ''
                    }}
                    className='text-center'
                >
                                    <span
                                        className='puntero'
                                        onClick={() => cambiarListaTablados(null, fila.id)}
                                    >
                                    {cantidad_pendientes + cantidad_en_proceso + cantidad_nuevas}
                                    </span>
                </td>
            </tr>
        )
    }
}

export default class TareasAsignadasPanel extends Component {
    constructor(props) {
        super(props);
        this.cambiarFiltroPendientes = this.cambiarFiltroPendientes.bind(this);
    }

    cambiarFiltroPendientes(estado = null, literal = null) {
        const {cambiarFiltroPendientes, tareas_asignadas} = this.props;
        let lista = tareas_asignadas;
        if (literal) {
            lista = _.pickBy(lista, t => t.literal === literal);
        }
        if (estado) {
            lista = _.pickBy(lista, t => t.estado === estado);
        }
        cambiarFiltroPendientes({estado, literal});
    }

    render() {
        const {
            table_style,
            tareas_asignadas,
            estado,
            literal
        } = this.props;
        const tareas_asignadas_x_literales = _.groupBy(tareas_asignadas, 'literal');
        const literales_asignados = _.uniqBy(
            _.map(
                tareas_asignadas,
                e => {
                    return {id: e.literal, nombre: e.literal_id_literal}
                }
            ),
            'id');

        const literales_asignados_tabla = literales_asignados.map(e => {
            const cantidad_x_estados = _.countBy(tareas_asignadas_x_literales[e.id], 'estado');
            return {
                ...e,
                cantidad_x_estados
            }
        });
        let total_nuevas_asignadas = 0;
        let total_pendientes_asignadas = 0;
        let total_en_proceso_asignadas = 0;
        return (
            <Fragment>
                <table className='table table-striped table-responsive' style={table_style.table}>
                    <thead>
                    <tr>
                        <th style={table_style.td}>Lit.</th>
                        <th style={table_style.td}>Nue.</th>
                        <th style={table_style.td}>Pend.</th>
                        <th style={table_style.td}>En Pro.</th>
                        <th style={table_style.td}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {literales_asignados_tabla.map(l => {
                            total_nuevas_asignadas += l.cantidad_x_estados[1] ? l.cantidad_x_estados[1] : 0;
                            total_pendientes_asignadas += l.cantidad_x_estados[2] ? l.cantidad_x_estados[2] : 0;
                            total_en_proceso_asignadas += l.cantidad_x_estados[3] ? l.cantidad_x_estados[3] : 0;
                            return (
                                <TareaAsignadaFila
                                    fila={l}
                                    key={l.id}
                                    cambiarListaTablados={this.cambiarFiltroPendientes}
                                    {...this.props}
                                />
                            )
                        }
                    )}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td style={table_style.td}>Total</td>
                        <td
                            style={{...table_style.td, backgroundColor: estado === 1 && !literal ? 'gray' : ''}}
                            className='text-center'
                        >

                            {
                                total_nuevas_asignadas > 0 &&
                                <span
                                    className='puntero'
                                    onClick={() => this.cambiarFiltroPendientes(1, null)}
                                >
                                    {total_nuevas_asignadas}
                                </span>
                            }
                        </td>
                        <td
                            style={{...table_style.td, backgroundColor: estado === 2 && !literal ? 'gray' : ''}}
                            className='text-center'
                        >
                            {
                                total_pendientes_asignadas > 0 &&
                                <span
                                    className='puntero'
                                    onClick={() => this.cambiarFiltroPendientes(2, null)}
                                >
                                    {total_pendientes_asignadas}
                                </span>
                            }
                        </td>
                        <td
                            style={{...table_style.td, backgroundColor: estado === 3 && !literal ? 'gray' : ''}}
                            className='text-center'
                        >
                            {
                                total_en_proceso_asignadas > 0 &&
                                <span
                                    className='puntero'
                                    onClick={() => this.cambiarFiltroPendientes(3, null)}
                                >
                                    {total_en_proceso_asignadas}
                                </span>
                            }
                        </td>
                        <td
                            style={{...table_style.td, backgroundColor: !estado && !literal ? 'gray' : ''}}
                            className='text-center'
                        >
                            <span
                                className='puntero'
                                onClick={() => this.cambiarFiltroPendientes()}
                            >
                                {total_en_proceso_asignadas + total_pendientes_asignadas + total_nuevas_asignadas}
                            </span>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </Fragment>
        )
    }
}
