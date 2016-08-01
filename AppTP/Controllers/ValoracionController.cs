using AppTP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppTP.Controllers
{
    public class ValoracionController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpPost, AllowAnonymous]
        public ActionResult votar(int estrellas, int id_publicacion, string controller)
        {
            Publicacion publi = db.Publicacion.Single(x => x.id_publicacion == id_publicacion);

            int? votantes = publi.votantes == null ? 0 : publi.votantes;
            decimal? valoracion = publi.valoracion == null ? 0 : publi.valoracion;
            decimal? total = votantes * valoracion;
            total += estrellas;
            votantes++;
            valoracion = total / votantes;
            publi.valoracion = valoracion;
            publi.votantes = votantes;
            db.SubmitChanges();

            return RedirectToAction("Index", controller);
        }

    }
}
