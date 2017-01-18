---
title: You should make your own website
---

One can see some trends recently regarding internet publisher's ecosystem. Because Facebook's instant articles played a role in [trump's election](https://shift.newco.co/im-sorry-mr-zuckerberg-but-you-are-wrong-65dbf8513424#.cm82tee33). Because google's AMP is as closed as it can be. It's also a topic that have long been dear to my heart.

<center>
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Online self publishing isn&#39;t dying. It&#39;s just being abandonned. <a href="https://t.co/YVN2Y2HmiT">https://t.co/YVN2Y2HmiT</a></p>&mdash; Sebastien Dumetz (@sdumetz) <a href="https://twitter.com/sdumetz/status/791938755040940032">October 28, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

yes, I'm quoting myself.

Most people are arguing on why AMP and instant article are "bad" solutions, or at least worst than existing alternatives ; ie. *search engines & websites*.

In short, [personalized content](http://highscalability.com/blog/2016/12/5/the-tech-that-turns-each-of-us-into-a-walled-garden.html) is hard. Harder than just indexing the web. Which is hard too. And everyone is struggling on this.

**If we don't want massive websites with flawed algorithms to rule the web, we need to help build alternatives**

And why so? Because indexing new content is hard. You see, text parsing is easy. Let's try it :

```
wget http://some-random-url.com  |wget "lollipops"
```

BAM! I know if `some-random-url.com` talks about lollipops, like should any serious website. Make a crawler from that and you're the new google.

Well, it *might* be a little harder than this, with some gotchas and, you know, *minor* pitfalls.

Now try doing something alike with a video...

So?

Image analysis is still in it's infancy. In 2016, google still don't know the difference between a [Xbox and a potato](https://www.reddit.com/r/circlejerk/comments/2wnfnt/gaming_console_if_you_vote_this_up_it_will_show/). It's a little cheat, but still : telling what's in a video without metadata is hard as hell.

*Just throw in metadata then*

Yeah, we should. And search engines only read `<meta name="keywords">` from html pages. Who would abuse that?

So how are video ranked? Simple : they are trusted because a content provider says they should be. However, online video distribution is considered a winner-takes-all market. 

**instant articles and AMP are not new : They're a generalization of the way we use videos**.

When you think of it, it's kind of logical : as the web evolves to be more dynamic, dynamic content distribution systems gain more momentum and clever companies figures ways to use them elsewhere. It reminds me of something we've seen in the past :

{% include image_card.html image="/data/posts/yahoo-design.jpg" alt="yahoo portal old design" text="Remember when the web looked like this?" %}

Back in the days, unless you were featured on a web "portal", noone was going to hear from you.

I believe it's what is happening right now with video.
