using CodeMashAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CodeMashAPI.Controllers
{
    public class DataController : ApiController
    {
        public List<Codemash> GetIds(){
            using(DBEntities db = new DBEntities())
            {
                var results = db.Codemashes.Select(c => c).ToList();

                return results;
            }
        }

        [HttpPost]
        public Codemash ToggleId(int id)
        {
            using (DBEntities db = new DBEntities())
            {
                var result = db.Codemashes.Where(c => c.codemashid == id).Select(c => c).FirstOrDefault();
                Codemash cm = new Codemash();

                if(result == null)
                {
                    cm.codemashid = id;
                    db.Codemashes.Add(cm);
                }
                else
                {
                    db.Codemashes.Remove(result);
                }

                try
                {
                    db.SaveChanges();
                    return cm;
                }
                catch(Exception ex)
                {
                    return null;
                }
            }
        }
        
    }
}
