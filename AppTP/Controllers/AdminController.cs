using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppTP.Models;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace AppTP.Controllers
{
    public class AdminController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpGet]
        public ActionResult index()
        {
            var publi =
                from pub in db.Publicacion
                join prod in db.Producto on pub.id_producto equals prod.id_producto
                join est in db.Estado on pub.id_estado equals est.id_estado
                join tip in db.TipoNegocio on pub.id_tipoNegocio equals tip.id_tipoNegocio
                where pub.fecha_baja == null
                orderby pub.fecha_publicacion descending
                select new
                {
                    ID = pub.id_publicacion,
                    titulo = pub.titulo,
                    precio = pub.precio,
                    producto = prod.nombre,
                    tipoNegocio = tip.tipo,
                    estado = est.estado1,
                };
            
            ViewBag.publicaciones = publi;
            cantidades();

            return View();
        }

        [HttpGet]
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

            ViewBag.tipoNegocio = neg;
            ViewBag.formaPagos = fpago;
            ViewBag.estados = est;
            ViewBag.provincias = prov;
            cantidades();

            return View("Index");
        }

        [HttpPost]
        public ActionResult alta_producto(string titulo, string descripcion, decimal precio, int forma_pago, int tipo_negocio, int localidad, string barrio, string imagenes)
        {

            return View();
        }

        [HttpGet]
        public ActionResult negocios_cerrados()
        {
            var cerrados =
                from pub in db.Publicacion
                join prod in db.Producto on pub.id_producto equals prod.id_producto
                join est in db.Estado on pub.id_estado equals est.id_estado
                join tip in db.TipoNegocio on pub.id_tipoNegocio equals tip.id_tipoNegocio
                where pub.fecha_baja != null
                orderby pub.fecha_publicacion descending
                select new
                {
                    ID = pub.id_publicacion,
                    titulo = pub.titulo,
                    precio = pub.precio,
                    producto = prod.nombre,
                    tipoNegocio = tip.tipo,
                    estado = est.estado1,
                };

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
