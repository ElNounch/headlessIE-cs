@echo off
del /S /Q bin > NUL:
mkdir bin 2> NUL:
csc /noconfig /r:System.Dll /r:System.Windows.Forms.Dll /out:bin\headlessIE.exe /t:exe src\headlessIE.cs
