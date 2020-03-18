import React, {memo, useContext, useState, Fragment} from "react";
import {useDispatch} from 'react-redux';
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../../00_utilities/common";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from '@material-ui/core/styles';
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import * as actions from "../../../01_actions/01_index";

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import PropTypes from "prop-types";

const DragHandle = SortableHandle(() => <FontAwesomeIcon
    icon={'arrows-alt'}
    className={'puntero'}
    size='lg'
/>);

const useStyles = makeStyles(theme => ({
    textField: {
        margin: '2px',
        padding: 0,
        paddingLeft: 5,
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRadius: '5px',
        backgroundColor: theme.palette.primary.light
    },
    textFieldPersonalizado: {
        margin: '2px',
        padding: 0,
        paddingLeft: 5,
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRadius: '5px',
        backgroundColor: theme.palette.primary.light
    },
    campo_personalizado: {
        color: 'red'
    },
    icono_reset_value: {
        color: 'red'
    },
}));

const CotizacionDetailItemsTablaItemEdit = props => {
    const {
        nombre_atributo_actual,
        nombre_atributo_a_cambiar,
        setAtributoACambiar,
        item,
        guarda_original,
        multiline,
        tipo,
        cargarDatos
    } = props;
    const dispatch = useDispatch();
    const [valor, setValor] = useState(item[nombre_atributo_actual]);
    const classes = useStyles();
    const personalizarItemCaracteristica = () => {
        const callback = () => {
            cargarDatos();
            setAtributoACambiar(null)
        };
        if ((tipo === 'float' && parseFloat(item[nombre_atributo_actual]) === parseFloat(valor)) ||
            (tipo === 'string' && item[nombre_atributo_actual] === valor)) {
            setAtributoACambiar(null)
        } else {
            dispatch(actions.personalizarItemCotizacionComponente(
                item.id,
                nombre_atributo_actual,
                tipo === 'string' ? valor : null,
                tipo === 'float' ? valor : null,
                {callback}
            ));
        }
    };
    return <div className='row'>
        {nombre_atributo_actual === nombre_atributo_a_cambiar ?
            <TextField
                fullWidth={true}
                className={classes.textFieldPersonalizado}
                multiline={multiline}
                onBlur={() => personalizarItemCaracteristica()}
                value={valor}
                onDoubleClick={() => setValor(item[nombre_atributo_actual])}
                onChange={(e) => {
                    setValor(tipo === 'string' ? e.target.value.toUpperCase() : e.target.value)
                }}
            /> :
            <Fragment>
                <div
                    className={guarda_original ? classNames(classes.campo_personalizado, 'puntero col-12') : 'puntero col-12'}>
                    <span onDoubleClick={() => setAtributoACambiar(nombre_atributo_actual)}>
                        {tipo === 'float' ? pesosColombianos(item[nombre_atributo_actual]) : item[nombre_atributo_actual]}
                    </span>
                </div>
                {guarda_original && <div className={classNames(classes.icono_reset_value, 'text-right col-12')}>
                    <FontAwesomeIcon
                        onDoubleClick={() => {
                            setValor(item[`${nombre_atributo_actual}_ori`]);
                            personalizarItemCaracteristica();
                        }}
                        icon={'history'}
                        className={'puntero'}
                        size='sm'
                    />
                </div>}
            </Fragment>
        }
    </div>
};

CotizacionDetailItemsTablaItemEdit.propTypes = {
    nombre_atributo_actual: PropTypes.string.isRequired,
    nombre_atributo_a_cambiar: PropTypes.string,
    tipo: PropTypes.string.isRequired,
    setAtributoACambiar: PropTypes.func.isRequired,
    cargarDatos: PropTypes.func.isRequired,
    guarda_original: PropTypes.bool.isRequired,
    multiline: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
};

