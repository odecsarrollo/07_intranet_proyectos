import React, {Component} from 'react';
import {pesosColombianos, fechaFormatoUno} from '../../../../../../00_utilities/common';

class RowItem extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            modificando: false,
            valor: null
        })
    }

    render() {
        const {modificando, valor} = this.state;
        const {modificable = false, formato, cambiarItem, item} = this.props;
        let actual_text = item;
        if (formato === 'M') {
            actual_text = pesosColombianos(item);
        } else if (formato === '%') {
            actual_text = `${Number(item).toFixed(4)} %`;
        } else if (formato === 'F') {
            actual_text = fechaFormatoUno(item);
        }
        return (
            <td
                onClick={() => {
                    if (modificable) {
                        this.setState({modificando: true, valor: item});
                    }
                }}
            >
                {
                    modificando ?
                        <input
                            type='text'
                            value={valor}
                            onBlur={e => cambiarItem(e.target.value, () => {
                                this.setState({modificando: false});
                            })}
                            onChange={(e) => this.setState({valor: e.target.value})}
                        >
                        </input> :
                        <span className={modificable ? 'puntero' : ''}>{actual_text}</span>
                }
            </td>
        )
    }
}

const TablaRow = (props) => {
    const {fila, updateColaboradorCostoMes} = props;
    return (
        <tr>
            <RowItem
                item={fila.lapso}
                modificable={true}
                formato='F'
            />
            <RowItem
                id={fila.id}
                item={`${fila.colaborador_nombres} ${fila.colaborador_apellidos}`}
            />
            <td className='text-center'>
                <i
                    onClick={() => updateColaboradorCostoMes(fila.id, {...fila, es_aprendiz: !fila.es_aprendiz})}
                    className={`${fila.es_aprendiz ? 'fas fa-check-square' : 'far fa-square'} puntero`}
                >
                </i>
            </td>
            <RowItem
                item={fila.base_salario}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, base_salario: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.auxilio_transporte}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, auxilio_transporte: valor, modificado: true},
                    callback
                )}
                formato='M'
            />
            <RowItem
                item={fila.nro_horas_mes}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, nro_horas_mes: valor, modificado: true},
                    callback
                )}
            />
            <RowItem
                item={fila.porcentaje_arl}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_arl: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <RowItem
                item={fila.porcentaje_caja_compensacion}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_caja_compensacion: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <RowItem
                item={fila.porcentaje_pension}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_pension: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <RowItem
                item={fila.porcentaje_prestaciones_sociales}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_prestaciones_sociales: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <RowItem
                item={fila.porcentaje_salud}
                modificable={true}
                cambiarItem={(valor, callback = null) => updateColaboradorCostoMes(fila.id,
                    {...fila, porcentaje_salud: valor, modificado: true},
                    callback
                )}
                formato='%'
            />
            <td>{pesosColombianos(fila.costo)}</td>
            <td>{pesosColombianos(fila.valor_hora)}</td>
            <td className='text-center'>
                <i
                    onClick={() => updateColaboradorCostoMes(fila.id, {...fila, modificado: !fila.modificado})}
                    className={`${fila.modificado ? 'fas fa-check-square' : 'far fa-square'} puntero`}
                >
                </i>
            </td>
        </tr>
    )
};

const TablaCostos = (props) => {
    const {lista, updateColaboradorCostoMes} = props;
    return (
        <table className='table table-striped table-responsive' style={{fontSize: '10px'}}>
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Colaborador</th>
                <th>Es Aprendíz</th>
                <th>Base Ingreso</th>
                <th>Auxilio Transporte</th>
                <th># Horas Mes</th>
                <th>% ARL</th>
                <th>% Cja Compen.</th>
                <th>% Pensión</th>
                <th>% Pres. Sociales</th>
                <th>% Salud</th>
                <th>Costo</th>
                <th>Valor Hora</th>
                <th>Cerrado</th>
            </tr>
            </thead>
            <tbody>
            {
                _.map(lista, e => <TablaRow updateColaboradorCostoMes={updateColaboradorCostoMes} key={e.id} fila={e}/>)
            }
            </tbody>
        </table>
    )
};

export default TablaCostos;