---
title: Writing a native evdev adapter
---

I’ve recently found myself in need of a library to read evdev events.
Usually, the X server will retrieve those events, parse them and send them to the concerned X client. In my case though, I needed xpad events from a gamepad. The only existing way to get them through X is the joystick driver, but it has been designed to control X server with a controller instead of a mouse.

All I wanted was to have a way to fire an event saying :

*hey, someone pressed button A!*

Quite simple. Except I could not find much literature on how to do it, especially in a way I could implement with nodejs.

There are two documented projects that act as evdev event reader helpers : Libevdev and python-evdev. I heard there’s also a ruby one but did not use it.

I could have written a libevdev wrapper, wut it would have required a deep understanding in libav's internals to work with async I/O.

I decided to write my own simple basic interface. Here is what I learned in the process.

## Linux input architecture.

First thing first, let’s have a look at what we’re facing.

Linux kernel is managing input devices with drivers like [xpad](https://github.com/paroj/xpad). Those devices generate evdev events that are exposed through character devices (which are fifo buffers) located in /dev/input.

Those devices are numbered like : `/dev/input/event0`, `/dev/input/event1` and so on.

They are also available in more human-readable ways in `/dev/input/by-path/`.
A joystick will be exposed as :
`/dev/input/by-path/<usb_bus_id>-event-joystick`

When reading this file, kernel’s [input.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/input.h) tell us we’ll get this data structure:
```
struct input_event {
struct timeval time;
__u16 type;
__u16 code;
__s32 value;
};
```

*timeval* being a structure of two *int64* on 64bits systems  &ndash; for 32bits systems, it would be *int32* &ndash; representing seconds and microseconds.

So an event is a 24 or 16 bytes datastructures. Note that Evdev may send multiple events at once.

## Writing the Adapter

**With nodejs Examples**

Once you understand the event model, this part is in fact really simple. All you need to do is really to open a buffer and read from it.

### Fetching messages


That's the easy part. Reading a buffer and parsing it’s data isn’t what’s going to keep us up all night.

The sweet part here is we can do it all in native javascript.

First you need to find your device, depending on what you're looking for.

```
var device = "/dev/input/by-path/your_device_path";
var options = {
        flags: 'r',
        encoding: null,
        fd: null,
        autoClose: true
      };
fd = fs.createReadStream(device,options)
  .on('data', function(buf){
    var i,j, chunk = self.arch === 64 ?24 :16;
    for (i=0,j=buf.length; i<j; i+=chunk) {
      //parse the buffer
    }
  })
  .on("error",function(e){
    console.error(e);
  });
```

Now for the parsing, the base principle is to just assign bytes to the structure's fields.

There is a small gotcha with *int64* parsing in javascript. However it has already been solved by others :

```
var ev = {
     time : {}
   }
   if (this.arch === 64){
     low = buf.readInt32LE(0);
     ev.time.tv_sec = buf.readInt32LE(4) * 4294967296.0 + low;
     if (low < 0) time.tv_sec += 4294967296;
     low = buf.readInt32LE(8);
     ev.time.tv_usec = buf.readInt32LE(12) * 4294967296.0 + low;
     if (low < 0) time.tv_usec += 4294967296;
     offset = 16;
   }else{
     ev.time.tv_sec = buf.readInt32LE(0);
     ev.time.tv_usec = buf.readInt32LE(4);
     offset = 8;
   }
   ev.type = buf.readUInt16LE(offset);
   ev.code = buf.readUInt16LE(offset + 2);
   ev.value = buf.readUInt32LE(offset + 4);
```

Next steps depends on your goal, but if you want to parse event to assign readable strings like “BTN_A”, “ABS_X”, etc. or generate events from node’s EventEmitter interface, you can reuse my [node-evdev](https://github.com/sdumetz/node-evdev) project.

### Querying evdev


Now if we look at the way libevdev is querying informations, here is what the source tell us (in [libevdev.c](https://github.com/whot/libevdev/blob/master/libevdev/libevdev.c#L379)) :

```
ioctl(fd, EVIOCGID, &dev->ids);
Constant EVIOCGID is defined in input.h as :
#define EVIOCGID _IOR(‘E’, 0x02, struct input_id)
```

If we follow the lead, it takes us to :

```
#define	_IOR(g,n,t)	_IOC(IOC_OUT,	(g), (n), sizeof(t))
#define _IOC(inout,group,num,len) \
	(inout | ((len & IOCPARM_MASK) << 16) | ((group) << 8) | (num))
#define	 IOC_OUT 		0x40000000	 /* copy out parameters */
```

(cherry-picked from linux kernel’s sys/ioctl.h)

Based on this, the only real problem is to find sizeof(t).
The structure we used in libevdev is easy to find. However it’s quite complex and would require some time to be ported to javascript with Uint/Int16/longint… adapters. But for now, we only need the input_id structure, which is once again found in the kernel's input.h :

```
input_id {
 __u16 bustype;
 __u16 vendor;
 __u16 product;
 __u16 version;
};
```

4 Uint16. Easy. However there is still one problem to solve : There is no way to make ioctl calls in native js. I could have used an adapter, but it would be overkill for just a single call. Let's just make a c++ addon.

** The following sample uses [nan](https://github.com/nodejs/nan) for portability**

The implementation mimicks libevdev's method `evdev_new_from_fd()`. It's convenient because we already got a file-descriptor in javascript : We can just pass it through this function to get the peripheral's infos.

```
#include <nan.h>
#include <sys/ioctl.h>
#include <linux/input.h>
#include <fcntl.h>
#include <errno.h>
#include <stdio.h>
#include <string.h>

using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;
using Nan::GetFunction;
using Nan::New;
using Nan::Set;
using Nan::To;


NAN_METHOD(evdev_new_from_fd) {
  int rc;
  struct input_id id;
  rc = ioctl(To<int>(info[0]).FromJust(), EVIOCGID, &id);
  if(rc == -1 ){
    Nan::ThrowError(strerror(errno));
    //Nan::ThrowError(info[0]);
  }
  v8::Local<v8::Object> size = Nan::New<v8::Object>();
  Nan::Set(size,Nan::New("bustype").ToLocalChecked(), Nan::New<v8::Number>((double)id.bustype));
  Nan::Set(size,Nan::New("vendor").ToLocalChecked(), Nan::New<v8::Number>((double)id.vendor));
  Nan::Set(size,Nan::New("product").ToLocalChecked(), Nan::New<v8::Number>((double)id.product));
  Nan::Set(size,Nan::New("version").ToLocalChecked(), Nan::New<v8::Number>((double)id.version));
  info.GetReturnValue().Set(size);
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("evdev_new_from_fd").ToLocalChecked(),GetFunction(Nan::New<FunctionTemplate>(evdev_new_from_fd)).ToLocalChecked());
}

NODE_MODULE(ioctls, Init)
```

I think I will never get over v8's horrible coding style. apart from it, it's quite straightforward. We fill in an  `input_id` with `ioctl()` then just convert it to v8 data structures.

### Conclusion

The great thing in having a pure-js event parser is that context-switching in nodejs addons [are slow](https://www.akawebdesign.com/2015/11/17/node-js-addons-a-case-study-in-speed/). It also keep the code simple and tidy.

While we need to compile an addon to retrieve the peripheral's metadata, it's not always required and still quite simple in the end.

I've been using this module for one year now with no problem in my [electron](http://electron.atom.io/)
