---
title: Xmonad et XFCE
date: 2015-08-24
tags: xmonad, xfce, linux
lang: .
draft: true
template: post.jade
---

Xmonad est un gestionnaire de fenêtres très efficace pour organiser proprement ses fenêtres et mettre en place un workflow.
Il peut s'interfacer avec les environnements de bureau comme Gnome, kde ou XFCE.

xfce4-panel

```sh
wget https://xmonad-log-applet.googlecode.com/files/xmonad-log-applet-2.1.0.tar.gz
tar xvzf xmonad-log-applet-2.1.0.tar.gz
cd xmonad-log-applet-2.1.0
sudo aptitude install xfce4-panel-dev
./configure --with-panel=xfce4
make
sudo make install
```
