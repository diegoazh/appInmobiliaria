using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppTP.Models;

namespace AppTP.Controllers
{
    public class ComentariosController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        public ActionResult Index()
        {
            var com =
                from c in db.Comentario
                where c.respuesta == null
                select c;

            ViewBag.comentarios = com;
            cantidades();

            return View();
        }

        public void cantidades()
        {
            var publi =
            from p in db.Publicacion
            where p.fecha_baja == null
            select p;

            var coment =
                from c in db.Comentario
                where c.respuesta == null
                select c;

            var users =
                from u in db.Usuario
                select u;

            var closed =
            from p in db.Publicacion
            where p.fecha_baja != null
            select p;

            ViewBag.cantPubli = publi.Count();
            ViewBag.cantComent = coment.Count();
            ViewBag.cantUsers = users.Count();
            ViewBag.cantClosed = closed.Count();
        }

    }
}
