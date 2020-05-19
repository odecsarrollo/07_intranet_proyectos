import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CargarDatos from "../00_utilities/components/system/cargar_datos";
import {
    fetchFacturasComponentesTrimestre,
    clearCotizacionesComponentes,
    fetchCotizacionesComponentesTuberiaVentas, clearFacturas
} from "../01_actions/01_index";
import PodioVentaComponente from "./PodioVentaComponente";
import useTengoPermisos from "../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../permisos";
import TuberiaVentaComponente from "./informes/tuberia_ventas/CuadroTuberiaVentas";

const App = memo(props => {
    const contizaciones_componentes = useSelector(state => state.cotizaciones_componentes);
    const facturas = useSelector(state => state.facturas);
    const permisos_facturas = useTengoPermisos(FACTURAS);
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(fetchCotizacionesComponentesTuberiaVentas());
        dispatch(fetchFacturasComponentesTrimestre());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(clearCotizacionesComponentes());
            dispatch(clearFacturas());
        }
    }, []);
    return (
        <div className='row'>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente
                    titulo='Acumulado Ventas por vendedor'
                    facturas={facturas}
                    permisos_facturas={permisos_facturas}
                />
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente
                    solo_totales={true}
                    facturas={facturas}
                    titulo='Acumulado Total Ventas'
                    permisos_facturas={permisos_facturas}

                />
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente
                    solo_notas={true}
                    facturas={facturas}
                    titulo='Solo Notas'
                    permisos_facturas={permisos_facturas}
                />
            </div>
            <div className="col-12">
                <TuberiaVentaComponente contizaciones_componentes={contizaciones_componentes} facturas={facturas}/>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </div>
    )
});

export default App;