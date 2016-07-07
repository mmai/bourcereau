---
title: A little productivity hack on Linux
date: 2015-09-07
tags: productivity, linux
lang: en
draft: false
template: post.jade
---

Owen Williams explains in [this article](http://thenextweb.com/insider/2015/02/25/this-weird-productivity-hack-actually-made-me-more-efficient/) how he has improved its productivity with a setting on MacOS which allow a synthesized voice to announce the time each hour. It works as a reminder to focus on his work rather than procrastinate.

Here is how to implement the same functionnality on Debian/Ubuntu.

You need *Espeak* for speech synthesis and *Mbrola* to improve the result with a pleasant voice.

```sh
sudo apt-get install espeak mbrola mbrola-en1
```

You should now be able to make your computer speak with this command : 
```sh
espeak -s 140 -v mb/mb-en1 "It's "`date +%R`
```

The option `-v mb/mb-en1` tells  mbrola to use the enhanced voice and `-s 140` allows to slow down the diction. The `date +%R` command gives the current time.

The scheduler needs to know the XDG_RUNTIME_DIR environment variable to correctly manage sound.
You can check it with the command `env |grep XDG_RUNTIME_DIR`, this should be something like */run/user/1000* in a typical debian/ubuntu setting.

With this information you can create a shell script */usr/local/bin/saytime.sh* with this content : 
```sh
#!/bin/sh

export XDG_RUNTIME_DIR=/run/user/1000
/usr/bin/espeak -s 140 -v mb/mb-en1 "it is "`date +%l` o'clock"
```

and add the line `0 * * * * sh /usr/local/bin/saytime.sh` in cron with the command `crontab -e ` in order to execute the script each hour.



