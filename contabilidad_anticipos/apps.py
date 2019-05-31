from django.apps import AppConfig


class ContabilidadAnticiposConfig(AppConfig):
    name = 'contabilidad_anticipos'

    def ready(self):
        import contabilidad_anticipos.signals
