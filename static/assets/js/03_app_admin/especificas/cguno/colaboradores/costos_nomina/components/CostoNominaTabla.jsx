import React, {Component} from 'react';
import {pesosColombianos, fechaFormatoUno} from '../../../../../../00_utilities/common';
import Combobox from 'react-widgets/lib/Combobox';

import Checkbox from '@material-ui/core/Checkbox';

class RowItemSelect extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            modificando: false,
            valor: null,
            inicial: null,
        })
    }


    render() {
        const {centros_costos_list, permisos_object, centro_costo, cambiarItem, item} = this.props;
        const {modificando, valor, inicial} = this.state;
        let centros_costos_base = _.map(centros_costos_list, e => {
            return {id: e.id, nombre: e.nombre}
        });
        centros_costos_base = [...centros_costos_base, {id: null, nombre: 'SIN DEFINIR'}];
        return (
            <td>
                {
                    modificando ?
                        <Combobox
                            value={valor}
                            style={{width: "170px"}}
                            valueField='id'
                            textField='nombre'
                            data={_.map(centros_costos_base, e => e)}
                            onChange={e => {
                                this.setState({valor: e.id});
                            }}
                            onBlur={() => {
                                if (inicial !== valor) {
                                    cambiarItem(valor, () => {
                                        this.setState({modificando: false, inicial: null, value: null});
                                    })
                                } else {
                                    this.setState({modificando: false, inicial: null, value: null});
                                }
                            }}
                        /> :
                        <span
                            className={permisos_object.change ? 'puntero' : ''}
                            onClick={() => {
                                if (permisos_object.change) {
                                    this.setState({modificando: true, valor: item, inicial: item});
                                }
                            }}
                            style={{color: `${centro_costo ? '' : 'red'}`}}
                        >
                            {
                                centro_costo ? centro_costo :
                                    'ASIGNAR'
                            }
                        </span>
                }
            </td>
        )
    }

}

class RowItem extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            modificando: false,
            valor: null,
            inicial: null,
        })
    }

    render() {
        const {
            modificando,
            valor,
            inicial
        } = this.state;

        const {
            modificable = false,
            formato = '',
            cambiarItem,
            item,
            cant_decimales = 4,
            permisos_object,
            es_n_a = false,
        } = this.props;

        let actual_text = item;
        if (formato === 'M') {
            actual_text = pesosColombianos(item);
        } else if (formato === '%') {
            actual_text = `${Number(item).toFixed(cant_decimales)}%`;
        } else if (formato === 'F') {
            actual_text = fechaFormatoUno(item);
        }
        return (

            es_n_a ?
                <td className='text-right'><span>N.A</span></td> :
                <td
                    onClick={() => {
                        if (modificable && permisos_object.change) {
                            this.setState({modificando: true, valor: item, inicial: item});
                        }
                    }}
                >
                    {
                        modificando ?
                            <input
                                type='text'
                                value={valor}
                                onBlur={e => {
                                    if (inicial !== valor) {
                                        cambiarItem(e.target.value, () => {
                                            this.setState({modificando: false, inicial: null, value: null});
                                        })
                                    } else {
                                        this.setState({modificando: false, inicial: null, value: null});
                                    }
                                }}
                                onChange={(e) => {
                                    this.setState({valor: e.target.value});
                                }}
                            >
                            </input> :
                            <div className={
                                formato !== '' && formato !== 'F' ? 'text-right' : ''
                            }>
                            <span
                                className={modificable && permisos_object.change ? 'puntero' : ''}
                                style={{color: `${Number(item) === 0 ? 'red' : ''}`}}
                            >{actual_text}</span>
                            </div>
                    }
                </td>
        )
    }
}

