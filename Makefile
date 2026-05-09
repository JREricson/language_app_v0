ifneq (,$(wildcard ./.env.dev))
include .env.dev
export
ENV_FILE_PARAM = --env-file .env.dev
COMPOSE_FILE  = docker-compose.dev.yml
PARENT_DIR = language_app_v0-1
DJANGO_SERVICE = django_be
REGISTRY = ghcr.io
IMAGE_BASE = $(REGISTRY)/$(GH_USERNAME)/$(GH_REPOSITORY_NAME)
endif

ARGS = $(filter-out $@,$(MAKECMDGOALS))

.PHONY: build build-logs up down logs logs-f migrate makemigrations makesuperuser \
        collectstatic down-v app-shell volume db-psql test test-html flake8 \
        black-check black-diff black isort-check isort-diff isort schema-make cat \
        dcMigrate dcAppExec dcAppMan dcBuildWebImageOnGithubDev \
        dcBuildNginxImageOnGithubDev dcLoginGithub dcPushWebGithub dcPushNginxGithub

build:
	docker compose -f $(COMPOSE_FILE) up --build -d 

build-logs:
	docker compose -f $(COMPOSE_FILE) up --build 

up:
	docker compose -f $(COMPOSE_FILE) up -d

down:
	docker compose -f $(COMPOSE_FILE) down

logs:
	docker compose -f $(COMPOSE_FILE) logs

logs-f:
	docker compose -f $(COMPOSE_FILE) logs -f

migrate:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py migrate

makemigrations:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py makemigrations

makesuperuser:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py createsuperuser

collectstatic:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py collectstatic --no-input --clear

down-v:
	docker compose -f $(COMPOSE_FILE) down -v

app-shell:
	docker exec -it $(PARENT_DIR)_$(DJANGO_SERVICE)_1 sh

volume:
	docker volume inspect $(PARENT_DIR)_postgres_data

db-psql:
	docker compose -f $(COMPOSE_FILE) exec db psql --username=postgres --dbname=postgres

test:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) pytest -p no:warnings --cov=.

test-html:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) pytest -p no:warnings --cov=. --cov-report html

flake8:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) flake8 .

black-check:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) black --check --exclude=migrations .

black-diff:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) black --diff --exclude=migrations .

black:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) black --exclude=migrations .

isort-check:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) isort . --check-only --skip env --skip migrations

isort-diff:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) isort . --diff --skip env --skip migrations

isort:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) isort . --skip env --skip migrations

schema-make:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py spectacular --file schema.yaml

cat:
	cat $(COMPOSE_FILE)

dcMigrate:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py migrate $(ARGS)

dcAppExec:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) $(ARGS)

dcAppMan:
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py $(ARGS)

dcBuildWebImageOnGithubDev:
	docker build -f ./django/Dockerfile.dev -t $(IMAGE_BASE)/web:latest ./django

dcBuildNginxImageOnGithubDev:
	docker build -f ./nginx/Dockerfile -t $(IMAGE_BASE)/nginx:latest ./nginx

dcLoginGithub:
	docker login $(REGISTRY) -u $(GH_USERNAME) -p $(GH_TOKEN)

dcPushWebGithub:
	docker push $(IMAGE_BASE)/web:latest

dcPushNginxGithub:
	docker push $(IMAGE_BASE)/nginx:latest

loadFixture :
	docker compose -f $(COMPOSE_FILE) exec $(DJANGO_SERVICE) python3 manage.py loaddata $(ARGS)


%:
	: