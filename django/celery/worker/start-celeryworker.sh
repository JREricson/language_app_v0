#!/bin/bash

set -o errexit

set -o nounset

watchmedo auto-restart -d language_app/ -p "*.py" -- celery -A language_app worker --loglevel=info




