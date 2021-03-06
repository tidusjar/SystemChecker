// Page Service

import { Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { AppService } from "./app.service";

@Injectable()
export class PageService {
    public title: string = "Loading..";
    public dashboardLink: boolean = false;
    constructor(private router: Router, private appService: AppService) {
        this.router.events
            .filter((e: Event) => e instanceof NavigationEnd)
            .subscribe((e: NavigationEnd) => {
                let currentRoute = this.router.routerState.root;
                while (currentRoute.children[0] !== undefined) {
                    currentRoute = currentRoute.children[0];
                }
                this.title = currentRoute.snapshot.data.title;
                this.dashboardLink = !currentRoute.snapshot.data.noDashboardLink;
            });
    }
    public get username() {
        return this.appService.getUsername();
    }
}
