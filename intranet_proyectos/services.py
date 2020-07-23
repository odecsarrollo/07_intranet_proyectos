import boto3

from intranet_proyectos.settings import AWS_ACCESS_KEY_ID
from intranet_proyectos.settings import AWS_SECRET_ACCESS_KEY
from intranet_proyectos.settings import ENVIAR_SMS


def send_sms(
        phone_number: str,
        message: str
):
    if AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID and ENVIAR_SMS:
        sns = boto3.client(
            'sns',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name="us-east-1"
        )
        sns.publish(
            PhoneNumber=phone_number,
            Message=message,
            MessageAttributes={
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': "OdecoCloud"
                }
            }
        )
