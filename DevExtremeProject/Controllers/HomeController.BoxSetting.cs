using DevExtremeProject.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DevExtremeProject.Controllers {
    public partial class HomeController : Controller
    {
        public ActionResult BoxSetting()
        {
            return View();
        }
        [HttpPost]
        public ActionResult BoxImage(HttpPostedFileBase file)
        {
            if (file.ContentLength > 0)
            {
                BoxLocateModel boxLocateModel;
                var fileName = DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss_") + Path.GetFileName(file.FileName);
                var path = Path.Combine(Server.MapPath("~/Content/FileUploads"), fileName);
                file.SaveAs(path);
                boxLocateModel = new BoxLocateModel(path);
                string temp = boxLocateModel.Locate();
                return Json(temp, "application / json");
            }
            return Json(null);
        }
    }
}