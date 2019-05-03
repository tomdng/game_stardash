#!/bin/bash

git pull
cd ~/Coding/python/stardash/game_stardash
rm -rf Cadre/Joueur.py
cp -r Joueur.py Cadre
cd Cadre/Joueur.py
make
cd ../Cerveau
yarn start



