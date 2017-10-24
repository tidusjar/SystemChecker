﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SystemChecker.Model.Data.Entities
{
    [Table("tblCheck")]
    public class Check
    {
        [Key]
        public int ID { get; set; }

        public string Name { get; set; }

        public bool Active { get; set; }

        public int TypeID { get; set; }

        public ICollection<CheckSchedule> Schedules { get; set; }

        public CheckData Data { get; set; }
    }
}
