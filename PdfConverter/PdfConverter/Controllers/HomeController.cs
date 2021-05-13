using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using PdfConverter.Extensions;
using PdfConverter.Models;
using PdfConverter.Other;

namespace PdfConverter.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationContext _db;
        public HomeController(ApplicationContext context)
        {
            _db = context;
        }

        [HttpGet("/")]
        [HttpGet("home")]
        [HttpGet("index")]
        public IActionResult Home()
        {
            return View();
        }

        [HttpPost("upload")]
        public IActionResult ConvertFiles(IFormFile[] files)
        {
            if(files.Length == 0)
            {
                return BadRequest();
            }

            using (MemoryStream documentStream = new MemoryStream())
            {
                Document document = new Document(PageSize.A4, 25f, 25f, 25f, 25f);
                PdfWriter writer = PdfWriter.GetInstance(document, documentStream);

                document.Open();
                PdfContentByte contentByte = writer.DirectContent;


                foreach (IFormFile file in files)
                {
                    document.NewPage();
                    Image image = Image.GetInstance(file.OpenReadStream());
                    image.SetAbsolutePosition(200, 400);
                    image.ScaleAbsolute(300, 300);

                    contentByte.AddImage(image);
                }

                document.Close();

                byte[] bytes = documentStream.GetBuffer();
                string uri = RandomURL.GetURL().ToString();


                if (!AddPdfToDb(uri, bytes))
                {
                    return BadRequest();
                }

                Response.Headers.Add("uri", uri);
                return Ok();
            }
        }
        
        [HttpGet("download/{uri}")]
        public IActionResult DownloadPage(string uri)
        {
            return View("Download");
        }
            
        [HttpGet("download/{uri}/getpdf")]
        public IActionResult Download(string uri)
        {
            string fileType = "application/pdf";
            string fileName = Path.GetRandomFileName() + ".pdf";
            byte[] fileContents = _db.Pdfs.FirstOrDefault(file => file.Uri == uri).Pdf;


            //Response.Headers.Add("Content-Disposition", "attachment");
            return File(fileContents, fileType, fileName);
        }


        private bool AddPdfToDb(string uri, byte[] bytes)
        {
            if(bytes.Length <= 0)
            {
                return false;
            }
            else
            {
                _db.Pdfs.Add(new Picture { Uri = uri, Pdf = bytes });
                _db.SaveChanges();
            }

            return true;
        }
        
    }
}
