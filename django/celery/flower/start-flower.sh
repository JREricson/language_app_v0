#!/bin/bash

set -o errexit

set -o nounset


worker_ready(){
    celery -A language_app inspect ping
}

until worker_ready; do 
    >&2 echo 'Flower is waiting for Celery worker...'
    sleep 1

done
>&2 echo 'Celery workers are available and ready!'

# flower \
celery -A language_app --broker="${CELERY_BROKER}" flower
    