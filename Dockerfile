FROM python:3.6-buster

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for mysqlclient, Pillow, WeasyPrint (cairo/pango), cryptography, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    libffi-dev \
    libssl-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libpng-dev \
    libcairo2 \
    libcairo2-dev \
    libpango-1.0-0 \
    libpango1.0-dev \
    libgdk-pixbuf2.0-0 \
    libgdk-pixbuf2.0-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app

# Gunicorn will bind to 0.0.0.0:8000 by default in compose.
CMD ["gunicorn", "intranet_proyectos.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]

