import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import miCuentaReducer from './generales/miCuentaReducer';
import menuReducer from './generales/menuReducer';
import auth from './generales/authentication/authenticationReducer';

import proyectosReducer from './especificas/proyectos/proyectosReducer';
import proyectosArchivosReducer from "./especificas/proyectos/archivosProyectosReducer";
import literalesArchivosReducer from "./especificas/proyectos/archivosLiteralesReducer";
import miembrosLiteralesReducer from './especificas/proyectos/miembrosLiteralesReducer';
import fasesReducer from './especificas/proyectos/fasesReducer';
import fasesLiteralesReducer from './especificas/proyectos/fasesLiteralesReducer';
import tareasFasesReducer from './especificas/proyectos/tareasFasesReducer';
import literalesReducer from "./especificas/proyectos/literalesReducer";
import itemsLiteralesReducer from "./especificas/proyectos/itemsliteralesReducer";
import colaboradoresReducer from "./especificas/cguno/colaboradoresReducer";
import centrosCostosColaboradoresReducer from "./especificas/cguno/centrosCostosColaboradoresReducer";
import itemsCgunoReducer from "./especificas/proyectos/itemsBiableReducer";

import colaboradoresCostosMesesReducer from "./especificas/cguno/colaboradoresCostosMesesReducer";
import hojasTrabajosDiariosReducer from "./especificas/mano_obra/hojaTrabajoDiarioReducer";
import horasHojasTrabajosDiariosReducer from "./especificas/mano_obra/horasHojaTrabajoDiarioReducer";
import horasColaboradoresProyectosInicialesReducer
    from "./especificas/mano_obra/HorasColaboradoresProyectosInicialesReducer";

import clientesReducer from "./especificas/clientes/clientesReducer";
import clientesContactosReducer from "./especificas/clientes/clientesContactosReducer";
import clientesCanalesDistribucionReducer from "./especificas/clientes/canalesDistribucionReducer";
import clientesTiposIndustriasReducer from "./especificas/clientes/tiposIndustriasReducer";

import cotizacionesReducer from "./especificas/cotizaciones/cotizacionesReducer";
import cotizacionesSeguimientosReducer from "./especificas/cotizaciones/cotizacionesSeguimientosReducer";
import cotizacionesArchivosReducer from "./especificas/cotizaciones/archivosCotizacionesReducer";

import configuracionCostos from './especificas/configuraciones/configuracionCostosReducer';

import sistemaInformacionOrigenReducer from './especificas/sistema_informacion_origen/sistemaInformacionOrigenReducer';

import paisesReducer from './especificas/geografia/paisesReducer';
import ciudadesReducer from './especificas/geografia/ciudadesReducer';
import ciudadesCatagolosReducer from './especificas/cargues_catalogos/ciudadesCarguesCatalogosReducer';
import departamentosReducer from './especificas/geografia/departamentosReducer';
import categoriaProductoReducer from './especificas/items/categoriaProductoReducer';
import monedasCambiosReducer from './especificas/importaciones/monedasCambiosReducer';
import proveedoresImportacionesReducer from './especificas/importaciones/proveedoresImportacionesReducer';
import margenesProveedoresReducer from './especificas/importaciones/margenesProveedoresReducer';
import formaPagoCanalReducer from './especificas/listas_precios/formasPagosReducer';

import bandaEurobeltColorReducer from './especificas/bandas_eurobelt/coloresReducer';
import bandaEurobeltMaterialReducer from './especificas/bandas_eurobelt/materialesReducer';
import bandaEurobeltTipoReducer from './especificas/bandas_eurobelt/tiposReducer';
import bandaEurobeltSerieReducer from './especificas/bandas_eurobelt/seriesReducer';
import categoriasDosReducer from './especificas/bandas_eurobelt/categoriasDosReducer';
import componentesReducer from './especificas/bandas_eurobelt/componentesReducer';


import itemVentasCatalogosProductosReducer from './especificas/catalogos_productos/itemsVentasReducer';

import mediosAdhesivosReducers from './especificas/medios/adhesivosReducers';
import mediosAdhesivosMovimientosReducers from './especificas/medios/adhesivosMovimientosReducers';

import {reducer as notificationsReducers} from 'react-notification-system-redux';

const rootReducer = combineReducers({
    menu_status: menuReducer,
    mis_permisos: misPermisosReducer,
    permisos: permisosReducer,
    grupos_permisos: gruposPermisosReducer,
    mi_cuenta: miCuentaReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: notificationsReducers,
    form: formReducer,
    auth,
    proyectos: proyectosReducer,
    miembros_literales: miembrosLiteralesReducer,
    fases: fasesReducer,
    fases_literales: fasesLiteralesReducer,
    fases_tareas: tareasFasesReducer,
    literales: literalesReducer,
    items_literales: itemsLiteralesReducer,
    colaboradores: colaboradoresReducer,
    items_cguno: itemsCgunoReducer,
    centros_costos_colaboradores: centrosCostosColaboradoresReducer,
    colaboradores_costos_nomina: colaboradoresCostosMesesReducer,
    hojas_trabajos_diarios: hojasTrabajosDiariosReducer,
    horas_hojas_trabajos: horasHojasTrabajosDiariosReducer,
    horas_colaboradores_proyectos_iniciales: horasColaboradoresProyectosInicialesReducer,
    clientes: clientesReducer,
    clientes_tipos_industrias: clientesTiposIndustriasReducer,
    clientes_contactos: clientesContactosReducer,
    clientes_canales: clientesCanalesDistribucionReducer,
    cotizaciones: cotizacionesReducer,
    cotizaciones_seguimientos: cotizacionesSeguimientosReducer,
    configuracion_costos: configuracionCostos,
    archivos_cotizaciones: cotizacionesArchivosReducer,
    archivos_literales: literalesArchivosReducer,
    archivos_proyecto: proyectosArchivosReducer,

    sistemas_informacion_reducer: sistemaInformacionOrigenReducer,

    ciudades_catalogos: ciudadesCatagolosReducer,
    geografia_ciudades: ciudadesReducer,
    geografia_departamentos: departamentosReducer,
    geografia_paises: paisesReducer,

    categorias_productos: categoriaProductoReducer,
    monedas_cambios: monedasCambiosReducer,
    proveedores_importaciones: proveedoresImportacionesReducer,
    margenes_proveedores: margenesProveedoresReducer,
    formas_pagos_canales: formaPagoCanalReducer,

    banda_eurobelt_tipos: bandaEurobeltTipoReducer,
    banda_eurobelt_series: bandaEurobeltSerieReducer,
    banda_eurobelt_materiales: bandaEurobeltMaterialReducer,
    banda_eurobelt_colores: bandaEurobeltColorReducer,
    banda_eurobelt_categorias_dos: categoriasDosReducer,
    banda_eurobelt_componentes: componentesReducer,

    catalogos_productos_items_ventas: itemVentasCatalogosProductosReducer,

    medios_adhesivos: mediosAdhesivosReducers,
    medios_adhesivos_movimientos: mediosAdhesivosMovimientosReducers   
});

export default rootReducer;