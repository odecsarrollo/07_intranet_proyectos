from django.db import models
from django.contrib.auth.models import Permission


class PermissionPlus(models.Model):
    permiso = models.OneToOneField(Permission, related_name='plus', null=True, blank=True, on_delete=models.PROTECT)
    nombre = models.CharField(null=True, blank=True, max_length=200)
    activo = models.BooleanField(default=False)


class AditionalDefaultPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('list_user', 'Can list user'),
            ('can_change_user_password', 'Puede cambiar password de usuario'),
            ('list_permission', 'Can list permission'),
            ('list_group', 'Can list group'),
            ('detail_user', 'Can detail user'),
            ('detail_group', 'Can detail grupo'),
            ('make_user_superuser', 'Can make user superuser'),
            ('make_user_staff', 'Can make user staff'),
            ('make_user_active', 'Can make user active'),
        )


class MenuAdminPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_admin_permisos', 'Menu Admin Permisos'),
            ('menu_admin_permisos_grupos', 'Menu Admin Grupos Permisos'),
            ('menu_admin_terceros_usuarios', 'Menu Admin Terceros Usuarios'),
            ('menu_admin_terceros_clientes', 'Menu Admin Terceros Clientes'),
            ('menu_admin_terceros_costos_nomina', 'Menu Admin Terceros Costos Nomina'),
            ('menu_admin_terceros_colaboradores', 'Menu Admin Terceros Colaboradores'),
            ('menu_admin_terceros_proveedores', 'Menu Admin Terceros Proveedores'),
            ('menu_admin_sistemas_informacion', 'Menu Admin Sistemas Información'),
            ('menu_admin_importaciones', 'Menu Admin Importaciones'),
            ('menu_admin_geografia', 'Menu Admin Geografía'),
            ('menu_admin_items', 'Menu Admin Items'),
            ('menu_admin_listas_precios', 'Menu Admin Listas Precios'),
            ('menu_admin_seguimientos_cargues', 'Menu Admin Seguimientos Cargues'),
            ('menu_admin_configuracion_costos', 'Menu Admin Configuracion Costos'),
            ('menu_admin_facturas', 'Menu Admin Facturas'),
            ('menu_admin_sistema_informacion_reporte_venta_items', 'Menu Admin Sis. Inf. Repo. Venta Items'),
        )


class MenuProyectosPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_proyectos_proyectos', 'Menu Proyectos Proyectos'),
            ('menu_proyectos_fases', 'Menu Proyectos Fases'),
            ('menu_proyectos_mano_obra_verificar_horas', 'Menu Proyectos Mano Obra Verificar Horas'),
            ('menu_proyectos_mano_obra_hojas_trabajo', 'Menu Proyectos Mano Obra Hojas de Trabajo'),
            ('menu_proyectos_mano_obra_horas_hojas_trabajo', 'Menu Proyectos Mano Obra Horas Hojas de Trabajo'),
        )


class MenuGerenciaPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_gerencia_informe_ventas', 'Menu Gerencia Informe Ventas'),
            ('menu_gerencia_informe_acuerdo_pagos_valores', 'Menu Gerencia Acuerdos de Pagos Valores'),
        )


class MenuVentasProyectosPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_ventas_proyectos_configuraciones', 'Menu Ventas Proyectos Configuraciones'),
            ('menu_ventas_proyectos_resumen_tuberia_ventas', 'Menu Ventas Proyectos Resumen Tuberia Ventas'),
            ('menu_ventas_proyectos_cotizaciones', 'Menu Ventas Proyectos Cotizaciones'),
            ('menu_ventas_proyectos_clientes', 'Menu Ventas Proyectos Clientes'),
        )


class MenuVentasComponentesPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_ventas_componentes_cotizaciones', 'Menu Ventas Componentes Cotizaciones'),
            ('menu_ventas_componentes_clientes', 'Menu Ventas Componentes Clientes'),
        )


class ModuloPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('modulo_admin', 'Modulo Admin'),
            ('modulo_proyectos', 'Modulo Proyectos'),
            ('modulo_ventas', 'Modulo Ventas'),
            ('modulo_ventas_componentes', 'Modulo Ventas Componentes'),
            ('modulo_medios', 'Modulo Medios'),
            ('modulo_sistemas', 'Modulo Sistemas'),
            ('modulo_contabilidad', 'Modulo Contabilidad'),
            ('modulo_bandas_eurobelt', 'Modulo Eurobelt'),
            ('modulo_gerencia', 'Modulo Gerencia'),
        )
