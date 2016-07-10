using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppTP.Models;

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

            ViewBag.publicaciones = publis.ToArray();

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

        [HttpPost]
        public ActionResult comentario(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

    }
}
