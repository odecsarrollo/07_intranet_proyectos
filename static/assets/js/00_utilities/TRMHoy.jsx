import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../01_actions/01_index';
import {fechaFormatoUno, numeroFormato} from "./common";

const TRMHoy = props => {
    const dispatch = useDispatch();
    const api_rest_results = useSelector(state => state.api_rest_results);
    useEffect(() => {
        dispatch(actions.fetchTRMDia());
    }, []);
    const {trm_hoy = null} = api_rest_results;
    if (!trm_hoy) {
        return null
    }
    const {valor, vigenciahasta, vigenciadesde, unidad} = trm_hoy;
    return <div>
        <div>Valor: {numeroFormato(valor, 2)} {unidad}</div>
        <div>Desde: {fechaFormatoUno(vigenciadesde)}</div>
        <div>Hasta: {fechaFormatoUno(vigenciahasta)}</div>
    </div>
};

export default TRMHoy;