﻿using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SystemChecker.Model.Hubs
{
    public class DashboardHub : Hub
    {
        public async Task Send(string message)
        {
            await Clients.All.InvokeAsync("Send", $"Bounce: {message}");
        }
    }
}
