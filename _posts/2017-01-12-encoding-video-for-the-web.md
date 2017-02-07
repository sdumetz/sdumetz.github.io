---
title: Encoding videos for the web in 2017
image: /data/posts/reduced_speed.png
---

I've fiddled a bit recently with self-made HTML5 video players. While it's easy to use and now widely compatible, I've had some trouble encoding videos. So here is my cheat sheet for mobile-first video distribution in 2017, including an in-depth look into mp4/webm performance.


## Encoding commands

I used libav's `avconv` tool on debian Jessie. It uses [libav56](https://packages.debian.org/jessie/libav-tools). older versions might lack the proper options for webm format. In the following examples, I'll assume usage of a png frames sequence as input. Otherwise, just remove the `-f image2` option.

First thing first : mp4.

{%highlight shell %}
  avconv -y -f image2 -i path/to/frame-%04d.png -c:v libx264 -c:a copy -pix_fmt yuv420p -profile:v main -level 31  output_file.mp4
{% endhighlight %}

Note : The iphone 3 is requiring an even lower set with `-profile baseline -level 31`. According to apple's [doc](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html) on http streaming, earlier iphones support only `-level 30`. Those settings are for iphone 4 and above. Apple doesn't advertise which devices support h.264 High profile so I don't know when it'll be "safe" to upgrade.


Should we still provide multiple fallbacks now? It depends. MPEG-4/H.264 is clearly the most widely supported format. However a quick look in [caniuse.com](http://caniuse.com/#feat=mpeg4) show that Opera Mini still don't support MPEG4/H.264. Well, it's not like it supports any other format though.

So with firefox supporting mp4 since v35 (Jan 2015) and Opera since v25 (Oct 2014), my own [video for everybody](http://camendesign.com/code/video_for_everybody/test.html) script just got a lot simpler with no *flashPlayer* or *video/ogv* fallbacks.

What of the *video/webm*?

- **Pros**
  - More compact
  - Easy seek (more on this later)
- **Cons**
  - iOS crash if we put it first
  - android seems to ignore it if it's not first

However, encoding in vp8 is no longer a great trouble. While most earlier guides would make you install some voodoo to be able to export your webm file, a stock avconv will now do :

{% highlight shell %}
  avconv -f image2 -i path/to/frame-%04d.png -c:v libvpx -c:a libvorbis -qmin 20 -qmax 30 -threads auto  output_file.webm
{% endhighlight %}

## Encoding choice

Now is it worth it to replace good ol' h.264 ? Let's check the rate/distortion gain. Unlike previous empirical results [from me]({% post_url 2016-10-06-how-to-read-a-video-backward-2 %}) and [others](http://www.streamingmedia.com/articles/editorial/featured-articles/first-look-h.264-and-vp8-compared-67266.aspx), I'll try to go *scientific* here. While we're at it, I'll also test vp9 encoding.


Since we're serious about it, let's compare a few things :

- H.264 main profile 31
- H.264 high profile 41
- VP8 (1 or 2 pass)
- VP9 (1 or 2 pass)

I didn't do 2pass on H.264 as crf (default quality setting) doesn't support it. To be really complete, I should try with constant bitrate and other quality-control settings.

However, here's the script I made to test all this :

<script src="https://gist.github.com/sdumetz/3e9cee1e991b8351abe881de0880d937.js"></script><noscript> Gist available on <a href="https://gist.github.com/sdumetz/3e9cee1e991b8351abe881de0880d937">Github</a></noscript>

Give it a png sequence *aaaaand it's done*.

### Results?

As of now I only measure PSNR (Peak Signal/Noise ratio), added throughout every images. Run the tests at home, YMMV as always.

```
MP4(main) : 1665kB . PSNR : 15902.2121
MP4(high) : 1705kB . PSNR : 15904.4900
VP8 (1 p) : 1595kB . PSNR : 15848.7263
VP8 (2 p) : 1617kB . PSNR : 15859.8030
VP9 (1 p) : 1614kB . PSNR : 15880.7009
VP9 (2 p) : 1471kB . PSNR : 15908.0548
```

*Higher PSNR = lower distortion.*

### How much should I trust this?

**Not much**. Signal/Noise ratio is a thing, but it doesn't make a difference between this noise in the background and movement noise that makes your video look bad. However, it's still a hint on real encoding quality.

### Conclusion

Providing a bazilion of fallbacks is no longer required if you target mobile devices, which tends to have up to date browsers and can't be older than 2006 (obviously...), or are not meant to play video anyway.

a fallback to vp8/vp9 encoded video could provide some meaningfull bonus, but is by no means a no-brainer. It depends how much your viewers will rely on seek capacities, for example.

Those measures were enough to convince me to drop ogv support make webm secondary in my [online video service](https://pixel.holusion.com).

**To be continued** : How good are VP8/VP9 when the user seeks a specific time?