const TablaRow = (props) => {
    const {
        fila,
        updateColaboradorCostoMes,
        permisos_object,
        centros_costos_list,
        fecha_cierre
    } = props;
    const lapso = fila ? fila.lapso : null;
    const puede_cambiar = lapso && fecha_cierre ? lapso >= fecha_cierre : true;
    const es_modificable = !fila.verificado && puede_cambiar;
    return (
        <tr>
            <RowItem
                item={fila.lapso}
                modificable={false}
                formato='F'
                permisos_object={permisos_object}
            />
            <td><span>{fila.colaborador_nombres} {fila.colaborador_apellidos}</span></td>
            <RowItemSelect
                modificable={es_modificable}
                item={fila.centro_costo}
                permisos_object={permisos_object}
                centros_costos_list={centros_costos_list}
                centro_costo={fila.centro_costo_nombre}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, centro_costo: valor, modificado: true},
                    callback
                )}
            />


            <td className='text-center'>
                <Checkbox
                    disabled={!(permisos_object.change && es_modificable)}
                    style={{margin: 0, padding: 0}}
                    color='primary'
                    checked={fila.es_aprendiz}
                    onClick={() => updateColaboradorCostoMes(fila.id, {...fila, es_aprendiz: !fila.es_aprendiz})}
                />
            </td>


            <td className='text-center'>
                <Checkbox
                    disabled={!(permisos_object.change && es_modificable)}
                    style={{margin: 0, padding: 0}}
                    color='primary'
                    checked={fila.es_salario_fijo}
                    onClick={() => updateColaboradorCostoMes(fila.id, {
                        ...fila,
                        es_salario_fijo: !fila.es_salario_fijo
                    })}
                />
            </td>

            <RowItem
                item={fila.base_salario}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, base_salario: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.auxilio_transporte}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, auxilio_transporte: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.nro_horas_mes}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, nro_horas_mes: valor, modificado: true},
                    callback
                )}
            />
            <td>
                <span>
                {fila.es_salario_fijo ? fila.nro_horas_mes_trabajadas : 'N.A'}
                </span>
            </td>
            <RowItem
                item={fila.porcentaje_arl}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_arl: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <RowItem
                es_n_a={fila.es_aprendiz}
                item={fila.porcentaje_caja_compensacion}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_caja_compensacion: valor, modificado: true},
                    callback
                )}
                formato='%'
                cant_decimales={2}
            />

            <RowItem
                es_n_a={fila.es_aprendiz}
                item={fila.porcentaje_pension}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_pension: valor, modificado: true},
                    callback
                )}
                formato='%'
                cant_decimales={2}
            />
            <RowItem
                es_n_a={fila.es_aprendiz}
                item={fila.porcentaje_prestaciones_sociales}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_prestaciones_sociales: valor, modificado: true},
                    callback
                )}
                formato='%'
                cant_decimales={2}
            />
            <RowItem
                es_n_a={!fila.es_aprendiz}
                item={fila.porcentaje_salud}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_salud: valor, modificado: true},
                    callback
                )}
                formato='%'
                cant_decimales={2}
            />
            <td className='text-right'><strong>{pesosColombianos(fila.costo)}</strong></td>
            <RowItem
                item={fila.otro_costo}
                permisos_object={permisos_object}
                modificable={es_modificable}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, otro_costo: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <td className='text-right'><strong>{pesosColombianos(fila.valor_hora)}</strong></td>

            <td className='text-center'>
                <Checkbox
                    disabled={!(permisos_object.change && es_modificable)}
                    style={{margin: 0, padding: 0}}
                    color='primary'
                    checked={fila.modificado}
                    onClick={() => updateColaboradorCostoMes(fila.id, {...fila, modificado: !fila.modificado})}
                />
            </td>
            <td className='text-center'>
                <Checkbox
                    disabled={!(permisos_object.change && puede_cambiar)}
                    style={{margin: 0, padding: 0}}
                    color='primary'
                    checked={fila.verificado}
                    onClick={() => updateColaboradorCostoMes(fila.id, {...fila, verificado: !fila.verificado})}
                />
            </td>
        </tr>
    )
};

const TablaCostos = (props) => {
    const {
        lista,
        updateColaboradorCostoMes,
        permisos_object,
        centros_costos_list,
        configuracion_costos,
    } = props;
    const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
    return (
        <table className='table table-striped table-responsive' style={{fontSize: '9px'}}>
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Colaborador</th>
                <th>Centro Costo</th>
                <th>Aprendíz</th>
                <th>Salario Fijo</th>
                <th>Base Ingreso</th>
                <th>A. Transporte</th>
                <th># H. Mes</th>
                <th># H. Mes T</th>
                <th>% ARL</th>
                <th>% Cja Compen.</th>
                <th>% Pensión</th>
                <th>% Pres. Sociales</th>
                <th>% Salud</th>
                <th>Costo</th>
                <th>Costo Adicional</th>
                <th>Valor Hora</th>
                <th>Modificado</th>
                <th>Verificado</th>
            </tr>
            </thead>
            <tbody>
            {
                _.map(lista, e =>
                    <TablaRow
                        fecha_cierre={fecha_cierre}
                        centros_costos_list={centros_costos_list}
                        updateColaboradorCostoMes={updateColaboradorCostoMes}
                        key={e.id}
                        fila={e}
                        permisos_object={permisos_object}
                    />
                )
            }
            </tbody>
        </table>
    )
};

export default TablaCostos;