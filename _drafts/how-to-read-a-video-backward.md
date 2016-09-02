---
title: How to read a video Backward (Part 1)
---

I've recently faced an unexpected challenge in trying to read (decode & display) a video backward at normal speed. For someone who don't know shit about video encoding, it looks like it should be as straightforward as calling `video.previousFrame()`... except it's not. Let's see why and how we worked around this to create a new generation of holographic applications.

We made a free software based on this : Check out [Stingray](https://github.com/Holusion/stingray) for the code!

## Some background.

### Backward reading

Files are not made to be read backward. It's a fact in computer science, it has been since computer were big lamps that read punch cards.

As far as my reading got, the best way to go back a few bytes in a file is to close it, reopen it, then offet the reader to our known desired position.

Reading frame 9, then 8, then 7... will then require us to open the file at the begining of frame 9, then reopen it on 8, etc...

### Video encoding

Most of today's video codecs use a similar process for compression. Only the underlying compression algorithm differ. The process is quite similar to images compression. Additionally, recent codecs will use the fact that videos are composed of many images that will often have at least some common content (think : moving foreground on fixed background). h.264, MPEG4, etc... are all taking advantage of this to implement a concept of keyframes (or [I](https://en.wikipedia.org/wiki/Video_compression_picture_types) frame). A keyframe is defined as a complete image stored within a data stream. Every other frames (P frames) only contains incremental changes based on the previous frame.

This is the reason  you sometimes get a few seconds of messed up background with just moving parts : Your device just skipped a keyframe.

For the sake of completeness, some algorithms are using B frames that can rely on forward frames for data reference.

{% include image_card.html image="https://upload.wikimedia.org/wikipedia/commons/6/64/I_P_and_B_frames.svg" alt="I, P and B frames illustration" text='A sequence of video frames. Source : <a href="https://en.wikipedia.org/wiki/File:I_P_and_B_frames.svg">Wikipedia</a>' %}

For this reason, seeking precisely in a video is very slow. Backward seek especially as most frames in a video are effectively P frames.

### Draft a solution

So I can't just make up a `decode_previous_frame()` function to decode frames in the inverse order. As far as I know, there is only one thing to do : Position the read pointer, batch decode some frames and reorder them in a buffer for a reading routine.

To go from frame 20 to frame 0 :

- Decode frames [10..20], revert the array and push to buffer
- Decode frames [0..10], same thing

And so on. The first batch can be on display while the second one is decoded. To do so, we will need to find balance for our batch size : larger sizes will please the decoder as it doesn't have to `seek_back()` too much (which we know forces it to reopen the file), but a smaller size will reduce initial delay and memory footprint as we won't need to keep as much images.

How to choose the decode batch size? **As small as possible as long as decode speed is enough**.

Let's speed it up then.

## Speed up

I'm going with [libav](https://libav.org/avconv.html) here, some differences can be observed with other decoding softwares, but mainly they all work the same.

The video encoding problem at its root is unsolvable: Any frame, to be decoded need any amount of previous frames already decoded, each frame only referencing that it needs the previous one. It means if I want to seek to frame 10 and start decoding, the decoder might need to decode every previous frames up to frame 1. Unacceptable.

### Enters MJPEG

MJPEG or Motion-JPEG is simply a concatenation of JPEG-Encoded images. It offer the compression ratio of JPEG, around 1:5 which is not bad but clearly less than modern high-compression codecs like MPEG (can go up to 1:100).

MJPEG has been quite forgotten in recent years with the diffusion of high performance codecs, due to hardware accelerated decoding and web diffusion, respectively nullifying the need for an easy-to-decode format and requiring high bandwidth savings. however it's still supported mainly for professionnal applications that require a fast random access.

Turns out I didn't even need to re-code anything to make seek fast on MJPEG videos with libav:

    avformat_seek_file([...]);

is fast enough to be negligible for chunks as small as 10 frames.

As for the video size, a HD video of 10 seconds weigh in at 30MB. It's large but not unmanageable.

For reference, here is the CLI options to encode a MJPEG video using **avconv** :

```
avconv -r 25 -y -i "<INPUT_VIDEO>" -g 1 -keyint_min 0 -c:v mjpeg -an -q:v 2 -pix_fmt yuvj420p "<OUTPUT_VIDEO>.mov"
```

The `-keyint_min` and `-g` options seems mandatory to prevent avconv from further optimizing the video.


### Reduce delays

So we can now decode the video stream backward. However there is still a delay when we want to switch from `forward` to `backward` mode. That's easily solved using a double buffer :

- Decoded frames are put in a front_buffer, waiting to be played
- Displayed frames are put in a back_buffer
- Once the back_buffer overflows, it's frames are automatically discarded.

When the user hits the `switch_direction` button, we just have to switch the buffers from front to back.

You can now have high frequency direction switch without any delay or performance penalty.

## Conclusion

We got ourselves a decent interactive video player at no cost. I did not describe the code precisely as :

1. Most of it is boilerplate (keyboard controls, SDL configuration, etc.)
2. It's available under [GNU-GPL](https://www.gnu.org/licenses/licenses.fr.html) as a free software initiative by [holusion](http://holusion.com) names [Stingray](https://github.com/Holusion/stingray).

In next part I will talk about our projects to further improve it using next generation video codecs like MJPEG-2000 and  H.264/AVC for [better compression](http://iphome.hhi.de/marpe/download/perf_spie03.pdf).
