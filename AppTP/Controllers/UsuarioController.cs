using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppTP.Models;
using System.Security.Cryptography;
using System.Web.Security;
using System.IO;

namespace AppTP.Controllers
{
    public class UsuarioController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpGet, Authorize]
        public ActionResult Index()
        {
            var listUsers =
                from u in db.Usuario
                select u;

            var listAvatars =
                from a in db.Avatar
                select a;

            var listRoles =
                from r in db.Rules
                select r;

            ViewBag.usuarios = listUsers;
            ViewBag.avatars = listAvatars;
            ViewBag.roles = listRoles;
            cantidades();

            return View();
        }

        [HttpPost, Authorize]
        public ActionResult actualizar_password(string nvo_password, int id_user)
        {
            var theUser = db.Usuario.Single(x => x.id_usuario == id_user);
            theUser.pass = encriptar(nvo_password);

            db.SubmitChanges();

            return RedirectToAction("Index","Usuario");
        }

        [AllowAnonymous, ValidateAntiForgeryToken]
        public ActionResult loginUsuario(Usuario usuario, bool recordarme, string ReturnUrl = "/admin")
        {
            var consulta =
                from u in db.Usuario
                where u.username == usuario.username
                select u;
                var user = consulta.ToArray();
           
           if(user.Length > 0) {
               string pass2 = encriptar(usuario.pass);

                if (user[0].pass == pass2)
                {
                    FormsAuthentication.SetAuthCookie(user[0].username, recordarme);
                    
                    // Cookie con datos de usuario
                    Response.Cookies["UserNombre"].Value = user[0].nombre;
                    Response.Cookies["UserNombre"].Expires = DateTime.Now.AddDays(1);
                    Response.Cookies["UserApellido"].Value = user[0].apellido;
                    Response.Cookies["UserApellido"].Expires = DateTime.Now.AddDays(1);
                    Response.Cookies["UserRules"].Value = user[0].id_rules.ToString();
                    Response.Cookies["UserRules"].Expires = DateTime.Now.AddDays(1);

                    // Otro método para crear Cookies
                    HttpCookie idUser = new HttpCookie("idUsuario");
                    idUser.Value = user[0].id_usuario.ToString();
                    idUser.Expires = DateTime.Now.AddDays(1);
                    Response.Cookies.Add(idUser);
                }
            }
            else
            {
                TempData.Add("mensajeError","<p class=\"element-inline-block\">Usuario o contraseña invalidas. Por favor verifique y reintente nuevamente</p>");
                return RedirectToAction("index","Index");
            }
            ModelState.Remove("password");
            if (Url.IsLocalUrl(ReturnUrl))
            {
                return Redirect(ReturnUrl);
            }
            else
            {
                return RedirectToAction("index", "Index");
            }
        }

        public ActionResult logoutUsuario()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("index", "Index");
        }

        [HttpPost, Authorize]
        public ActionResult crear_usuario(Usuario usuario /*string foto_perfil*/)
        {
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
                    }
                }
            }

            Usuario user = new Usuario();
            user.username = usuario.username;
            user.nombre = usuario.nombre;
            user.apellido = usuario.apellido;
            user.mail = usuario.mail;
            user.telefono = usuario.telefono;
            user.pass = encriptar(usuario.pass);
            if (usuario.Foto.foto1 != null)
                user.Foto.foto1 = usuario.Foto.foto1;

            user.id_avatar = usuario.id_avatar;
            user.id_rules = usuario.id_rules;

            db.Usuario.InsertOnSubmit(user);
            try
            {
                db.SubmitChanges();
                TempData["UserSucceed"] = "El usuario ha sido creado correctamente.";
            }
            catch (Exception e)
            {
                TempData["UserFail"] = "No se ha podido crear el usuario. Exception: " + e;
            }
            
            return RedirectToAction("Index", "Usuario");
        }

        public static string encriptar(string password)
        {
            string salt = "AqngGOPIShpoqhQajKLKA5aohnoe1BVOor";
            int iteraciones = 1500;
            SHA256 sha256 = SHA256.Create();
            string finalPass = password + salt;
            byte[] bytesPassword = System.Text.Encoding.UTF8.GetBytes(finalPass);
            try
            {
                for (int i = 0; i <= iteraciones - 1; i++)
                {
                    bytesPassword = sha256.ComputeHash(bytesPassword);
                }
            }
            finally
            {
                sha256.Clear();
            }
            return BitConverter.ToString(bytesPassword).Replace("-", "");
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
