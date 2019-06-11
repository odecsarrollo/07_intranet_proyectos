from django.apps import AppConfig


class SistemasEquiposConfig(AppConfig):
    name = 'sistemas_equipos'

    def ready(self):
        import sistemas_equipos.signals