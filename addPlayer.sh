#!/bin/bash
# Allows relative pathing
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd ./Cadre/Joueur.py
make
./run Stardash
cd ./
