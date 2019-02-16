#!/bin/sh
sudo dpkg --add-architecture i386
wget -nc https://dl.winehq.org/wine-builds/winehq.key
sudo apt-key add winehq.key
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ trusty main'
sudo apt update
sudo apt install --install-recommends winehq-devel
sudo apt install wine-mono
