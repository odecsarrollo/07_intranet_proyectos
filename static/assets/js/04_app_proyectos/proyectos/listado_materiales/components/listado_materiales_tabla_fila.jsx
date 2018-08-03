import React, {Component, Fragment} from 'react';
import CalendarField from '../../../../00_utilities/calendarioField';

const style = {
    table: {
        tr: {
            td_numero: {
                paddingTop: '1px',
                paddingBottom: '1px',
                fontSize: '0.6rem',
                textAlign: 'right'
            },
            td_calendar: {
                paddingTop: '1px',
                paddingBottom: '1px',
                textAlign: 'right',
                fontSize: '0.7rem',
                width: '150px'
            },
            td: {
                paddingTop: '1px',
                fontSize: '0.6rem',
                paddingBottom: '1px',
            },
            th: {
                paddingTop: '1px',
                fontSize: '0.6rem',
                paddingBottom: '1px',
            },
        }
    }
};

class CeldaTabla extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            editando: false
        })
    }

    render() {
        const {
            editando
        } = this.state;
        const {
            value,
            nombre_celda,
            onChangeItem,
            fila,
            fila_original,
            disabled,
        } = this.props;
        return (
            <Fragment>
                {
                    editando ?
                        <input
                            value={value}
                            onChange={(event) => onChangeItem({
                                ...fila,
                                [nombre_celda]: event.target.value
                            })}
                            onBlur={() => {
                                this.setState({editando: false});
                                const valor_original = fila_original[nombre_celda];
                                const valor_nuevo = parseFloat(value).toFixed(2);
                                let nueva_fila = fila;
                                if (valor_original !== valor_nuevo) {
                                    nueva_fila = {
                                        ...fila,
                                        [nombre_celda]: valor_nuevo,
                                        [`${nombre_celda}_anterior`]: valor_original
                                    }
                                } else {
                                    nueva_fila = {
                                        ..._.omit(fila, `${nombre_celda}_anterior`),
                                        [nombre_celda]: valor_nuevo
                                    }
                                }
                                onChangeItem(nueva_fila)
                            }}
                        /> :
                        <span className={disabled ? '' : 'puntero'}
                              onClick={() => {
                                  if (!disabled) {
                                      this.setState({editando: true})
                                  }
                              }}
                        >
                            {parseFloat(value).toFixed(2)}
                            </span>
                }
            </Fragment>
        )
    }
}

class RowTabla extends Component {
    render() {
        const {
            fila,
            onChangeItem,
            fila_original,
        } = this.props;
        if (!fila_original && !fila.nuevo) {
            return null
        }
        const no_ha_cambiado = _.isEqual(fila, fila_original);
        return (
            <tr>
                <td style={style.table.tr.td}>{
                    !no_ha_cambiado && <i className='far fa-exclamation-circle'></i>
                }</td>
                <td style={style.table.tr.td}>{fila.item_cguno}</td>
                <td style={style.table.tr.td}>{fila.codigo}</td>
                <td style={style.table.tr.td}>{fila.descripcion}</td>
                <td style={style.table.tr.td}>{fila.material}</td>
                <td style={style.table.tr.td}>{fila.cantidad_material}</td>
                <td style={style.table.tr.td}>{fila.proceso}</td>
                <td style={style.table.tr.td}>{fila.acabado}</td>
                <td style={style.table.tr.td_numero}>
                    <CeldaTabla
                        onChangeItem={onChangeItem}
                        value={fila.cantidad}
                        nombre_celda='cantidad'
                        fila={fila}
                        disabled={fila.eliminado}
                        fila_original={fila_original}
                    />
                </td>
                <td style={style.table.tr.td_numero}>
                    <CeldaTabla
                        onChangeItem={onChangeItem}
                        value={fila.cantidad_reservada_inventario}
                        nombre_celda='cantidad_reservada_inventario'
                        fila={fila}
                        disabled={fila.eliminado}
                        fila_original={fila_original}
                    />
                </td>
                <td style={style.table.tr.td_numero}>
                    <CeldaTabla
                        onChangeItem={onChangeItem}
                        value={fila.cantidad_a_comprar}
                        nombre_celda='cantidad_a_comprar'
                        disabled={fila.eliminado}
                        fila={fila}
                        fila_original={fila_original}
                    />
                </td>
                <td style={style.table.tr.td_numero}>{parseFloat(fila.cantidad) - parseFloat(fila.cantidad_a_comprar) - parseFloat(fila.cantidad_reservada_inventario)}</td>
                <td style={style.table.tr.td_calendar}>
                    {
                        !fila.eliminado &&
                        <CalendarField
                            value={fila.fecha_requerido}
                            onChange={(e) => {
                                console.log(e);
                                onChangeItem({
                                    ...fila,
                                    fecha_requerido: e,
                                    cambio_fecha: true
                                })
                            }}
                            max={new Date(3000, 12, 31)}
                        />
                    }
                </td>
                <td style={style.table.tr.td}>
                    {
                        !fila.eliminado &&
                        <i
                            className={`far fa${fila.eliminar ? '-check' : ''}-square puntero fa-lg`}
                            onClick={() => {
                                if (fila.eliminar) {
                                    onChangeItem(_.omit(fila, 'eliminar'))
                                } else {
                                    onChangeItem({
                                        ...fila,
                                        eliminar: true
                                    })
                                }
                            }}
                        >
                        </i>
                    }
                </td>
                <td style={style.table.tr.td}>
                    {
                        fila.eliminado &&
                        <i style={{color: 'red'}} className={`far fa-times-circle 2x-lg`}></i>
                    }
                </td>
            </tr>
        )
    }
}

export default RowTabla;