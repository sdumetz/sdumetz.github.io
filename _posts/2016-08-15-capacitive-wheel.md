
# Large capacitive wheel design

I've found myself in need of a large sliding sensor. Many solutions exists for small sizes, including ipod's great capacitive wheel. Thanks to some makers, one can now easily find designs to reproduce it ([here](https://bryanduxbury.com/2013/12/05/designing-a-capacitive-touch-wheel-in-openscad-and-eagle/)).

However, when it comes to large size sensors, I found myself in lack of good references. So here it is :

## How to make a 15cm capacitive wheel sensor

I've used the [arduino Leonardo](https://www.arduino.cc/en/Main/ArduinoBoardLeonardo) as I know it well and already knew how to use it as a joystick. It'spossible to do capacitive reading with the bare board using the [CapSense](http://www.pjrc.com/teensy/td_libs_CapacitiveSensor.html) library. However the sensitivity/stability wasn't quite high enough and I used an Arduino Shield embedding the [MPR121](https://www.sparkfun.com/datasheets/Components/MPR121.pdf) controller.

### Design

The main thing to take into account with capacitive sensors is electrode surface. It's what will make your sensor's Gain. While it's possible to tune capacitance by adding a small capacitance in parallel as advised for the CapSense Library, it will just lengthen the measure process. It's sometimes necessary, especially when not using a controller designed for rapid Discharge Analog Reads like the arduino. With a dedicated controller however, I've seen no reason to tune the sensor this way. THis leaves us with the bare truth :

    Nothing will improve your electrode's sensitivity except a better design.

Dedicated controller datasheets contain some advices on how to design good electrodes. Read the internet if you want to make your own idea, but here is what I learned :

- Thickness is not *that* important. If you have a choice, thin is better.
- Any nearby metal part (including wiring copper) will cause perturbation proportional to size and proximity.

Large copper surfaces on a standard PCB, as far away as possible from the wiring seems to be a good solution. However we should take care not to fill the PCB with copper as it would cause interferences.

Here is the final design I made :

# Embed SVG Drawing

It's largely inspired by the patent and existing small wheels, except it has maximized electrodes count as 3 electrodes are clearly not a good fit for such a large design.

### PCB manufacturing

I embedded the svg in a [Fritzing](http://fritzing.org/) project, added some wiring. Be careful with that, it's dependent on your shield's wiring. Mine has the following :

### Code

I was not able to find code on finger position interpolation for this type of sensors. Fortunately, it was not too difficult to do. However it required some fine tuning to work smoothly.

We will use the unmodified code of Adafruit's [MPR121](https://github.com/adafruit/Adafruit_MPR121) Library. Internally it uses the [Wire](https://www.arduino.cc/en/Reference/Wire) libray. You'll need to install both.

    #include <Wire.h>
    #include <Joystick.h>
    #include <MPR121.h>
    #include <Coordinates.h>

We will later modify Adafruit's code to tune results.

the best way to get results out of a slider is to do a **center of mass** calculation. However we don't need a (x,y) position but an angle and an amplitude. It's easy enough once you have fast `polar <-> cartesian` coordinates conversions. The [coordinates](https://github.com/sdumetz/coordinates) library does exactly that.

Cells are represented as vectors, with an angle corresponding to their position on the circle and a radius corresponding to the sensed signal. MPR121's filtered results for untouched cells are generally `-4< res <=0` (because of a bit shift in the library code) so we filter out negative results.

The code is quite simple :

# centerOfMass calculation


We made ourselves an easy way to detect touch : If radius is large enough, one or many adjacent cells are touched.

# Example of touch cases

If a finger is in the middle of 2 cells, the addition of vectors will give an accurate result as expected.

# Exemple of touch between 2 cells

However if the user uses two fingers, results can be quite funny.

### Optimizing

While the MPR121 library is really good, it does not allow us to customize the controller's registers. How is that a problem?

If we log the filtered results, we will notice a bump after a touch. That's because a prolonged touch on the sensor will make it think the electrode capacitance has changed. It's designed to be able to react to fast environment changes at that's good, but it's not what we want here.

MPR121's Application note [3891](http://www.nxp.com/files/sensors/doc/app_note/AN3891.pdf) gives us some examples on how to tune registers to have the best filter configuration for our use case.

<img align="center" class="img-responsive" src="img/MRP121_AN_case8.png" alt="Use case from Application Note 3891"/>

We will modify MPR121.cpp to push customized values into registers. Fortunately Adafruit's code is easily readable.

# Modified registers & signification

# Archive of the modified library
