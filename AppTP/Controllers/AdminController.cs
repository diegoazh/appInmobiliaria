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
            selectsAltaEditar();
            cantidades();

            return View("alta_producto");
        }

        [HttpPost, Authorize]
        public ActionResult alta_producto(Publicacion publicacion, string precio, string id_admin, string fotos)
        {
            string nombreFotos = fotosAgregarEliminar(fotos);

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

            return RedirectToAction("alta_producto", "admin");
        }

        [HttpGet, Authorize]
        public ActionResult editar_producto(int id_publicacion)
        {
            var editProd =
                from p in db.Publicacion
                where p.id_publicacion == id_publicacion
                select p;

            selectsAltaEditar();
            cantidades();

            ViewBag.publiEditar = editProd.ToArray();

            return View("alta_producto");
        }

        [HttpPost, Authorize]
        public ActionResult editar_producto(Publicacion publicacion, string precio, string id_admin, string fotos, int id_publicacion, string eliminar)
        {
            var publi = from pub in db.Publicacion where pub.id_publicacion == id_publicacion select pub;
            var p = publi.ToArray();

            string nombreFotos = fotosAgregarEliminar(fotos, p[0].fotos, eliminar);

            if (!String.IsNullOrEmpty(nombreFotos))
            {
                p[0].fotos = nombreFotos;
            }
            p[0].titulo = publicacion.titulo;
            p[0].precio = Convert.ToDecimal(precio.Replace(".", ","));
            p[0].descripcion = publicacion.descripcion;
            p[0].barrio = publicacion.barrio;
            p[0].fecha_publicacion = DateTime.Now;
            p[0].id_producto = publicacion.id_producto;
            p[0].id_estado = publicacion.id_estado;
            p[0].id_formaPago = publicacion.id_formaPago;
            p[0].id_tipoNegocio = publicacion.id_tipoNegocio;
            p[0].id_admin = Int32.Parse(id_admin);
            p[0].id_localidad = publicacion.id_localidad;

            db.SubmitChanges();

            return RedirectToAction("index", "admin");
        }

        [HttpPost, Authorize]
        public ActionResult cerrar_publicacion(int id_publi_cerrar, string comentario_cierre)
        {
            var registro = from r in db.Publicacion where r.id_publicacion == id_publi_cerrar select r;
            var reg = registro.ToArray();
            reg[0].fecha_baja = DateTime.UtcNow;
            reg[0].motivo_baja = comentario_cierre;
            db.SubmitChanges();

            return RedirectToAction("index", "admin");
        }

        [HttpGet, Authorize]
        public JsonResult estados_publicacion(string tabla)
        {
            List<object> est = new List<object>();
            var estados = from e in db.Estado select e;
            foreach(var estado in estados)
            {
                Estado es = new Estado();
                es.id_estado = estado.id_estado;
                es.estado1 = estado.estado1;
                est.Add(es);
            }
            var json = JsonConvert.SerializeObject(est);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, Authorize]
        public ActionResult estados_publicacion(int est_publi, int id_publi_est)
        {
            var publi = db.Publicacion.Single(x => x.id_publicacion == id_publi_est);
            publi.id_estado = est_publi;
            try
            {
                db.SubmitChanges();
                return RedirectToAction("Index", "admin");
            }
            catch (Exception exc)
            {
                return RedirectToAction("Index", "admin");
            }
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

        public void selectsAltaEditar()
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
        }

        public string fotosAgregarEliminar(string fotos, string fotosActuales = "", string eliminar = "")
        {
            string nombreFotos = "";
            if (!String.IsNullOrEmpty(fotosActuales))
            {
                nombreFotos = fotosActuales;
            }

            if (!String.IsNullOrEmpty(eliminar))
            {
                string[] elim = eliminar.Split('*');
                elim = elim.Except(new string[] { "" }).ToArray();
                string[] actuals = fotosActuales.Split(',');
                var fotAct = actuals.ToList();
                TempData["ErrorOnDelet"] = "";

                for (int i = 0; i < elim.Length; i++)
                {
                    var physicalPath = System.IO.Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/images/uploads/"), elim[i]);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        try
                        {
                            System.IO.File.Delete(physicalPath);
                        }
                        catch (System.IO.IOException ex)
                        {
                            TempData["ErrorOnDelet"] += ex.Message + " / ";
                        }
                    }
                    for (int x = 0; x < actuals.Length; x++) {
                        if (elim[i] == actuals[x])
                        {
                            fotAct.Remove(elim[i]);
                        }
                    }
                }
                nombreFotos = String.Join(",", fotAct);
            }

            if (!String.IsNullOrEmpty(fotos))
            {
                if(!String.IsNullOrEmpty(nombreFotos))
                {
                    nombreFotos += ",";
                }

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

                TempData["uploads"] = "Subidas correctamente " + count + " imagen(es).";

                string[] fot = fotos.Split('*');
                fot = fot.Except(new string[] { "" }).ToArray();

                for (int i = 0; i < fot.Length; i++)
                {
                    nombreFotos += fot[i];
                    if (i != (fot.Length - 1))
                    {
                        nombreFotos += ",";
                    }

                }
            }

            return nombreFotos;
        }
    }
}
