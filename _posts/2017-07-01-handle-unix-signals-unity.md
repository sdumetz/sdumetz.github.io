---
title: Handle linux signals in Unity3D
image: /data/posts/linux_signals.png
---

Unity3D's portable runtime based on [Mono](http://www.mono-project.com/) has become a great "write once run everywhere" tool for interactive apps or video games. However stable it is, there is always some edge cases to portability. The handling of SIGTERM, SIGINT, etc... linux (well, [POSIX](https://en.wikipedia.org/wiki/Unix_signal#POSIX_signals)) signals are one of them.


## The bug

Make a dummy unity3D app. Make it do some work in `OnApplicationQuit()` callback. Get it's PID and terminate it with `kill <pid>`. The exit handler never get called.

Other app lifecycle events like `GameObject.OnDestroy()` obviously won't get called either because scene cleanup is a consequence of a proper exit sequence.

linux(*UNIX/POSIX/whatever*) exit signals behaviour is well documented. Generally only two of them will ask for specific exit handlers :

| Common name     | N° | Action       |
| **SIGINT**      |   2    | Interruption |
| **SIGTERM**     |   5    | Exit request |

Lots of ways exists to handle signals under Mono. However Unity3D really is a thing of its own. As such, it doesn't let us catch those little things.

## The fix

As a "temporary" fix, I made a barebones C file to catch the process's signal :

*sighandler.c*

{% highlight C %}
#include <signal.h>

void (*c)(int);
void sig_callback(int n){
	c(n);
}
void OnTerm(void (*handler)(int)){
	c = handler;			
	signal(SIGTERM, sig_callback);
}
{% endhighlight %}
***

It compiles easily to a "**.so**" shared library

```
    gcc -shared -o libsighandler.so -fPIC sighandler.c
```

The output file (compiled on debian jessie) can be downloaded [here](/data/posts/libsighandler.so).

We need this file in `Assets/Plugins` to be automagically exported on build targetting linux platform. Then it needs to be referenced from Unity Scripts. In C# :

{%highlight csharp %}
using System.Collections;
using UnityEngine;
public class HandleTerm : MonoBehaviour {
	//This is the important part
	public delegate void handlerDelegate();
	[DllImport ("sighandler")]
	private static extern void OnTerm(handlerDelegate handler);
	void ExitHandler(){
		print("onExit");
		//We must call Application.Quit() manually :
		// The default built-in handler is cancelled.
		Application.Quit();
	}
	//Then it's just normal code
	// Use this for initialization
	void Start () {
		//Register handler on initialization
		OnTerm(new handlerDelegate(this.ExitHandler));
	}

	// Update is called once per frame
	void Update () {
	}
	void OnApplicationQuit(){
		//This doesn't get called under normal circumstances when app get a SIGTERM.
		print("Application Quit");
	}

}
{% endhighlight %}

Note: `print()` statements get logged to `~/.config/unity3d/<company_name>/<app_name>/Player.log`.

This will override system's default **SIGTERM** and **SIGINT** handlers and let you act accordingly. Note that it's bad behaviour to take more than a few seconds to exit. As such, most window managers will **SIGKILL** the process after a few seconds. **SIGKILL** by itself is interruptible so behave!
