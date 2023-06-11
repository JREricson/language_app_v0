
set -o errexit


set -o nounset

# python3 manage.py flush --no-input
python3 manage.py migrate --no-input
python3 manage.py collectstatic --no-input
python3 manage.py runserver 0.0.0.0:8000

# TODO start script is not added yet