@echo off
docker build -t front:latest .
docker tag front gcr.io/central-list-413121/front:latest
docker push gcr.io/central-list-413121/front:latest