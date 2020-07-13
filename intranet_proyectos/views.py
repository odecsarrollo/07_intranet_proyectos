from index.tasks import simulate_send_emails


# Vista que llama a la tarea.
def send_emails(request):
    print('entro a send emails')
    simulate_send_emails.delay(10)
