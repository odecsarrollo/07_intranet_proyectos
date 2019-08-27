from django.apps import AppConfig


class CotizacionesComponentesConfig(AppConfig):
    name = 'cotizaciones_componentes'

    def ready(self):
        import cotizaciones_componentes.signals
