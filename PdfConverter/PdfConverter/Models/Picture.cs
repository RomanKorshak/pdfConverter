using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PdfConverter.Models
{
    public class Picture
    {
        public int Id { get; set; }
        public string Uri { get; set; }
        public byte[] Pdf { get; set; }
    }
}
