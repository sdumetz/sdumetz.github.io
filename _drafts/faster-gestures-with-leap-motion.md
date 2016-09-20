---
title: A faster Leap Motion experience
---

Like many, I was really enthousiast when the Leap motion was unveiled some years ago. At last, a company that emphasized on gesture recognition's main problems : Speed and precision. Like most, I have been disappointed. Still not fast enough, still not precise enough. There is still not much to do in the land of gesture control. Or is there?

## Why is Leap Motion so bad?

Don't get me wrong, the leap motion SDK is great and is a big deal in why it got some initial traction. I'm not pretending I would have made a better job or anything. However, let's face it :

**differencing a *blob* from a finger is hard as hell**

To demonstrate it, let's imagine this common use case :

I have a leap motion demo, running idle on my monitor. Suddenly, I want to show a customer how it works. `"Hey, look at how well it recognises movements"` * swipes in front of the box*. Aaaand... Nothing. It takes a few frames for the leap motion to detect what just appeared as a finger. Then a few more frames to get a correct velocity approximation. A swipe of the hand is only half a second long, tops!

So I need my hand to stay stable for half a second, be sure the leap motion detect it, don't move too fast or too far away or withh too strange positions or it will need to re-detect my hand.

Unusable.

## Why do I need fingers?

I just need a gesture! Movement! "User ask me to go right" type of thing. Let's say I don't care if it's a figner, or anything reflecting IR light.

If something moves right above my sensor, it's probably meaningful.

It might not be your use case. For what I know, it might not be anyone else's use case. But it's mine.

## Extracting data

The [Leap SDK](https://developer.leapmotion.com/) won't help you here. It knows 2 things :
- Raw data
- Hands (and associated subsystems : fingers, tools, ...)

No "Unidentified light blob" here. That's a shame, because I imagine they have such a map at some point in their internal filtering, and it's probably way better than mine.

So let's get raw data from the Leap.

{% highlight cpp %}
controller.images()[0];
{% endhighlight %}

Not `frame.images()` because as stated in the [doc](https://developer.leapmotion.com/documentation/cpp/api/Leap.Controller.html#cppclass_leap_1_1_controller_1a85588dbb02a8ff793cf2ced9067f8263) : * the images obtained with this function can be newer than images obtained from the current frame of tracking data.*

Don't add unnecessary delay.

<center>
  {% include image_card.html image="/data/posts/leap_camera_image_raw.png" alt="a leap motion raw image" text="Here we discover that my monitor is quite IR-reflective" %}
</center>

The first thing we'll do is rule out all unnecessary data. Computations on pixel maps can be quite heavy and it's a good idea to reduce the dataset early. I just needed to see movement on the X axis so the first step was to linearize the image.

Due to the large viewing angle, the leap lenses make a fisheye effect on images. We first need to rectify them.

It's either possible to create a shader for it or a function to rectify the full image. The later is fully explained in the [doc](https://developer.leapmotion.com/documentation/cpp/api/Leap.Image.html#cppclass_leap_1_1_image_1a4c6fa722eba7018e148b13677c7ce609).

Now that my image is rectified, I'll just linearize it :

{% highlight cpp %}
unsigned char * raw_data = controller.images()[0].data();
unsigned char linear_data[640];
for(int x=0;x<640;x++){
  for(int y=90;y=150;y++){
    //prevent overflow by dividing the value by the number of lines.
    linear_data[x] = raw_data[IMAGE_WIDTH*y+x]/60;
  }
}
{% endhighlight %}

That's a 640 bytes array containing all the info we'll need.

<center>
  {% include image_card.html image="/data/posts/leap_image_linearized.png" alt="image of my hand with linearized data" text="The raw image, and the result of linearisation at the bottom" %}
</center>

## There's more !

You can visualize this greyscale data, it's already great and precise. There's another great thing we can get out of the leap : Stereovision. You heard Stereo was hard? How about stereo vision computing on a greyscale 1d array? Let's try.

Just extract data from `controller.images()[1]` the same way we just did.

We'll make a multiplication of our values, offsetted by a `STEREO` factor. This will naturally filter out dots that are not on our target height. Thee higher the STEREO diff, the lower the points.

This is **NOT** fool-proof. Imagine you set a diff of 60 nad got 2 fingers distant of 60px. It will be well correlated and maybe not at the target height. However like I said, we're looking for movement, not spacial interpolation precision.