const CotizacionDetailItemsTablaItem = memo(props => {
    const {item, editable, cargarDatos} = props;
    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState(item.cantidad);
    const [dias_entrega, setDiasEntrega] = useState(item.dias_entrega);
    const {table} = useContext(StylesContext);
    const classes = useStyles();
    const [nombre_atributo_a_cambiar, setAtributoACambiar] = useState(null);
    const tipo = () => {
        const es_articulo_catalogo = !!item.articulo_catalogo;
        const es_banda_eurobelt = !!item.banda_eurobelt;
        const es_componenten_eurobelt = !!item.componente_eurobelt;
        if (es_articulo_catalogo) {
            return 'Artículo Catalogo';
        } else if (es_banda_eurobelt) {
            return 'Banda Eurobelt';
        } else if (es_componenten_eurobelt) {
            return 'Comp. Eurobelt';
        } else {
            return 'Otro'
        }
    };

    const eliminarItem = (cotizacion_componente_id, id_item_cotizacion) => dispatch(actions.eliminarItemCotizacionComponente(
        cotizacion_componente_id,
        id_item_cotizacion,
        {
            callback: () => cargarDatos()
        }
    ));
    const cambiarItem = (id_item_cotizacion, item) => dispatch(actions.updateItemCotizacionComponente(
        id_item_cotizacion,
        item,
        {
            callback: () => cargarDatos()
        }
    ));
    return (
        <tr style={{...table.tr}}>
            <td style={table.td}>
                <div style={{marginTop: '7px'}}>
                    {editable && <DragHandle/>} {item.posicion}
                </div>
            </td>
            <td style={{...table.td, fontSize: '0.5rem'}}>{item.canal_nombre} {item.forma_pago_nombre}</td>
            <td style={{...table.td, fontSize: '0.5rem'}}>{tipo()}</td>
            <td style={{...table.td, fontSize: '0.7rem', wordBreak: 'break-all'}}>
                <CotizacionDetailItemsTablaItemEdit
                    cargarDatos={cargarDatos}
                    multiline={true}
                    nombre_atributo_actual='referencia'
                    item={item}
                    guarda_original={item.referencia_ori !== null}
                    nombre_atributo_a_cambiar={nombre_atributo_a_cambiar}
                    setAtributoACambiar={setAtributoACambiar}
                    tipo='string'
                />
            </td>
            <td style={{...table.td, fontSize: '0.7rem'}}>
                <CotizacionDetailItemsTablaItemEdit
                    cargarDatos={cargarDatos}
                    multiline={true}
                    nombre_atributo_actual='descripcion'
                    item={item}
                    guarda_original={item.descripcion_ori !== null}
                    nombre_atributo_a_cambiar={nombre_atributo_a_cambiar}
                    setAtributoACambiar={setAtributoACambiar}
                    tipo='string'
                />
            </td>
            <td style={{...table.td, fontSize: '0.7rem'}}>
                <CotizacionDetailItemsTablaItemEdit
                    cargarDatos={cargarDatos}
                    multiline={true}
                    nombre_atributo_actual='unidad_medida'
                    item={item}
                    guarda_original={item.unidad_medida_ori !== null}
                    nombre_atributo_a_cambiar={nombre_atributo_a_cambiar}
                    setAtributoACambiar={setAtributoACambiar}
                    tipo='string'
                />
            </td>
            <td style={table.td_right}>
                <CotizacionDetailItemsTablaItemEdit
                    cargarDatos={cargarDatos}
                    multiline={true}
                    nombre_atributo_actual='precio_unitario'
                    item={item}
                    guarda_original={item.precio_unitario_ori !== -1}
                    nombre_atributo_a_cambiar={nombre_atributo_a_cambiar}
                    setAtributoACambiar={setAtributoACambiar}
                    tipo='float'
                />
            </td>
            <td style={{...table.td, width: '70px'}}>
                <TextField
                    disabled={!editable}
                    className={classes.textField}
                    fullWidth={true}
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value)}
                    onBlur={e => {
                        if (parseFloat(item.cantidad) !== parseFloat(e.target.value)) {
                            cambiarItem(item.id, {...item, cantidad});
                        }
                    }}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td_right}>{pesosColombianos(item.valor_total)}</td>
            <td style={{...table.td, width: '45px'}}>
                <TextField
                    disabled={!editable}
                    className={classes.textField}
                    fullWidth={true}
                    value={dias_entrega}
                    onChange={e => setDiasEntrega(e.target.value)}
                    onBlur={e => {
                        if (parseFloat(item.dias_entrega) !== parseFloat(e.target.value)) {
                            cambiarItem(item.id, {...item, dias_entrega})
                        }
                    }}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td}>{item.transporte_tipo}</td>
            {editable &&
            <Fragment>
                <td style={table.td}>
                    <MyDialogButtonDelete
                        onDelete={() => eliminarItem(item.cotizacion, item.id)}
                        element_name={item.referencia}
                        element_type='Item Cotización'
                    />
                </td>
                <td style={table.td} className='text-center'>
                    {item.verificar_personalizacion && <Fragment>
                        {item.verificada_personalizacion ?
                            <FontAwesomeIcon icon={'check-circle'} size='sm'/> :
                            <FontAwesomeIcon icon={'times-circle'} size='sm'/>}
                    </Fragment>}
                </td>
            </Fragment>
            }
        </tr>
    )
});

