import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import DetailLayout from "../../../00_utilities/components/ui/detail_layout/DetailLayout";
import {fechaHoraFormatoUno} from "../../../00_utilities/common";

const CotizacionItemVerificar = (props) => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const item = useSelector(state => state.cotizaciones_componentes_items)[id];
    console.log(item)
    useEffect(() => {
        dispatch(actions.fetchItemCotizacionComponente(id));
    }, []);
    if (!item) {
        return <SinObjeto/>
    }
    return <DetailLayout
        titulo={`Item a Verificar`}
        info_items={
            {
                label: 'Fecha Solicitud',
                text_value: 'HOLA',
                className: 'col-12 col-md-4 col-xl-3'
            }
        }
    >

    </DetailLayout>
};
export default CotizacionItemVerificar;