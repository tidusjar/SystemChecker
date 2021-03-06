﻿import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import {
    ICheck, ICheckDetail, ICheckNotificationType, ICheckResults, ICheckType,
    IContactType, IInitRequest, IInitResult, ILoginResult, IRunLog, ISettings,
    ISlackChannel, ISubCheckType, IUser,
} from "../app.interfaces";

import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from "moment";
import * as store from "store";

@Injectable()
export class AppService {
    constructor(private httpClient: HttpClient, private dialogService: MatDialog, private jwtHelperService: JwtHelperService, private router: Router) { }
    public async get(id: number, simpleStatus?: boolean) {
        return await this.httpClient.get<ICheck>(`/api/${id}` + (typeof simpleStatus !== "undefined" ? "/" + simpleStatus.toString() : "")).first().toPromise();
    }
    public async getAll(simpleStatus?: boolean) {
        const checks = await this.httpClient.get<ICheck[]>("/api/" + (typeof simpleStatus !== "undefined" ? simpleStatus.toString() : "")).first().toPromise();
        return checks;
    }
    public async getDetails(id: number, includeResults?: boolean) {
        const check = await this.httpClient.get<ICheckDetail>("/api/details/" + id.toString() + (typeof includeResults !== "undefined" ? "/" + includeResults.toString() : "")).first().toPromise();
        if (!includeResults) {
            delete check.Results;
        }
        return check;
    }
    public async getResults(id: number): Promise<ICheckResults>;
    public async getResults(id: number, dateFrom: Date, dateTo: Date): Promise<ICheckResults>;
    public async getResults(id: number, dateFrom?: Date, dateTo?: Date) {
        return await this.httpClient.get<ICheckResults>("/api/results/" + id.toString()
            + (typeof dateFrom !== "undefined" ? "/" + moment(dateFrom).format("YYYY-MM-DD") : "")
            + (typeof dateTo !== "undefined" ? "/" + moment(dateTo).format("YYYY-MM-DD") : "")).first().toPromise();
    }
    public async edit(check: ICheckDetail) {
        check = await this.httpClient.post<ICheckDetail>("/api", check).first().toPromise();
        delete check.Results;
        return check;
    }
    public async delete(id: number) {
        return await this.httpClient.delete<boolean>(`/api/${id}`).first().toPromise();
    }
    public async getTypes() {
        return await this.httpClient.get<ICheckType[]>("/api/types").first().toPromise();
    }
    public async getSettings() {
        return await this.httpClient.get<ISettings>("/api/settings").first().toPromise();
    }
    public async setSettings(settings: ISettings) {
        return await this.httpClient.post<ISettings>("/api/settings", settings).first().toPromise();
    }
    public async startRun(id: number) {
        return await this.httpClient.post<IRunLog[]>(`/api/run/${id}`, undefined).first().toPromise();
    }
    public async getSubCheckTypes(checkTypeID: number) {
        return await this.httpClient.get<ISubCheckType[]>(`/api/subchecktypes/${checkTypeID}`).first().toPromise();
    }
    public async getCheckNotificationTypes() {
        return await this.httpClient.get<ICheckNotificationType[]>("/api/checknotificationtypes").first().toPromise();
    }
    public async getSlackChannels() {
        return await this.httpClient.get<ISlackChannel[]>("/api/slackchannels").first().toPromise();
    }
    public async getContactTypes() {
        return await this.httpClient.get<IContactType[]>("/api/contacttypes").first().toPromise();
    }
    public async login(): Promise<ILoginResult>;
    public async login(username: string, password: string): Promise<ILoginResult>;
    public async login(username?: string, password?: string) {
        const result = await this.httpClient.post<ILoginResult>("/api/login", { username, password }).first().toPromise();
        if (result.Success) {
            this.setToken(result.Token);
        }
        return result;
    }
    public logout() {
        this.clearToken();
        this.router.navigate(["/"]);
    }
    public async getUser() {
        return await this.httpClient.get<IUser>("/api/user").first().toPromise();
    }
    public async editUser(user: IUser) {
        return await this.httpClient.post<IUser>("/api/user", user).first().toPromise();
    }
    public async getInit() {
        return await this.httpClient.get<IInitResult>("/api/init").first().toPromise();
    }
    public async setInit(initRequest: IInitRequest) {
        return await this.httpClient.post<IInitResult>("/api/init", initRequest).first().toPromise();
    }
    public isAuthed() {
        const token = this.jwtHelperService.tokenGetter();
        if (!token) { return false; }
        try {
            return !this.jwtHelperService.isTokenExpired(token);
        } catch (e) {
            return false;
        }
    }
    public getUsername() {
        if (!this.isAuthed()) { return; }
        const data = this.jwtHelperService.decodeToken();
        return data.username as string | undefined;
    }
    public run(component: any, check: ICheck) {
        return this.dialogService.open(component, {
            width: "90%",
            height: "90%",
            panelClass: "panel-dark",
            data: { check },
        })
            .afterClosed()
            .first()
            .toPromise() as Promise<void>;
    }
    public async validateCronExpression(cron: string, validateOnly?: boolean) {
        return await this.httpClient.post<{ valid: boolean, next?: string; error?: string }>(
            "/api/cron" + (typeof validateOnly !== "undefined" ? "/" + validateOnly.toString() : ""), cron).first().toPromise();
    }
    public setToken(token: string) {
        store.set("token", token);
        console.log(`Set new token: ${token}`);
    }
    public clearToken() {
        store.remove("token");
    }
}
