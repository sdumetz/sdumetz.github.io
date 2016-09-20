---
title: Blender cloud rendering
---

Anyone who have already rendered 3D scenes knows it : Whatever computing power you have, it's not enough the days you have some real shit to do. But hey, isn't it the promises of cloud computing to allow me to have zero Computer when i need none, then unleash hell when I want to render my stuff?

## Previous attempts

I'm not the first one to try this. There have been [Brenda](https://github.com/jamesyonan/brenda), but known to have an unforgiving command line. There is also some commercial rendering solutions, which looks good on a price point of view but :

- Blender is often overlooked in commercial solutions
- They only offer a "click on my html buttons" interface

As blender tasks are fully automatable from python script, I just wanted a URL I could use to send a `.blend` file to be rendered.

**Eat that, cloud!**

In this spirit, I also found [rendering on lambda](http://blog.megafaunasoft.com/2015/02/worlds-cheapest-render-farm.html) was possible.

## The game changer

What has changed since 2015? Docker.

Docker is meant exactly to provide a lightweight isolated environment for your rendering jobs. It's easy to set up and orchestration systems have been popping up like hell those months.

OK, I'll admit about 50% of the reasons I made this is because I wanted to try the beast.

## Cloud Renderer

It was amazingly simple. I wrote mine in nodejs because it's the environment I'm most comfortable with and the wiring is simple enough to be OK with any [supported language](https://cloud.google.com/docs/).

Similarly, I used google cloud because the 300$ trial is perfect for this experiment but any cloud provider has equivalents for what I got here.

### Make a container

I simply pulled the excellent blender container from [ikester](https://hub.docker.com/r/ikester/blender/) :

{% highlight docker %}
FROM ubuntu:xenial

MAINTAINER Isaac "Ike" Arias <ikester@gmail.com>

RUN apt-get update && \
	apt-get install -y \
		curl \
		bzip2 \
		libfreetype6 \
		libgl1-mesa-dev \
		libglu1-mesa \
		libxi6 && \
	apt-get -y autoremove && \
	rm -rf /var/lib/apt/lists/*

ENV BLENDER_MAJOR 2.77
ENV BLENDER_VERSION 2.77a
ENV BLENDER_BZ2_URL http://mirror.cs.umn.edu/blender.org/release/Blender$BLENDER_MAJOR/blender-$BLENDER_VERSION-linux-glibc211-x86_64.tar.bz2

RUN mkdir /usr/local/blender && \
	curl -SL "$BLENDER_BZ2_URL" -o blender.tar.bz2 && \
	tar -jxvf blender.tar.bz2 -C /usr/local/blender --strip-components=1 && \
	rm blender.tar.bz2

VOLUME /media
ENTRYPOINT ["/usr/local/blender/blender", "-b"]
{% endhighlight %}

BAM! working blender inside docker. End of the story. We'll be modifying this later to add a subscription to fetch rendering queue items.

### pub/sub

I used Pub/Sub from [google](https://cloud.google.com/pubsub/overview), but really any mechanism would have cut it. I don't see any value in self-hosting this While messages volume is easily manageable: messaging fees are ridiculous. Never gonna exceed one buck a month. Ever.

First thing first, authenticate. Gonna need it too on the server so I created a `services.js` file to auth in the Pub/Sub service.
{% highlight javascript %}
var pubsub = require('@google-cloud/pubsub');
var auth = {
  projectId: 'PROJECT_ID',
  keyFilename: 'API_KEY_FILE.json'
}
var pubsubClient = pubsub(auth);
module.exports = {
  queue: pubsubClient.topic('rendering-queue')
}
{% endhighlight %}

Note that we don't actually create the topic here. We have to do it in the [admin console](https://cloud.google.com/pubsub/quickstart-console).

Then we subscribe to the service, get one pending message, spawn blender to render it... More on that later.

### Storage

google cloud storage on nodejs, simple.
We're gonna use it to store our pending jobs' data and rendered frames.

Authentication is exactly the same as with pub/sub. Quite straightforward with the [doc](https://googlecloudplatform.github.io/google-cloud-node/#/).
