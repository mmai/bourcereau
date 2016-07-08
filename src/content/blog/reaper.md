---
title: Reaper sous ubuntu
date: 2015-12-19
tags: reaper, daw, linux, ubuntu
lang: .
draft: true
template: post.jade
---

Installation du DAW Reaper sous ubuntu.

## Installation de _wine ASIO_ (gestion asio sous wine) et wine-rt (noyau low latency sous wine)

### Repo kstudio

Suivre les instructions de cette page : http://kxstudio.linuxaudio.org/Repositories
puis :
```sh
sudo apt-get update
sudo apt-get install wine wineasio wine-rt
wine64 regsvr32 wineasio.dll
```

## Installation de Reaper

Télécharger la version windows 64bits sur le site
Installer
