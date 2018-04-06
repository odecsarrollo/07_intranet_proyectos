import React, {Component} from 'react';
import {pesosColombianos, fechaFormatoUno} from '../../../../../../00_utilities/common';

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
    const {fila, updateColaboradorCostoMes, permisos_object} = props;
    return (
        <tr>
            <RowItem
                item={fila.lapso}
                modificable={true}
                formato='F'
                permisos_object={permisos_object}
            />
            <td><span>{fila.colaborador_nombres} {fila.colaborador_apellidos}</span></td>
            <td><span>{fila.centro_costo_nombre}</span></td>


            <td className='text-center'>
                {permisos_object.change && !fila.verificado ?
                    <i
                        onClick={() => updateColaboradorCostoMes(fila.id, {...fila, es_aprendiz: !fila.es_aprendiz})}
                        className={`${fila.es_aprendiz ? 'fas fa-check-square' : 'far fa-square'} puntero`}
                    >
                    </i> :
                    <i
                        className={`${fila.es_aprendiz ? 'fas fa-check-circle' : 'fas fa-times'}`}
                    >
                    </i>
                }
            </td>

            <RowItem
                item={fila.base_salario}
                permisos_object={permisos_object}
                modificable={!fila.verificado}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, base_salario: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.auxilio_transporte}
                permisos_object={permisos_object}
                modificable={!fila.verificado}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, auxilio_transporte: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.nro_horas_mes}
                permisos_object={permisos_object}
                modificable={!fila.verificado}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, nro_horas_mes: valor, modificado: true},
                    callback
                )}
            />
            <RowItem
                item={fila.porcentaje_arl}
                permisos_object={permisos_object}
                modificable={!fila.verificado}
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
                modificable={!fila.verificado}
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
                modificable={!fila.verificado}
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
                modificable={!fila.verificado}
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
                modificable={!fila.verificado}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_salud: valor, modificado: true},
                    callback
                )}
                formato='%'
                cant_decimales={2}
            />
            <td className='text-right'><strong>{pesosColombianos(fila.costo)}</strong></td>
            <td className='text-right'><strong>{pesosColombianos(fila.valor_hora)}</strong></td>
            <td className='text-center'>
                {permisos_object.change && !fila.verificado ?
                    <i
                        onClick={() => updateColaboradorCostoMes(fila.id, {...fila, modificado: !fila.modificado})}
                        className={`${fila.modificado ? 'fas fa-check-square' : 'far fa-square'} puntero`}
                    >
                    </i> :
                    <i
                        className={`${fila.modificado ? 'fas fa-check-circle' : ''}`}
                    >
                    </i>
                }
            </td>
            <td className='text-center'>
                {permisos_object.change ?
                    <i
                        onClick={() => updateColaboradorCostoMes(fila.id, {...fila, verificado: !fila.verificado})}
                        className={`${fila.verificado ? 'fas fa-check-square' : 'far fa-square'} puntero`}
                    >
                    </i> :
                    <i
                        className={`${fila.verificado ? 'fas fa-check-circle' : 'fas fa-times'}`}
                    >
                    </i>
                }
            </td>
        </tr>
    )
};

const TablaCostos = (props) => {
    const {lista, updateColaboradorCostoMes, permisos_object} = props;
    return (
        <table className='table table-striped table-responsive' style={{fontSize: '9px'}}>
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Colaborador</th>
                <th>Centro Costo</th>
                <th>Aprendíz</th>
                <th>Base Ingreso</th>
                <th>A. Transporte</th>
                <th># H. Mes</th>
                <th>% ARL</th>
                <th>% Cja Compen.</th>
                <th>% Pensión</th>
                <th>% Pres. Sociales</th>
                <th>% Salud</th>
                <th>Costo</th>
                <th>Valor Hora</th>
                <th>Modificado</th>
                <th>Verificado</th>
            </tr>
            </thead>
            <tbody>
            {
                _.map(lista, e =>
                    <TablaRow
                        updateColaboradorCostoMes={updateColaboradorCostoMes} key={e.id}
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