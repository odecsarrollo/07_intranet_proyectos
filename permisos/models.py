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


class MenuVentasProyectosPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_ventas_proyectos_configuraciones', 'Menu Ventas Proyectos Configuraciones'),
            ('menu_ventas_proyectos_resumen_tuberia_ventas', 'Menu Ventas Proyectos Resumen Tuberia Ventas'),
            ('menu_ventas_proyectos_cotizaciones', 'Menu Ventas Proyectos Cotizaciones'),
            ('menu_ventas_proyectos_clientes', 'Menu Ventas Proyectos Clientes'),
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
        )
