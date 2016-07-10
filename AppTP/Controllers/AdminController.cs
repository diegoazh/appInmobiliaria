using AppTP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace AppTP.Controllers
{
    public class AdminController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpGet, Authorize]
        public ActionResult index()
        {
            var publi =
                from pub in db.Publicacion
                where pub.fecha_baja == null
                orderby pub.fecha_publicacion descending
                select pub;
            
            ViewBag.publicaciones = publi;
            cantidades();

            return View();
        }

        [HttpGet, Authorize]
        public ActionResult alta_producto()
        {
            var neg =
                from n in db.TipoNegocio
                orderby n.tipo
                select n;

            var fpago = 
                from f in db.FormaPago
                orderby f.formaPago1
                select f;

            var est =
                from e in db.Estado
                orderby e.estado1
                select e;

            var prov = 
                from p in db.Provincia
                orderby p.Nombre
                select p;

            var prod =
                from pr in db.Producto
                orderby pr.nombre
                select pr;

            ViewBag.tipoNegocio = neg;
            ViewBag.formaPagos = fpago;
            ViewBag.estados = est;
            ViewBag.provincias = prov;
            ViewBag.productos = prod;
            cantidades();

            return View("Index");
        }

        [HttpPost, Authorize]
        public ActionResult alta_producto(Publicacion publicacion, string precio, string id_admin, string fotos)
        {
            int count = 0;
            if (System.Web.HttpContext.Current.Request.Files != null)
            {
                for (int i = 0; i < System.Web.HttpContext.Current.Request.Files.Keys.Count; i++)
                {
                    HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[i];
                    if (file != null && file.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/images/uploads"), fileName);
                        file.SaveAs(path);
                        count++;
                    }
                }
            }

            string[] f = fotos.Split('*');
            f = f.Except(new string[] { "" }).ToArray();

            string nombreFotos = "";

            for (int i = 0; i < f.Length; i++)
            {
                nombreFotos += f[i];
                if (i != (f.Length - 1))
                {
                    nombreFotos += ",";
                }
                
            }

            Publicacion p = new Publicacion();
            p.titulo = publicacion.titulo;
            p.fotos = nombreFotos;
            p.precio = Convert.ToDecimal(precio.Replace(".", ","));
            p.descripcion = publicacion.descripcion;
            p.barrio = publicacion.barrio;
            p.fecha_publicacion = DateTime.Now;
            p.id_producto = publicacion.id_producto;
            p.id_estado = publicacion.id_estado;
            p.id_formaPago = publicacion.id_formaPago;
            p.id_tipoNegocio = publicacion.id_tipoNegocio;
            p.id_admin = Int32.Parse(id_admin);
            p.id_localidad = publicacion.id_localidad;

            db.Publicacion.InsertOnSubmit(p);
            db.SubmitChanges();

            TempData["uploads"] = "Subidas correctamente " + count + " imagenes.";

            return RedirectToAction("alta_producto", "Admin");
        }

        [HttpPost, Authorize]
        public ActionResult carga_imagenes()
        {
            int count = 0;
            if (System.Web.HttpContext.Current.Request.Files != null)
            {
                for (int i = 0; i < System.Web.HttpContext.Current.Request.Files.Keys.Count; i++)
                {
                    HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[i];
                    if (file != null && file.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName) + Path.GetExtension(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/images/uploads"), fileName);
                        file.SaveAs(path);
                        count++;
                    }
                }
            }

            return new JsonResult { Data = "Se cargaron correctamente " + count + " imagen(es)" };
        }

        [HttpGet, Authorize]
        public ActionResult negocios_cerrados()
        {
            var cerrados =
                from pub in db.Publicacion
                where pub.fecha_baja != null
                orderby pub.fecha_publicacion descending
                select pub;

            ViewBag.negociosCerrados = cerrados;
            cantidades();

            return View("Index");
        }

        [HttpGet]
        public JsonResult cargar_selects(string tabla, int id)
        {
            List<object> list = null;

            if (tabla == "departamentos")
            {
                list = new List<object>();
                var dep =
                    from d in db.Departamento
                    where d.idProvincia == id
                    orderby d.Nombre
                    select d;

                foreach (var dpto in dep)
                {
                    Departamento d = new Departamento();
                    d.ID = dpto.ID;
                    d.Nombre = dpto.Nombre;
                    d.idProvincia = dpto.idProvincia;
                    list.Add(d);
                }
            } else if (tabla == "localidades") {
                list = new List<object>();
                var ldades =
                    from loc in db.Localidad
                    where loc.idDepartamento == id
                    select loc;

                foreach (var ldad in ldades)
                {
                    Localidad l = new Localidad();
                    l.ID = ldad.ID;
                    l.Nombre = ldad.Nombre;
                    l.idDepartamento = ldad.idDepartamento;
                    list.Add(l);
                }
            }

            var json = JsonConvert.SerializeObject(list);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //Metodos particulares y útiles
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
