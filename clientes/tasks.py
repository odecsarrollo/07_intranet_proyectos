from celery import shared_task
from time import sleep
from celery import Celery

# from celery.schedules import crontab

app = Celery()
app.conf.timezone = 'Europe/Madrid'


# El decorador shared_task sirve para crear tareas independientes a la app.
# La tarea solo es una simulación tonta.
# Pero sabed que podéis usar cualquier librería y clase aquí. Incluido el orm para acceder a la bd.
@shared_task
def simulate_send_emails(num_emails):
    from django.core.mail import send_mail
    print('entro a simulate_send_emails')
    for i in range(1, num_emails):
        send_mail(
            'Prueba %s' % i,
            'Here is the message.',
            'prueba@odecopack.com',
            ['fabio.garcia.sanchez@gmail.com'],
            fail_silently=False,
        )
        print('entro a enviar %s' % i)
    return 'Emails sended'


# @app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     # Ejecuta la tarea test('hello') cada 10 segundos
#     sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')
#
#     # Ejecuta la tarea test('world') cada 10 segundos
#     sender.add_periodic_task(30.0, test.s('world'), expires=10)
#
#     # Ejecuta la tarea cada lunes a las 7:30 am
#     sender.add_periodic_task(
#         crontab(hour=7, minute=30, day_of_week=1),
#         test.s('Happy Mondays!'),
#     )


@app.task
def test(arg):
    print(arg)

# app.conf.beat_schedule = {
#     'add-every-15-seconds': {
#         'task': 'clientes.tasks.test',
#         'schedule': 15,
#         'args': ('Soy Yo',)
#     },
# }
