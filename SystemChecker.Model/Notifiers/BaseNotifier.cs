﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SystemChecker.Model.Data;
using SystemChecker.Model.Data.Entities;
using SystemChecker.Model.Data.Interfaces;
using SystemChecker.Model.Helpers;
using SystemChecker.Model.Loggers;

namespace SystemChecker.Model.Notifiers
{
    public abstract class BaseNotifier
    {
        protected enum NotificationType
        {
            Count,
            Minutes,
            Fixed,
        }
        protected IRepository<CheckResult> _checkResults;
        protected Check _check;
        protected CheckNotification _notification;
        protected CheckResult _result;
        protected ISettings _settings;
        protected ICheckLogger _logger;

        protected BaseNotifier(IRepository<CheckResult> checkResults)
        {
            _checkResults = checkResults;
        }

        public async Task Run(Check check, CheckNotification notification, CheckResult result, ISettings settings, ICheckLogger logger)
        {
            _check = check;
            _notification = notification;
            _result = result;
            _settings = settings;
            _logger = logger;

            logger.Info($"Running {GetType().Name}");
            var message = $"Check {_check.Name} completed in {_result.TimeMS}ms with result: {_result.Status.ToString()}";

            var failed = result.Status <= Enums.CheckResultStatus.Failed;
            if (notification.Sent != null && !failed)
            {
                logger.Info("Notification sent and no longer failing, resetting");
                await SendNotification(NotificationType.Fixed, message);
                notification.Sent = null;
            }
            else if (notification.Sent == null && failed)
            {
                var sent = false;
                if (!sent) sent = await CheckCount(message);
                if (!sent) sent = await CheckMinutes(message);
                if (sent) notification.Sent = DateTime.UtcNow;
            }
            else if (notification.Sent != null)
            {
                logger.Info($"Notification already sent at {notification.Sent}");
            }
        }

        private async Task<bool> CheckCount(string message)
        {
            if (!_notification.FailCount.HasValue) { return false; }
            var shouldSend = false;
            if (_notification.FailCount.Value <= 0)
            {
                shouldSend = true;
            }
            else
            {
                shouldSend = !(await _checkResults.GetAll()
                    .Where(x => x.CheckID == _check.ID)
                    .OrderByDescending(x => x.ID)
                    .Take(_notification.FailCount.Value)
                    .Where(x => x.Status > Enums.CheckResultStatus.Failed)
                    .AnyAsync());
            }
            if (shouldSend)
            {
                var failedAfter = $"{_notification.FailCount} check{(_notification.FailCount == 1 ? "" : "s")}";
                await SendNotification(NotificationType.Count, message + (string.IsNullOrEmpty(failedAfter) ? "" : $" - failed after {failedAfter}"), failedAfter);
            }
            return shouldSend;
        }

        private async Task<bool> CheckMinutes(string message)
        {
            if (!_notification.FailMinutes.HasValue) { return false; }
            var shouldSend = false;
            if (_notification.FailMinutes.Value <= 0)
            {
                shouldSend = true;
            }
            else
            {
                var dts = DateTimeOffset.UtcNow.AddMinutes(-_notification.FailMinutes.Value);
                var result = await _checkResults.GetAll()
                    .Where(x => x.CheckID == _check.ID && x.DTS.UtcDateTime <= dts)
                    .OrderByDescending(x => x.ID)
                    .FirstOrDefaultAsync();
                if (result?.Status <= Enums.CheckResultStatus.Failed)
                {
                    shouldSend = !(await _checkResults.GetAll()
                        .Where(x => x.CheckID == _check.ID && x.Status > Enums.CheckResultStatus.Failed && x.DTS > dts)
                        .AnyAsync());
                }
            }
            if (shouldSend)
            {
                var failedAfter = $"{_notification.FailMinutes} minute{(_notification.FailMinutes == 1 ? "" : "s")}";
                await SendNotification(NotificationType.Minutes, message + (string.IsNullOrEmpty(failedAfter) ? "" : $" - failed after {failedAfter}"), failedAfter);
            }
            return shouldSend;
        }

        protected abstract Task SendNotification(NotificationType type, string message, string failedAfter = null);
    }
}
