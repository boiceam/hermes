import { HermesDevice, HermesDeviceStatus } from "./HermesDevice";


export interface WowzerStatus extends HermesDeviceStatus {
    channelInfo: WowzerChannelInfo[],
    channelStatus: WowzerChannelStatus[],
    phasePower: Array<number>,
    rawData: string,
}

export interface WowzerChannelInfo {
    index: number,
    name: string,
    phase: number,
    maxPowerW: number,
    pulsesPerKwh: number,
}

export interface WowzerChannelStatus {
    powerW: number,
    percent: number,
    pulseCount: number,
    lastIntervalMs: number,
}

export class Wowzer extends HermesDevice {
    static prefix: string = "WZR";
    type: string = "Wowzer";
    channelInfo: WowzerChannelInfo[] = new Array<WowzerChannelInfo>();
    channelStatus: WowzerChannelStatus[] = new Array<WowzerChannelStatus>();
    phasePower: Array<number> = [0, 0, 0];
    rawData: string = "";

    public updateStatus(): void {
        const status: WowzerStatus = {
            id: this.id,
            version: this.version,
            connected: this.connected,
            state: this.state,
            type: this.type,
            channelInfo: [...this.channelInfo],
            channelStatus: [...this.channelStatus],
            phasePower: [0, 0, 0],
            rawData: this.rawData,
        }
        this.setStatus(status);
    }

    public async connect(): Promise<void> {
        await super.connect();
        if (this.connected) {
            this.requestId();
            this.requestVersion();
            this.requestAllChannelInfo();
            this.requestFileList();
        }
    }

    public requestId(): void {
        this.sendString(`gid\n`);
    }

    public requestVersion(): void {
        this.sendString(`version\n`);
    }

    public requestAllChannelInfo(): void {
        this.sendString(`gccfg\n`);
    }

    public requestChannelInfo(channel: number): void {
        this.sendString(`gccfg ${channel}\n`);
    }

    public requestFileList(): void {
        this.sendString(`ls\n`);
    }

    public requestFileDownload(filename: string): void {
        this.sendString(`dl ${filename}\n`);
    }

    public handleNewLine(line: string) {
        console.log(line);
    };

    // public handleNewLine = (line: string) => {
    //     this.rawData = this.rawData + line + "\n";
    //     const token = line.split(",");
    //     if (token[0] === "U") {
    //         console.log("Got Wowzer status update");
    //         for (let i = 1; i < token.length; i += 2) {
    //             let channel = (i - 1) / 2;
    //             let powerW = parseInt(token[i]);
    //             let percent = parseFloat(token[i + 1]);
    //             this.channelStatus[channel].powerW = powerW;
    //             this.channelStatus[channel].percent = percent;
    //         }
    //     } else if (token[0] === "T") {
    //         console.log("Got Wowzer counter update");
    //         for (let i = 1; i < token.length; i += 2) {
    //             let channel = (i - 1) / 2;
    //             this.channelStatus[channel].lastIntervalMs = parseInt(token[i]);
    //             this.channelStatus[channel].pulseCount = parseInt(token[i + 1]);
    //         }
    //     } else if (token[0] === "P") {
    //         console.log(`Got Wowzer param update: ${token[1]}`);
    //         if (token[1] === "CCFG") {
    //             let channel = parseInt(token[2]);
    //             this.channelInfo[channel].index = channel;
    //             this.channelInfo[channel].phase = parseInt(token[3]);
    //             this.channelInfo[channel].pulsesPerKwh = parseInt(token[4]);
    //             this.channelInfo[channel].maxPowerW = parseInt(token[5]);
    //             this.channelInfo[channel].name = token[6];
    //         } else if (token[1] === "VER") {
    //             this.version = token[2];
    //         } else if (token[1] === "ID") {
    //             this.id = token[2];
    //         } else if (token[1] === "FILE") {
    //             let filename = token[2];
    //             let totalBytes = parseInt(token[3]);
    //             // TODO: store file list
    //         } else if (token[1] === "SENT") {
    //             let totalLines = parseInt(token[2]);
    //             // TODO: check received file for correct length
    //         }
    //     }
    //     this.updateStatus();
    // }
}