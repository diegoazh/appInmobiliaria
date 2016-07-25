using AppTP.Commons;
using AppTP.Models;
using Newtonsoft.Json;
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

        [HttpGet, Authorize]
        public ActionResult Index()
        {
            var com =
                from c in db.Comentario
                where c.fecha_respuesta == null
                select c;

            ViewBag.comentarios = com;
            ViewBag.cantPubli = DatosComunes.cantPubli();
            ViewBag.cantComent = DatosComunes.cantComent();
            ViewBag.cantComentFin = DatosComunes.cantComentFin();
            ViewBag.cantUsers = DatosComunes.cantUsers();
            ViewBag.cantClosed = DatosComunes.cantClosed();

            return View();
        }

        public ActionResult Finalizados()
        {
            var fin =
                from c in db.Comentario
                where c.fecha_respuesta != null
                select c;

            ViewBag.finalizados = fin;
            ViewBag.cantPubli = DatosComunes.cantPubli();
            ViewBag.cantComent = DatosComunes.cantComent();
            ViewBag.cantComentFin = DatosComunes.cantComentFin();
            ViewBag.cantUsers = DatosComunes.cantUsers();
            ViewBag.cantClosed = DatosComunes.cantClosed();

            return View();
        }

        [HttpPost, Authorize]
        public JsonResult buscar_comentario(string tabla, int id_comentario)
        {
            List<object> comment = new List<object>();
            var comentario = db.Comentario.Single(x => x.id_comentario == id_comentario);
            Comentario c = new Comentario();
            c.nombre = comentario.nombre;
            c.apellido = comentario.apellido;
            c.mail = comentario.mail;
            c.telefono = comentario.telefono;
            c.celular = comentario.celular;
            c.fecha_pregunta = comentario.fecha_pregunta;
            c.comentario1 = comentario.comentario1.Replace(Environment.NewLine, "*");
            c.fecha_respuesta = comentario.fecha_respuesta;
            c.respuesta = comentario.respuesta;
            comment.Add(c);
            var json = JsonConvert.SerializeObject(comment);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, Authorize]
        public JsonResult cerrar_comentario(int id_comentario, string respuesta, int id_usuario)
        {
            var com = db.Comentario.Single(x => x.id_comentario == id_comentario);
            var user = db.Usuario.Single(x => x.id_usuario == id_usuario);
            com.fecha_respuesta = DateTime.UtcNow;
            if (String.IsNullOrEmpty(com.respuesta))
                com.respuesta = respuesta + "\n(" + user.username + " - " + DateTime.UtcNow + ")";
            else
                com.respuesta += "\n" + respuesta + "\n(" + user.username + " - " + DateTime.UtcNow + ")";
            com.id_usuario = id_usuario;
            db.SubmitChanges();
            var json = JsonConvert.SerializeObject(new JsonResult { Data = "El comentario se finalizó de manera correcta" });
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}
