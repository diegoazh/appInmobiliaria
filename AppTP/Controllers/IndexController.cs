using AppTP.Commons;
using AppTP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppTP.Controllers
{
    public class IndexController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpGet , AllowAnonymous]
        public ActionResult index()
        {
            
            var consulta = db.Usuario.Single(x=>x.id_usuario == 1);
            if (consulta.pass.Length < 64)
            {
                consulta.pass = UsuarioController.encriptar(consulta.pass);
                db.SubmitChanges();
            }

            var publis =
                from p in db.Publicacion
                where p.fecha_baja == null && p.id_estado == 1
                select p;
            int posts = publis.Count();
            if (posts <= 9)
            {
                ViewBag.pages = 1;
            }
            else
            {
                double pages = posts / 9;
                ViewBag.pages = Convert.ToInt32(pages);
            }
            ViewBag.publicaciones = publis.ToArray();
            ViewBag.cantComent = DatosComunes.cantComent();

            return View();
        }

        public ActionResult casas(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

        public ActionResult departamentos(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

        public ActionResult terrenos(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }
    }
}
