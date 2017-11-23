import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DataTable, SelectItem } from "primeng/primeng";

import { CheckResultStatus } from "../app.enums";
import { ICheck } from "../app.interfaces";
import { RunCheckComponent } from "../components";
import { AppService, MessageService } from "../services";

import { HubConnection } from "@aspnet/signalr-client";

@Component({
    templateUrl: "./dashboard.template.html",
    styleUrls: ["./dashboard.style.scss"],
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
    public successChartColors = {
        domain: ["#5AA454", "#FBC02D", "#A10A28", "#E0E0E0"],
    };
    public successChartResults: Array<{
        name: string,
        value: number,
        type: CheckResultStatus | null,
    }> = [
        {
            name: "Loading",
            value: 0,
            type: null,
        },
    ];
    public checks: ICheck[] = [];
    public activeOptions: SelectItem[] = [
        { label: "Yes", value: true },
        { label: "No", value: false },
        { label: "All", value: null },
    ];
    public resultOptions: SelectItem[] = [
        { label: "All", value: null },
        { label: "Successful", value: CheckResultStatus.Success },
        { label: "Warning", value: CheckResultStatus.Warning },
        { label: "Failed", value: CheckResultStatus.Failed },
        { label: "Not run", value: CheckResultStatus.NotRun },
    ];
    public activeOption: boolean | null = true;
    public resultOption: CheckResultStatus | null = null;
    public CheckResultStatus = CheckResultStatus;
    @ViewChild("dt") private dataTable: DataTable;
    private hub = new HubConnection("hub/dashboard");
    private hubReady: boolean = false;
    constructor(private appService: AppService, private messageService: MessageService, private ngZone: NgZone) {
        this.loadChecks();
        this.hub.on("check", this.loadChecks.bind(this));
    }
    public async loadChecks() {
        try {
            this.checks = await this.appService.getAll();
            this.updateCharts();
        } catch (e) {
            this.messageService.error("Failed to load checks", e.toString());
        }
    }
    public ngAfterViewInit() {
        setImmediate(() => this.updateActiveFilter());
    }
    public async ngOnInit() {
        this.hub.start();
        this.hubReady = true;
    }
    public ngOnDestroy() {
        if (this.hubReady) {
            this.hub.stop();
        }
    }
    public updateActiveFilter() {
        const col = this.dataTable.columns.find(x => x.header === "Active")!;
        this.dataTable.filter(this.activeOption, col.field, col.filterMatchMode);
    }
    public async run(check: ICheck) {
        await this.appService.run(RunCheckComponent, check);
    }
    public updateCharts() {
        let success = 0;
        let warning = 0;
        let failed = 0;
        let notRun = 0;
        this.checks.forEach(x => {
            const status = x.LastResultStatus;
            switch (status) {
                case CheckResultStatus.Success:
                    success++;
                    break;
                case CheckResultStatus.Warning:
                    warning++;
                    break;
                case CheckResultStatus.Failed:
                    failed++;
                    break;
                case CheckResultStatus.NotRun:
                    notRun++;
                    break;
            }
        });
        this.ngZone.run(() => {
            this.successChartResults = [
                {
                    name: "Successful",
                    value: success,
                    type: CheckResultStatus.Success,
                },
                {
                    name: "Warning",
                    value: warning,
                    type: CheckResultStatus.Warning,
                },
                {
                    name: "Failed",
                    value: failed,
                    type: CheckResultStatus.Failed,
                },
                {
                    name: "Not run",
                    value: notRun,
                    type: CheckResultStatus.NotRun,
                },
            ];
        });
    }
    public updateResultFilter() {
        const col = this.dataTable.columns.find(x => x.header === "Last Result Status")!;
        this.dataTable.filter(this.resultOption, col.field, col.filterMatchMode);
    }
    public onSuccessChartSelect(event: { name: string, value: number }) {
        const selected = this.successChartResults.find(x => x.name === event.name);
        if (selected) {
            this.resultOption = selected.type;
            this.updateResultFilter();
        }
    }
}
