from django.apps import AppConfig


class ProyectosConfig(AppConfig):
    name = 'proyectos'

    def ready(self):
        import proyectos.signals
