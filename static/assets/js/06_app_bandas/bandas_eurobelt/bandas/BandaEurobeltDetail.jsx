import React, {useEffect, memo, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDAS_EUROBELT} from "../../../permisos";
import BandaEurobeltBaseForm from "./forms/BandaEurobeltBaseForm";
import BandaEurobeltEnsamblado from "./forms/BandaEurobeltEnsamblado";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";


const BandaEurobeltDetail = memo(props => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const banda = useSelector(state => state.banda_eurobelt_bandas[id]);
    const componentes = useSelector(state => state.banda_eurobelt_componentes);
    const configuracion = useSelector(state => _.map(state.banda_eurobelt_configuracion)[0]);
    const permisos = useTengoPermisos(BANDAS_EUROBELT);
    const cargarDatos = () => {
        const cargarConfiguracion = () => dispatch(actions.fetchConfiguracionBandaEurobelt());
        const cargarComponentes = () => dispatch(actions.fetchBandaEurobeltComponentes({callback: cargarConfiguracion}));
        dispatch(actions.fetchBandaEurobelt(id, {callback: cargarComponentes}))
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandasEurobelt());
            dispatch(actions.clearBandaEurobeltComponentes());
            dispatch(actions.clearConfiguracionBandaEurobelt());
        };
    }, []);

    if (!permisos.detail) {
        return <div>No tiene permisos</div>
    }

    const onSubmit = (v) => {
        dispatch(actions.updateBandaEurobelt(banda.id, v));
    };

    if (!banda) {
        return <div>Cargando...</div>
    }
    return (
        <Fragment>
            {banda.referencia} - {banda.nombre}
            <BandaEurobeltBaseForm
                initialValues={banda}
                mostrar_cancelar={false}
                onSubmit={onSubmit}
            />
            <BandaEurobeltEnsamblado
                banda={banda}
                componentes={componentes}
                configuracion={configuracion}
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default BandaEurobeltDetail;