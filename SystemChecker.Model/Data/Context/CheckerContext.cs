﻿using SystemChecker.Model.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace SystemChecker.Model.Data
{
    public class CheckerContext : DbContext, ICheckerContext
    {
        public CheckerContext() { }
        public CheckerContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Check> Checks { get; set; }
        public DbSet<CheckType> CheckTypes { get; set; }
        public DbSet<Login> Logins { get; set; }
        public DbSet<ConnString> ConnStrings { get; set; }
        public DbSet<CheckData> CheckData { get; set; }
        public DbSet<CheckResult> CheckResults { get; set; }
        public DbSet<SubCheckType> SubCheckTypes { get; set; }
        public DbSet<CheckNotificationType> CheckNotificationTypes { get; set; }
        public DbSet<CheckNotification> CheckNotifications { get; set; }
        public DbSet<Environment> Environments { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<ContactType> ContactTypes { get; set; }
        public DbSet<CheckGroup> CheckGroups { get; set; }
        public DbSet<GlobalSetting> GlobalSettings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ApiKey> ApiKeys { get; set; }
    }
}