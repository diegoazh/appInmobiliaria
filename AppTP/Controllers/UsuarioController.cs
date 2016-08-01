using AppTP.Commons;
using AppTP.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

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
            ViewBag.cantPubli = DatosComunes.cantPubli();
            ViewBag.cantComent = DatosComunes.cantComent();
            ViewBag.cantComentFin = DatosComunes.cantComentFin();
            ViewBag.cantUsers = DatosComunes.cantUsers();
            ViewBag.cantClosed = DatosComunes.cantClosed();

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
                    Response.Cookies["UserAvatar"].Value = user[0].Avatar.avatar1;
                    Response.Cookies["UserAvatar"].Expires = DateTime.Now.AddDays(1);
                    if (user[0].id_foto != null)
                    {
                        Response.Cookies["UserFoto"].Value = user[0].Foto.foto1;
                        Response.Cookies["UserFoto"].Expires = DateTime.Now.AddDays(1);
                    }

                    // Otro método para crear Cookies
                    HttpCookie idUser = new HttpCookie("UserId");
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
            Response.Cookies["UserNombre"].Expires = DateTime.Now.AddDays(-1);
            Response.Cookies["UserApellido"].Expires = DateTime.Now.AddDays(-1);
            Response.Cookies["UserRules"].Expires = DateTime.Now.AddDays(-1);
            Response.Cookies["UserAvatar"].Expires = DateTime.Now.AddDays(-1);
            Response.Cookies["UserFoto"].Expires = DateTime.Now.AddDays(-1);
            Response.Cookies["UserId"].Expires = DateTime.Now.AddDays(-1);

            return RedirectToAction("index", "Index");
        }

        [HttpPost, Authorize]
        public ActionResult crear_usuario(Usuario usuario)
        {
            if (System.Web.HttpContext.Current.Request.Files != null)
            {
                for (int i = 0; i < System.Web.HttpContext.Current.Request.Files.Keys.Count; i++)
                {
                    HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[i];
                    if (file != null && file.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/images/foto_usuarios"), fileName);
                        file.SaveAs(path);
                        usuario.Foto.foto1 = fileName;
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

        public ActionResult perfil(int id)
        {
            return View(buscarUsuario(id));
        }

        [HttpGet, Authorize]
        public JsonResult editar_usuario(int id)
        {
            Usuario user = new Usuario();
            var u = buscarUsuario(id);
            user.id_usuario = u.id_usuario;
            user.nombre = u.nombre;
            user.apellido = u.apellido;
            user.username = u.username;
            user.mail = u.mail;
            user.telefono = u.telefono;
            user.id_avatar = u.id_avatar;
            user.id_rules = u.id_rules;
            var json = JsonConvert.SerializeObject(user);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost, Authorize]
        public ActionResult editar_usuario(Usuario usuario)
        {
            var u = buscarUsuario(usuario.id_usuario);
            u.username = usuario.username;
            u.nombre = usuario.nombre;
            u.apellido = usuario.apellido;
            u.mail = usuario.mail;
            u.telefono = usuario.telefono;
            u.id_avatar = usuario.id_avatar;
            u.id_rules = usuario.id_rules;

            if (System.Web.HttpContext.Current.Request.Files != null)
            {
                if (u.id_foto != null)
                {
                    var physicalPath = System.IO.Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/images/foto_usuarios/"), u.Foto.foto1);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        try
                        {
                            System.IO.File.Delete(physicalPath);
                        }
                        catch (System.IO.IOException ex)
                        {
                            TempData["ErrorOnDelete"] += ex.Message;
                        }
                    }
                }

                for (int i = 0; i < System.Web.HttpContext.Current.Request.Files.Keys.Count; i++)
                {
                    HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[i];
                    if (file != null && file.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var path = Path.Combine(Server.MapPath("~/images/foto_usuarios"), fileName);
                        file.SaveAs(path);
                        Foto f = new Foto();
                        f.foto1 = fileName;
                        db.Foto.InsertOnSubmit(f);
                        db.SubmitChanges();
                        f = db.Foto.Single(x => x.foto1 == fileName);
                        u.id_foto = f.id_foto;
                    }
                }
            }
            db.SubmitChanges();
            return RedirectToAction("Index", "Usuario");
        }

        public Usuario buscarUsuario(int id)
        {
            var user = db.Usuario.Single(x => x.id_usuario == id);
            return user;
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
    }
}
