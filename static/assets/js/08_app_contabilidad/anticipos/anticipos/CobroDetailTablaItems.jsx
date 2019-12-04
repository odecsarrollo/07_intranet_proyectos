import React, {memo, Fragment, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {numeroFormato} from "../../../00_utilities/common";
import * as actions from "../../../01_actions/01_index";
import NuevoItemModal from "./forms/NuevoItemModal";
import {useDispatch} from "react-redux/es/hooks/useDispatch";

const CobroDetailTablaItem = memo(props => {
    const {editable = false, cobro, style} = props;
    const dispatch = useDispatch();
    const [show_adicionar_item, setAdicionarItem] = useState(false);

    const adicionarItem = (item) => {
        const {cantidad, valor_unitario, descripcion, referencia} = item;
        dispatch(actions.addItemProformaAnticipo(cobro.id, cantidad, descripcion, valor_unitario, referencia, {callback: () => setAdicionarItem(false)}));
    };

    const eliminarItem = (item_id) => dispatch(actions.eliminarItemProformaAnticipo(cobro.id, item_id, {callback: () => setAdicionarItem(false)}));

    return (<Fragment>
        {show_adicionar_item && <div className='col-12'>
            <NuevoItemModal
                onSubmit={adicionarItem}
                eliminarItem={eliminarItem}
                modal_open={show_adicionar_item}
                onCancel={() => setAdicionarItem(false)}
            />
        </div>}
        <div className="col-12">Items:
            {editable && <FontAwesomeIcon
                className='puntero'
                icon={'plus-circle'}
                onClick={() => setAdicionarItem(!show_adicionar_item)}
            />}
        </div>
        <div className="col-12">
            {cobro.items.length > 0 && <table className='table table-responsive table-striped' style={style.tabla}>
                <thead>
                <tr style={style.tabla.tr}>
                    <th style={style.tabla.tr.th}>Referencia</th>
                    <th style={style.tabla.tr.th}>Descripción</th>
                    <th style={style.tabla.tr.th_numero}>Cantidad</th>
                    <th style={style.tabla.tr.th_numero}>Valor Unitario</th>
                    <th style={style.tabla.tr.th_numero}>Valor Total</th>
                    {editable && <th></th>}
                </tr>
                </thead>
                <tbody>
                {cobro.items.map(e => {
                        if (e.id) {
                            return (
                                <tr key={e.id} style={style.tabla.tr}>
                                    <td style={style.tabla.tr.td}>{e.referencia}</td>
                                    <td style={style.tabla.tr.td}>{e.descripcion}</td>
                                    <td style={style.tabla.tr.td_numero}>{e.cantidad}</td>
                                    <td style={style.tabla.tr.td_numero}>{numeroFormato(e.valor_unitario, 2)} {cobro.divisa}</td>
                                    <td style={style.tabla.tr.td_numero}>{numeroFormato(e.valor_unitario * e.cantidad, 2)} {cobro.divisa}</td>
                                    {
                                        editable &&
                                        <td style={style.tabla.tr.td_icono}>
                                            <FontAwesomeIcon
                                                className='puntero'
                                                icon={'trash'}
                                                onClick={() => eliminarItem(e.id)}
                                            />
                                        </td>
                                    }
                                </tr>
                            )
                        }
                    }
                )}
                </tbody>
                <tfoot>
                <tr style={style.tabla.tr}>
                    <td style={style.tabla.tr.td}>Valor Ant. Impuestos</td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td_numero}>{numeroFormato(cobro.valor_total_sin_impuesto, 2)} {cobro.divisa}</td>
                    <td style={style.tabla.tr.td_icono}></td>
                </tr>
                <tr style={style.tabla.tr}>
                    <td style={style.tabla.tr.td}>Impuesto</td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td_numero}>{numeroFormato(cobro.impuesto, 2)} {cobro.divisa}</td>
                    <td style={style.tabla.tr.td_icono}></td>
                </tr>
                <tr style={style.tabla.tr}>
                    <td style={style.tabla.tr.td}>Valor Total</td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td}></td>
                    <td style={style.tabla.tr.td_numero}>{numeroFormato(parseFloat(cobro.valor_total_sin_impuesto) + parseFloat(cobro.impuesto), 2)} {cobro.divisa}</td>
                    <td style={style.tabla.tr.td_icono}></td>
                </tr>
                </tfoot>
            </table>}
        </div>
    </Fragment>)
});

export default CobroDetailTablaItem;