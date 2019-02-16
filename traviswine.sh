#!/bin/sh
sudo dpkg --add-architecture i386
wget -nc https://dl.winehq.org/wine-builds/winehq.key
sudo apt-key add winehq.key
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ trusty main'
sudo apt update
sudo apt install --install-recommends winehq-devel
# winecfg
# sudo apt install wine-mono
# sudo npm install -g winresourcer
sudo wget http://dl.winehq.org/wine/wine-mono/4.7.5/wine-mono-4.7.5.msi -o /usr/share/wine/mono/wine-mono-4.7.5.msi
sudo apt-get install winetricks
winetricks
