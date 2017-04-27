---
title: make replicated prototypes for a profit
---

There's a feeling in the startup world these days that if you can't scale to some hundred million users, your idea isn't worth a thing. I want to share my particular experience of building and scaling a company while making individual products.

The whole **Makers** movement is based on the idea that you can manufacture for your own needs, but they really work and think at a consummer scale. Businesses also feel the need for tailor-made solutions at a mass-market price. However, they have stricter requirements in term of reliability and knowledge requirements that makes buying a 3D printer and hand-assembling things not an option.

Enters [Holusion](https://holusion.com).

Holusion is a small startup in the holograms business. Not those scientific laser diffraction patterns, but the fancy **ghost images** you might have seen [here](http://www.cbsnews.com/news/tupac-coachella-hologram-behind-the-technology/) and [there](http://cinimodstudio.com/portfolio/ralph-lauren-holographic-window-display/).

It's mainly a communication device and as such, fall under "corporate communication 101" problem :

- Only premium companies will pay a premium price
- Every company want a premium feeling to its communication

Looks like a good candidate for the "replicated prototype" way of doing things.

## Design for composability OR usability

There's this old software conflict of [composability VS usability](https://www.johndcook.com/blog/2011/08/15/usability-versus-composability/) which I find a lot more universal than I first thought. It's a notion we can apply to a hardware product's components. The more you make components self-sustained - the way you embed them in  your product, the more composable they are.

For example, take a typical digital signage setup :

<!--TODO Make a shema -->
    220V__________
        |         |
       PSU       PSU
        |         |
    Computer -> Screen

    Or:
    220V___
           |
      Embedded PSU_
        |         |
    Computer -> Screen

You just gained a PSU's worth of space !

Now imagine you go frenzy and decide to look up your screen components. You'll quickly discover that the real setup is :

    12V_______________________________________
      |                                       |
    Computer -> A/D VGA chip -> VGA Cable -> A/D vga chip −> LCD Panel

So you can work with a BtoB supplier who will be able to provide you with custom LVDS/backlight cables and a compatible board. Now your setup is just :


  220V_
       |
      PSU
       |
  Computer -(LVDS+backlight cable)-> LCD Panel

Nice! The screen is now less than one centimeter thick, and you have just one board to power, doing all the work. Perfect!

**is it?**

No. By doing this, you lost your ability to swap screen or card. LVDS cables are implementation dependant and you need a pair of cables for virtually any board - panel combination you'll do.

**But surely I can rule out the individual PSUs?**

You may... But keep in mind that the cheapest cards on the market are ARM-based and some require 5V Supply.

**So what does it mean?**

There's  a balance to find between how composable your components are and how useable your end product need to be.


## Inspirations

There's some literacy on building a [manufacturing startup](http://johnnybowman.org/post/153644788496/how-not-to-fuck-up-your-manufacturing-startup). One could also find a lot of agile software methods to iterate on your solution. While unadapted to the hardware business, I still find them full of good practices I can bend to my needs. My preferred ressource those past few years was undoubtedly [running lean](https://www.amazon.fr/Running-Lean-Iterate-Plan-Works-ebook/dp/B006UKFFE0) from Ash Maurya. I see it as an agile development method for business models.
