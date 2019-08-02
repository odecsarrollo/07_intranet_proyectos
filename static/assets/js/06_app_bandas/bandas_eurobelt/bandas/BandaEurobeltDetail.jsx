import React, {useEffect, memo, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDAS_EUROBELT} from "../../../permisos";
import BandaEurobeltBaseForm from "./forms/BandaEurobeltBaseForm";
import BandaEurobeltEnsamblado from "./forms/BandaEurobeltEnsamblado";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";

const style = {
    tabla: {
        fontSize: '0.7rem',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            td_icono: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
                minWidth: '120px'
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
        }
    }
};


const BandaEurobeltDetail = memo(props => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const banda = useSelector(state => state.banda_eurobelt_bandas[id]);
    const permisos = useTengoPermisos(BANDAS_EUROBELT);

    const cargarDatos = () => dispatch(actions.fetchBandaEurobelt(id));

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandasEurobelt());
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
            Hola
            <BandaEurobeltBaseForm
                initialValues={banda}
                mostrar_cancelar={false}
                onSubmit={onSubmit}
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default BandaEurobeltDetail;