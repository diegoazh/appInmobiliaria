using AppTP.Commons;
using AppTP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
            ViewBag.cantPubli = DatosComunes.cantPubli();
            ViewBag.cantComent = DatosComunes.cantComent();
            ViewBag.cantUsers = DatosComunes.cantUsers();
            ViewBag.cantClosed = DatosComunes.cantClosed();

            return View();
        }

    }
}
