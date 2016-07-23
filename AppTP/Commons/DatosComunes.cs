using AppTP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppTP.Commons
{
    public class DatosComunes
    {
        public static int cantPubli()
        {
            ElTrebolDBDataContext db = new ElTrebolDBDataContext();
            var publi =
                from p in db.Publicacion
                where p.fecha_baja == null
                select p;
            return publi.Count();
        }

        public static int cantComent()
        {
            ElTrebolDBDataContext db = new ElTrebolDBDataContext();
            var coment =
                from c in db.Comentario
                where c.fecha_respuesta == null
                select c;
            return coment.Count();
        }

        public static int cantUsers()
        {
            ElTrebolDBDataContext db = new ElTrebolDBDataContext();
            var users =
                from u in db.Usuario
                select u;
            return users.Count();
        }

        public static int cantClosed()
        {
            ElTrebolDBDataContext db = new ElTrebolDBDataContext();
            var closed =
                from p in db.Publicacion
                where p.fecha_baja != null
                select p;
            return closed.Count();
        }
    }
}
