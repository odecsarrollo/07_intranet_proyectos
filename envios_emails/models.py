from django.db import models
from knox.auth import User
from model_utils.models import TimeStampedModel

from contabilidad_anticipos.models import ProformaAnticipo
from cotizaciones_componentes.models import CotizacionComponente, CotizacionComponenteDocumento


class CotizacionComponenteEnvio(TimeStampedModel):
    cotizacion_componente = models.ForeignKey(
        CotizacionComponente,
        related_name='envios_emails',
        on_delete=models.PROTECT
    )
    archivo = models.ForeignKey(
        CotizacionComponenteDocumento,
        related_name='envios_emails',
        on_delete=models.PROTECT
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cotizaciones_componentes_enviadas')
    correo_from = models.CharField(max_length=500)
    correos_to = models.CharField(max_length=500)


class CobroEnvio(TimeStampedModel):
    proforma_anticipo = models.ForeignKey(
        ProformaAnticipo,
        related_name='envios_cobros',
        on_delete=models.PROTECT
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cobros_enviadas')
    correo_from = models.CharField(max_length=500)
    correos_to = models.CharField(max_length=500)
    archivo = models.FileField(null=True)
    version = models.PositiveIntegerField()
