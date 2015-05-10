// HeadlessIE v1.0.0

/*
The MIT License (MIT)

Copyright (c) 2015, Alexis Nunes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

using System;
using System.Windows.Forms;
using System.Reflection;

namespace HeadlessIE
{
	public class Entrance
	{
		public static int Message() {
			Console.Write("This program takes an Uri as argument, open it headlessly and never quit.");
			return -1;
		}

		[STAThread]
		public static int Main(string[] args) {
			if( (args == null) || (args.Length != 1) ) {
				return Message();
			}
			if( (args[0] == "--help") || (args[0] == "-h") || (args[0] == "-?") || (args[0] == "/?") ) {
				Message();
				return 0;
			}

			WebBrowser wb = new WebBrowser();
			if( args[0] == "--version" ) {
				string version = Assembly.GetEntryAssembly().GetName().Version.ToString();
				string IEversion = wb.Version.ToString();
				Console.Write( "HeadlessIE {0} (Internet Explorer {1})", version, IEversion );
				return 0;
			}

			Uri dest;
			try {
				dest = new Uri( args[0] );
			} catch ( UriFormatException ) {
				return Message();
			}

			if( !dest.IsWellFormedOriginalString() ) {
				return Message();
			}
			wb.Url = dest;
			Application.Run();
			return 1;
		}
	}
}
