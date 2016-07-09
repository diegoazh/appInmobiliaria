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
                db.Dispose();
            }

            return View();
        }

    }
}
