from django.db import models
from model_utils.models import TimeStampedModel


class ConfiguracionCosto(TimeStampedModel):
    fecha_cierre = models.DateTimeField(null=True, blank=True)
