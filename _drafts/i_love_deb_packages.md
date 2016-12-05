---
title: I love debian packages
---

Of all dist methods I've worked with, the one that's given me the most satisfaction is to simply package my stuff in a `deb`, and be done with it.

I've been hearing a lot of Javascript fatigue and I think "modern" distribution packagers have their role in it. The early success of [yarn](https://yarnpkg.com/) proves it. I'm not one to think bower, npm and the likes don't add their own unique features, or even that anyone *should* not use them. It's just that I got that feeling deb packages aren't getting all the love they deserve.

I wanted to set this right, and share some patterns I've been using to get work done.

## Apt repositories

First and foremost sweetness in deb packages is the repository structure that comes with it. Simple and well defined, it allows all sorts of infrastructure, from script-generated flat directory for 1 to 10 packages, to tens of thousands of versionned, sorted files.

Remember npm's [left-pad](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) catastrophe? Wether or not maintainers should directly depend on such a simple piece of work instead of include it is out of the question. The real thing is that you depend on something you don't fully trust (the NPM registry) and are unable to duplicate.

Distributing your own packages *is* really simple. There are loads of solutions out there. Here are the one I got to know :

- [reprepro] (https://mirrorer.alioth.debian.org/) : Simple script-based solution. Great to distribute a few open-source files.
- [aptly](https://www.aptly.info/) : Full-featured, with snapshots and everything.

To be honest, those are still lacking a bit of work to be really user friendly. That's why I work on a [web interface](https://github.com/sdumetz/aptly-web-ui) on top of aptly.

## All in the box

Having a "dist tarball" is a must as soon as you do serious business. debian packages provides you this, but also a full-featured deploy script management.

Least known feature I've found to be usefull is the startup script management. If you drop a systemd, upstart or init.d file in your `debian/` directory, it will automagically be used as a service file; installed, updated, restarted as such.

Be aware however that as of jessie, dh-systemd is still not enabled by default and you will need to add it as a build dependency.
