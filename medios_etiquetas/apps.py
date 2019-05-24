from django.apps import AppConfig


class MediosEtiquetasConfig(AppConfig):
    name = 'medios_etiquetas'

    def ready(self):
        import medios_etiquetas.signals