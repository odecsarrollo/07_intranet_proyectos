from django.apps import AppConfig


class MediosAdhesivosConfig(AppConfig):
    name = 'medios_adhesivos'

    def ready(self):
        import medios_adhesivos.signals
