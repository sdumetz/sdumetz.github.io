---
title: Read a video Backward (Part 2)
---

In previous post, I stated how I made a video player capable of reading a file from back to front. However I'm quite a beginner in video encoding and I felt there was improvements to be made.

video intra modes are a thing for profesionnals. Most consummer applications are doing well with default mode. Here is what I found.

## Benchmark method

I needed a benchmark for my particular use case. Two things should be compared :

- Decode speed
- Video quality

### Speed

Decode speed is easy : Just make the decoder loop and log results. I got pretty consistent results out of those simple lines of code (using [stingray's decoder](https://github.com/Holusion/stingray)) :

```
void cycle(decoder::VideoDecoder* decoder,entities::Video* video ){
  int i,c;
  std::chrono::high_resolution_clock::time_point p(std::chrono::high_resolution_clock::now());

  for (c=0;c<10;c++){
    decoder->decodeAndWrite(*video->buffer);
    for(i=0;i<DECODE_SIZE;i++){
      video->buffer->read();
    }
  }
  using dura = std::chrono::duration<double>;
        auto d = std::chrono::high_resolution_clock::now() - p;
        std::cout << "Decode cycle: "
            << std::chrono::duration_cast<dura>(d/10).count()
            <<" s"
            << std::endl;
}
```

Running it on a highest quality (`-q 2`) MJPEG video I got 0.165 s/chunk. (Chunk size of 20) &ndash; which maps to 121 fps. Real world speed will be a bit less as the system will be busy doing other things (reading inputs, displaying frames).

Lowering the quality helps a lot, obviously. Encoding my test video with `-q 10` makes the bitrate drop from *45kbps* to *22kbps*.

That's for the old-but-working **MJPEG** codec. the interesting thing to note here is correlation between bitrate and decode speed.

<center>
<table>
  <thead>
    <tr>
      <th>-q &nbsp;</th><th>bitrate &nbsp;</th><th>decode time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2</td><td>45596.1    </td><td>0.165s </td></tr>
    <tr><td>10</td><td>22591.4    </td><td>0.123s </td></tr>
  </tbody>
</table>
</center>

### Quality

Quality is a bit harder. However as avconv quality options `-b`, `-crf`, `-q`, etc. do not behave consistently at all across codecs. For example, *h.264* produce good quality results with `-crf 20`, while *vp8* is really bad with `-q 10`...

I needed a distortion measurement algorithm to get solid results for comparisons. However, keep in mind that even absolute rate/distortion grade is not a good [assessment](https://www.hindawi.com/journals/tswj/2014/743604/) of your encoding's quality : It does not capture it as perceived by the human eye.

I did not find a good tool to do it: Manual review it is.

## h.264 encoding

**libx264** has an intra mode. let's see what is does :

```
avconv -y -f image2 -i render/frame-%04d.png -vcodec libx264 -an -crf 20 -g 1 -profile:v high test_stingray.mp4
```

<center>
<table>
  <thead>
    <tr>
      <th>-crf &nbsp;</th><th>bitrate &nbsp;</th><th>decode time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>10</td><td>62021.3    </td><td>0.10s </td></tr>
    <tr><td>20</td><td>21206.61    </td><td>0.090s </td></tr>
    <tr><td>40</td><td>5725.8    </td><td>0.0676786 </td></tr>
  </tbody>
</table>
</center>

A few thing we can already take for granted :

- h.264 decoding is faster than MJPEG for the same bitrate.
- for lower bitrates (< 30kb/s), h.264 yields better quality.

My quality measurement is empiric. Just run the tests if you want to be sure.

## jpeg2000

the problem with jpeg2000 is it's not really well supported by ffmpeg. While it provides (on linux) a wrapper to encode a video using libopenjpeg, libavcodec doesn't decode it out of the box. i had to fiddle a bit to find suitable options.
```
avconv -y -f image2 -i render/frame-%04d.png -vcodec jpeg2000 -compression_level 50 -an -g 1 -pix_fmt yuv420p j2k_test_stingray.mov
```

compression_level is an int between 0 (lossless) and ?! &ndash; I could not find the max, but anything above 100 is clearly unusable.

According to previous research, file size vs quality should be roughly equivalent to h.264 intra. However I could not test it as the decoder refuses to decode it properly (as do most regular video players...).

## vp8

[Webm](https://fr.wikipedia.org/wiki/WebM) is an open video file format sponsored by google. It's modern and supports mainly **vp8** and **vp9** video codecs. Only vp8 is supported natively by ffmpeg so let's try it

```
avconv -y -f image2 -i render/frame-%04d.png -codec:v libvpx -qmin 1 -qmax 8 -threads auto -codec:a none webm_stingray.webm
```

Notice how the `-g 1` flag is gone? [vp8](https://en.wikipedia.org/wiki/VP8) is natively pure-infra. Fun fact : If you encode the video using `-g 1`, it will weight 3 times as much. Go figure...

Results :

<center>
<table>
  <thead>
    <tr>
      <th>-q &nbsp;</th><th>bitrate &nbsp;</th><th>decode time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1-4</td><td>12672.8kbits/s </td><td>0.098 s </td></tr>
    <tr><td>1-8</td><td>6501.6kbits/s </td><td>0.090 s </td></tr>
  </tbody>
</table>
</center>

Really good. However there is not correlation between libvpx's `-qmin`, `-qmax` and h.264's `-q`.  

Interestingly, using **vp9** though it reduces file size for another 20%, halves decode speed. Further research shows that encoding consistently uses 4 to 5 times more CPU, and decoding 50% more than **vp8**. Which makes it ineligible for our use case.

## Conclusions

The codec war, while not targetted on our use case, provides us with some interesting tools. Video decode speed and file size can be improved significantly over the venerable MJPEG codec.
