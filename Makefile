ifneq (,$(wildcard ./.env.dev))
include .env.dev
export
ENV_FILE_PARAM = --env-file .env.dev
COMPOSE_FILE  = docker-compose-dev.yml
PARENT_DIR = language_app_v0-1
DJANGO_SERVICE = django_be

endif

build:
	docker-compose -f $(COMPOSE_FILE) up --build -d 

build-logs:
	docker-compose -f $(COMPOSE_FILE) up --build 

up:
	docker-compose -f $(COMPOSE_FILE)  up -d

down:
	docker-compose -f $(COMPOSE_FILE) down

logs:
	docker-compose -f $(COMPOSE_FILE) logs

logs-f:
	docker-compose -f $(COMPOSE_FILE) logs -f

migrate:
	docker-compose -f $(COMPOSE_FILE) exec django_be python3 manage.py migrate

makemigrations:
	docker-compose -f $(COMPOSE_FILE) exec django_be python3 manage.py makemigrations

superuser-make:
	docker-compose -f $(COMPOSE_FILE) exec django_be python3 manage.py createsuperuser

collectstatic:
	docker-compose -f $(COMPOSE_FILE) exec django_be python3 manage.py collectstatic --no-input --clear

down-v:
	docker-compose -f $(COMPOSE_FILE) down -v

app-shell:
	docker  exec -it $(PARENT_DIR)_$(DJANGO_SERVICE)_1 sh

volume:
	docker volume inspect $(PARENT_DIR)_postgres_data

db-psql:
	docker-compose -f $(COMPOSE_FILE) exec db psql --username=postgres --dbname=postgres

test:
	docker-compose -f $(COMPOSE_FILE) exec django_be pytest -p no:warnings --cov=.

test-html:
	docker-compose -f $(COMPOSE_FILE) exec django_be pytest -p no:warnings --cov=. --cov-report html

flake8:
	docker-compose -f $(COMPOSE_FILE) exec django_be flake8 .

black-check:
	docker-compose -f $(COMPOSE_FILE) exec django_be black --check --exclude=migrations .

black-diff:
	docker-compose -f $(COMPOSE_FILE) exec django_be black --diff --exclude=migrations .

black:
	docker-compose -f $(COMPOSE_FILE) exec django_be black --exclude=migrations .

isort-check:
	docker-compose -f $(COMPOSE_FILE) exec django_be isort . --check-only --skip env --skip migrations

isort-diff:
	docker-compose -f $(COMPOSE_FILE) exec django_be isort . --diff --skip env --skip migrations

isort:
	docker-compose -f $(COMPOSE_FILE) exec django_be isort . --skip env --skip migrations

schema-make:
	docker-compose -f $(COMPOSE_FILE) exec django_be python3 manage.py spectacular --file schema.yaml