const SortableItem = SortableElement(({item, cargarDatos, editable}) =>
    <CotizacionDetailItemsTablaItem
        item={item}
        editable={editable}
        cargarDatos={cargarDatos}
    />
);


const SortableList = SortableContainer(({items, editable, cargarDatos}) => {
    return (
        <tbody>
        {_.orderBy(items, ['posicion'], ['asc']).map((item) => (
            <SortableItem
                disabled={!editable}
                useDragHandle
                key={item.id}
                index={item.posicion}
                cargarDatos={cargarDatos}
                editable={editable}
                item={item}
            />
        ))}
        </tbody>
    );
});

function areEqual(prevProps, nextProps) {
    return _.isEqual(prevProps.items, nextProps.items) && prevProps.editable === nextProps.editable
}

const CotizacionDetailItemsTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const dispatch = useDispatch();
    const {
        cotizacion_componente,
        cotizacion_componente: {items},
        cargarDatos,
        valor_total,
        cantidad_items,
        editable
    } = props;

    const onSortEnd = ({oldIndex, newIndex}) => {
        const item_uno = items.filter(e => e.posicion === oldIndex)[0];
        const item_dos = items.filter(e => e.posicion === newIndex)[0];
        if (oldIndex !== newIndex) {
            dispatch(actions.cambiarPosicionItemCotizacionComponente(
                cotizacion_componente.id,
                item_uno.id,
                item_dos.id,
                {
                    callback: () => cargarDatos()
                }
            ))
        }
    };

    return (
        <table className='table table-striped table-responsive' style={table}>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Orden</th>
                <th style={table.td}>F. Pago</th>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>Referencia</th>
                <th style={table.td}>Descripción</th>
                <th style={table.td}>Uni. Med</th>
                <th style={table.td}>$ Unitario</th>
                <th style={table.td}>Cant.</th>
                <th style={table.td}>$ Total</th>
                <th style={table.td}>T. Ent</th>
                <th style={table.td}>Tipo Transporte</th>
                {editable && <th style={table.td}>Eli.</th>}
                {editable && <th style={table.td}>Veri.</th>}
            </tr>
            </thead>
            <SortableList
                useDragHandle
                onSortEnd={onSortEnd}
                cargarDatos={cargarDatos}
                editable={editable}
                items={items}
            />
            <tfoot>
            <tr style={table.tr}>
                <td style={table.td}>Total</td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td} className='text-center'>{cantidad_items}</td>
                <td style={table.td_right}>{pesosColombianos(valor_total)}</td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                {editable && <td style={table.td}></td>}
                {editable && <td style={table.td}></td>}
            </tr>
            </tfoot>
        </table>
    )

});

export default CotizacionDetailItemsTabla;