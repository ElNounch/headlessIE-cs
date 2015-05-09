@echo off
del /S /Q bin > NUL:
mkdir bin 2> NUL:
csc /out:bin\headlessIE.exe /t:exe src\headlessIE.cs
