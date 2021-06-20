using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DevExtremeProject.Controllers {
    public partial class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}