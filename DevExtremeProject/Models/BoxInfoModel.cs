using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace DevExtremeProject.Models
{
	public class BoxInfoModel
	{
		public string Name { get; set; }
		public int Height { get; set; }
		public int Width { get; set; }
		public int X { get; set; }
		public int Y { get; set; }
		public int LineWidth { get; set; }
		public Color LineColor { get; set; }
		public Color BodyColor { get; set; }
		public string ToString()
		{
			string result = "{\n";
			foreach (System.Reflection.PropertyInfo processInfo in this.GetType().GetProperties())
			{
				if (processInfo.GetValue(this).GetType() == typeof(int))
					result += "'" + processInfo.Name + "' : " + processInfo.GetValue(this) + ", ";
				else if (processInfo.GetValue(this).GetType() == typeof(string))
					result += "'" + processInfo.Name + "' : '" + processInfo.GetValue(this) + "', ";
				else
				{
					Color color = (Color)processInfo.GetValue(this);
					result += "'" + processInfo.Name + "' : " + "'#" + color.R.ToString("X2") + color.G.ToString("X2") + color.B.ToString("X2") +"', ";
				}
			}


			return result.Substring(0, result.Length - 2) + "\n}";
		}
	}
}
