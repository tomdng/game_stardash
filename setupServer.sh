#!/bin/bash
# Allows relative pathing
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

git pull
rm -rf ./Cadre/Joueur.py
cp -r ./Joueur.py ./Cadre
cd ./Cadre/Joueur.py
make
cd ../Cerveau
yarn start



