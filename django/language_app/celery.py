from __future__ import absolute_import

import os

from celery import Celery
from language_app import settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "language_app.settings")

#naming file for celery app as language_app
app = Celery("language_app", broker=settings.result_backend)

app.config_from_object("language_app.settings", namespace="CELERY"),

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)