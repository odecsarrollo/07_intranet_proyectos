import React, {memo, useState, useEffect} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BloqueContactos from "./ClienteDetailDashboardCRUDContactos";
import BloqueFacturaciones from "./ClienteDetailDashboardFacturacion";
import BloqueCotizaciones from "./ClienteDetailDashboardCotizaciones";
import HistoricoPrecio from "./ClienteHistoricoPrecios";
import {useDispatch, useSelector} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CLIENTES} from "../../../../permisos";
import * as actions from '../../../../01_actions/01_index';
import ValidarPermisos from "../../../../permisos/validar_permisos";
import DetailLayout from "../../../../00_utilities/components/ui/detail_layout/DetailLayout";

const ClienteDetailDashboard = memo(props => {
    const [slideIndex, setSlideIndex] = useState(0);
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const cliente = useSelector(state => state.clientes[id]);
    const permisos = useTengoPermisos(CLIENTES);

    const cargarDatos = (callback = null) => {
        dispatch(actions.fetchCliente(id, {callback}));
    };
    useEffect(() => {
        cargarDatos();
    }, []);
    if (!cliente) {
        return <div>Cargando...</div>
    }
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cliente'>
            <DetailLayout
                titulo={`Detalle de ${cliente.to_string}`}
                info_items={[
                    {
                        label: 'Vendedor Componentes',
                        text_value: cliente.colaborador_componentes_nombre,
                        className: 'col-12 col-md-6'
                    },
                    {
                        label: 'Vendedor Proyectos',
                        text_value: cliente.colaborador_proyectos_nombre,
                        className: 'col-12 col-md-6'
                    },
                    {label: 'Nit', text_value: cliente.nit, className: 'col-4 col-md-3'},
                    {
                        label: 'Sincronizado',
                        icon_value: cliente.sincronizado_sistemas_informacion ? 'check-circle' : null,
                        className: 'col-4 col-md-3'
                    },
                ]}
            >
                <Tabs indicatorColor="primary"
                      textColor="primary"
                      onChange={(event, index) => setSlideIndex(index)}
                      value={slideIndex}
                >
                    <Tab label="Contactos"/>
                    <Tab label="Facturacion"/>
                    <Tab label="Cotizaciones Componentes"/>
                    {/*<Tab label="Proyectos"/>*/}
                </Tabs>
                {slideIndex === 0 && <BloqueContactos cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
                {slideIndex === 1 && <BloqueFacturaciones cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
                {slideIndex === 2 && <BloqueCotizaciones cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
                {/*{slideIndex === 3 && <BloqueProyectos cliente_id={cliente.id} cargarCliente={cargarDatos}/>}*/}
            </DetailLayout>
            {permisos.consultar_historico_precios && <HistoricoPrecio cliente={cliente}/>}
        </ValidarPermisos>
    )
});

export default ClienteDetailDashboard;