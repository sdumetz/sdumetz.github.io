---
title: Providing codecs informations on HTML5 video
image: /data/posts/html5_video_codec.png
---

The HTML5 VideoElement allows for codecs informations in the `type` property. For once, even safari seems to happily support it. How is it important? Because browsers will choose **the first input they can play** solely depending on the `type` property (or file extension, if absent). Once they make the wrong choice (i.e. A too high level mp4 video for iOS/ a low end android), they'll just hang there forever.

However, the codecs infos are really not so well documented. I made detailed search on the subject and here are all the bytes you could need to describe your h.264 presets.

## Introduction

an h.264 video is described as :
```
  <source src="/path/to/video.mp4" type='video/mp4 codecs="avc1.4D401F"'>
```

`avc1` being h.264's reference. the 3 hex bytes after the dot are :

- profile_idc
- constraint_set
- level_idc

hereafter you'll find a complete description of their meaning.

## Byte 1 : profile_idc

in h.264 syntax, profile is usually given as a string. For example using libav or ffmpeg, we'll set it with `-profile:v high`. libx264's code has a simple if chain to parse those (in `common/common.c`)

{%highlight c %}
    static int profile_string_to_int( const char *str )
    {
        if( !strcasecmp( str, "baseline" ) )
            return PROFILE_BASELINE;
        if( !strcasecmp( str, "main" ) )
            return PROFILE_MAIN;
        if( !strcasecmp( str, "high" ) )
            return PROFILE_HIGH;
        if( !strcasecmp( str, "high10" ) )
            return PROFILE_HIGH10;
        if( !strcasecmp( str, "high422" ) )
            return PROFILE_HIGH422;
        if( !strcasecmp( str, "high444" ) )
            return PROFILE_HIGH444_PREDICTIVE;
        return -1;
    }
{%endhighlight %}


We can get the corresponding *integer* in `common/set.h`
{%highlight c %}
    enum profile_e
    {
        PROFILE_BASELINE = 66,
        PROFILE_MAIN     = 77,
        PROFILE_HIGH    = 100,
        PROFILE_HIGH10  = 110,
        PROFILE_HIGH422 = 122,
        PROFILE_HIGH444_PREDICTIVE = 244,
    };
{%endhighlight}

so here is the complete translation from profile string to **profile_idc**

| profile | enum | idc |
| baseline| 66   | 42  |
| main    | 77   | 4D  |
| high    | 100  | 64  |
| high10  | 110  | 6E  |
| high422 | 122  | 7A  |
| high444 | 244  | 7A  |

## Byte 2 : constraint_set

Again from the code :

{% highlight c %}
sps->b_constraint_set0  = sps->i_profile_idc == PROFILE_BASELINE;
/* x264 doesn't support the features that are in Baseline and not in Main,
 * namely arbitrary_slice_order and slice_groups. */
sps->b_constraint_set1  = sps->i_profile_idc <= PROFILE_MAIN;
/* Never set constraint_set2, it is not necessary and not used in real world. */
sps->b_constraint_set2  = 0;
sps->b_constraint_set3  = 0;

sps->i_level_idc = param->i_level_idc;
if( param->i_level_idc == 9 && ( sps->i_profile_idc == PROFILE_BASELINE || sps->i_profile_idc == PROFILE_MAIN ) )
{
    sps->b_constraint_set3 = 1; /* level 1b with Baseline or Main profile is signalled via constraint_set3 */
    sps->i_level_idc      = 11;
}
/* Intra profiles */
if( param->i_keyint_max == 1 && sps->i_profile_idc >= PROFILE_HIGH )
    sps->b_constraint_set3 = 1;
{% endhighlight %}

****

A bit more difficult to read but in the end pretty straightforward. The tricky thing here is given how these are written in headers, `constraint_set0` is the highest order bit.

b_constraint_set0 to b_constraint_set5 and 2 reserved bytes. The code tells us constraint_set2 is never used. Also, 4 and 5 are not implemented in libx264. The last 4 bytes are written as :

```
bs_write( s, 4, 0 );    /* reserved */
```

 so we have this mask : `xx0x0000`

0 and 1 are easy to figure out :

Having PROFILE_MAIN, we get : `constraint_set1=1` any higher profile would yield `constraint_set1=0`. ``constraint_set0` is set only when using PROFILE_BASELINE.

Then constraint_set3 is set if *level_idc is 9 AND profile is BASELINE or MAIN.* or : *keyint_max = 1 and profile_idc is HIGH or more**

Easy to figure out if you know your encoding options. If not, any tool would give those results.

A quick look at `common/set.c` tells us that bits 4 and 5 are treated as the other reserved.

|profile     |  bits    | byte |
| baseline   | 11000000 | 0xC0 |
| main       | 01000000 | 0x40 |
| high       | 00000000 | 0x00 |
| high(intra)| 00010000 | 0x10 |

**Note : ** this changes if your level_idc is **9** and `profile <= MAIN` . Check later  section and add `0x10` if it's the case.

### Byte 3 : level_idc

We have 2 syntaxes for levels. **4.1** or **41** means the same thing.
The code speaks for itself :

{% highlight c %}
if( !strcmp(value, "1b") )
            p->i_level_idc = 9;
        else if( atof(value) < 6 )
            p->i_level_idc = (int)(10*atof(value)+.5);
        else
            p->i_level_idc = atoi(value);
{% endhighlight %}

**1b** is a special case that yields a **9**. Other values are converted

So we just take our level and convert it to hex.


## Conclusion

For a standard h.264 Main Concept level 3.1 video, your codec code would be : `avc1.4D401F`. For any other stream, you can then infer the bytes from your encoding options.
