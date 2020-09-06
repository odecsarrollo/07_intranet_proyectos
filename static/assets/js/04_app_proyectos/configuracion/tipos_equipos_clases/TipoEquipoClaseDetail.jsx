import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import DetailLayout from "../../../00_utilities/components/ui/detail_layout/DetailLayout";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import * as actions from "../../../01_actions/01_index";
import {TIPOS_EQUIPOS_CLASES} from "../../../permisos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import TipoEquipoClaseCampoCRUD from "../tipos_equipos_clases_campos/TipoEquipoClaseCampoCRUD";
import TipoEquipoClaseDetailDocumento from "../tipos_equipos_clases_campos/TipoEquipoClaseDetailDocumento";
import TipoEquipoClaseRutinas from "../tipos_equipos_clases_rutinas/TipoEquipoClaseRutinaCRUD";

const TipoEquipoClaseDetail = props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const tipo_equipo_clase = useSelector(state => state.tipos_equipos_clases[id]);
    const cargarDatos = () => {
        dispatch(actions.fetchTipoEquipoClase(id));
    };
    useEffect(() => {
        if (permisos.detail) {
            cargarDatos();
        }
        return () => dispatch(actions.clearTiposEquiposClases());
    }, []);
    const permisos = useTengoPermisos(TIPOS_EQUIPOS_CLASES);
    if (!tipo_equipo_clase) {
        return <div>Cargando...</div>
    }
    return <ValidarPermisos can_see={permisos.detail} nombre='detalles de Tipo de Equipo Clase'>
        <DetailLayout
            titulo={`Clase de Equipo ${tipo_equipo_clase.to_string}`}
            info_items={[
                {
                    label: 'Tipo Equipo',
                    text_value: tipo_equipo_clase.tipo_equipo_nombre,
                    className: 'col-12 col-md-4 col-xl-3',
                    link: `/app/proyectos/configuracion/tipos_equipos/${tipo_equipo_clase.tipo_equipo}`
                },
                {
                    label: 'Sigla',
                    text_value: tipo_equipo_clase.sigla,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Activo',
                    icon_value: tipo_equipo_clase.activo ? 'check-circle' : null,
                    className: 'col-12 col-md-4 col-xl-3'
                },
            ]}
        >
            <Tabs>
                <TabList>
                    <Tab>Documentos</Tab>
                    <Tab>Campos</Tab>
                    <Tab>Rutinas</Tab>
                </TabList>
                <TabPanel>
                    <TipoEquipoClaseDetailDocumento
                        tipo_equipo_clase={tipo_equipo_clase}
                        permisos={permisos}
                        cargarTipoEquipo={() => cargarDatos()}
                    />
                </TabPanel>
                <TabPanel>
                    <TipoEquipoClaseCampoCRUD tipo_equipo_clase={tipo_equipo_clase}/>
                </TabPanel>
                <TabPanel>
                    <TipoEquipoClaseRutinas tipo_equipo_clase={tipo_equipo_clase}/>
                </TabPanel>
            </Tabs>
        </DetailLayout>
    </ValidarPermisos>
};

export default TipoEquipoClaseDetail;