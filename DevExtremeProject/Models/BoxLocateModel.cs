using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace DevExtremeProject.Models
{
	public class BoxLocateModel
	{
		public Bitmap boxImage;
		public int height;
		public int width;
		public Color backgroundColor;
		public List<BoxInfoModel> boxInfos;
		public BoxLocateModel(string path)
		{
			boxImage = new Bitmap(path);
			boxInfos = new List<BoxInfoModel>();
		}
		public string Locate()
		{
			string result = "{\n";
			backgroundColor = boxImage.GetPixel(0, 0);
			height = boxImage.Height;
			width = boxImage.Width;
			for (int countY = 0; countY < height; countY++)
			{
				for (int countX = 0; countX < width; countX++)
				{
					if (boxImage.GetPixel(countX, countY) != backgroundColor)
					{
						boxInfos.Add(CreateBox(countX, countY));
						boxInfos[boxInfos.Count - 1].Name = "Box" + boxInfos.Count;
					}
				}
			}
			result += "'Height' : " + height + ", ";
			result += "'Width' : " + width + ", ";
			result += "'X' : 0, ";
			result += "'Y' : 0, ";
			result += "'BackgroundColor' : '#" + backgroundColor.R.ToString("X2") + backgroundColor.G.ToString("X2") + backgroundColor.B.ToString("X2") + "', ";
			result += "'Boxinfos' : [\n";

			for (int count = 0; count < boxInfos.Count; count++)
				result += boxInfos[count].ToString() + ", ";
			result = result.Substring(0, result.Length - 2) + "\n]\n}";
			result = result.Replace("'", "\"");
			return result;
		}
		public BoxInfoModel CreateBox(int x, int y)
		{
			BoxInfoModel info = new BoxInfoModel();
			int height = 0;
			int width = 0;
			int lineWidth = 0;
			info.LineColor = boxImage.GetPixel(x, y);
			info.X = x;
			info.Y = y;
			for (; boxImage.GetPixel(x + width, y) != this.backgroundColor; width++) ;
			for (; boxImage.GetPixel(x, y + height) != this.backgroundColor; height++) ;
			info.Width = width;
			info.Height = height;
			for (int countY = 0; true; countY++)
			{
				if (boxImage.GetPixel(x + (width / 2), y + countY) != info.LineColor)
				{
					info.LineWidth = countY;
					info.BodyColor = boxImage.GetPixel(x + (width / 2), y + countY);
					break;
				}
			}
			for (int countY = 0; countY < height; countY++)
				for (int countX = 0; countX < width; countX++)
					boxImage.SetPixel(x + countX, y + countY, this.backgroundColor);
			return info;
		}

	}
}