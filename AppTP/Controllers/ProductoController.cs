using AppTP.Commons;
using AppTP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppTP.Controllers
{
    public class ProductoController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        public ActionResult Index(int id_publicacion)
        {
            var producto =
                from p in db.Publicacion
                where p.id_publicacion == id_publicacion
                select p;

            var coment =
                from c in db.Comentario
                where c.respuesta == null
                select c;

            ViewBag.publicacion = producto.ToArray();
            ViewBag.cantComent = DatosComunes.cantComent();

            return View();
        }

        public ActionResult comentario(Comentario comentario)
        {
            Comentario coment = new Comentario();
            coment.nombre = comentario.nombre;
            coment.apellido = comentario.apellido;
            coment.mail = comentario.mail;
            if (comentario.telefono != 0)
                coment.telefono = comentario.telefono;
            if (comentario.celular != 0)
                coment.celular = comentario.celular;
            coment.fecha_pregunta = DateTime.UtcNow;
            coment.comentario1 = comentario.comentario1;
            coment.id_publicacion = comentario.id_publicacion;
            
            db.Comentario.InsertOnSubmit(coment);
            try
            {
                db.SubmitChanges();
                return RedirectToAction("index", "Producto", new { id_publicacion = comentario.id_publicacion });
                //return new JsonResult { Data = "El comentario se registró correctamente." };
            } catch(Exception ex) {
                //return new JsonResult { Data = "Ocurrio algún problema intentando registrar el comentario, por favor intentelo nuevamente más tarde. Si el error persiste por favor contacte al administrador del sitio. Error: " + ex.ToString() };
                return RedirectToAction("index", "Producto", new { id_publicacion = comentario.id_publicacion });
            }
        }
    }
}
