import { BleManager, BleError, Characteristic, Device, } from "react-native-ble-plx";
import base64 from "react-native-base64";

// All BLE devices using this service will stream data using the Nordic UART Service
const NUS_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const NUS_RX_CHARACTERISTIC = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const NUS_TX_CHARACTERISTIC = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";


export interface HermesDeviceStatus {
    id: string;
    version: string;
    connected: boolean;
    state: string;
    type: string;
}

export class HermesDevice {
    static prefix: string = "";

    bleDevice: Device;
    bleManager: BleManager;
    name: string = "";
    id: string = "";
    version: string = "";
    type: string = "";
    state: string = "disconnected";
    connected: boolean = false;
    incomingDataBuffer: string = "";

    setStatus: (status: HermesDeviceStatus) => void;


    constructor(bleDevice: Device, bleManager: BleManager, setStatus: (status: HermesDeviceStatus) => void) {
        this.bleDevice = bleDevice;
        this.bleManager = bleManager;
        this.name = bleDevice.name ?? "No Name";
        this.id = bleDevice.id;
        this.setStatus = setStatus;
    }

    public static checkPrefix(name: string): boolean {
        return name.startsWith(HermesDevice.prefix);
    }

    public async connect(): Promise<void> {
        if (!this.connected) {
            this.state = "connecting";
            this.updateStatus();
            try {
                const deviceConnection = await this.bleManager.connectToDevice(this.bleDevice.id);
                await deviceConnection.discoverAllServicesAndCharacteristics();
                this.bleManager.stopDeviceScan();
                console.log("Ended BLE device scan");
                this.bleDevice.monitorCharacteristicForService(
                    NUS_SERVICE_UUID,
                    NUS_TX_CHARACTERISTIC,
                    this.onNewData
                );
                this.connected = true;
                this.state = "connected";
                this.updateStatus();
                console.log(`Connected to BLE device: ${this.bleDevice.id}`);
            } catch (e) {
                console.error(`Error connecting to BLE device: ${this.bleDevice.id}`, e);
            }
        } else {
            console.warn("Cannot connect, already connected.");
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            this.state = "disconnecting";
            this.updateStatus();
            try {
                await this.bleManager.cancelDeviceConnection(this.bleDevice.id);
            } catch (e) {
                console.error(`Error disconnecting from BLE device: ${this.bleDevice.id}`, e);
            }
            console.log(`Disconnected from BLE device: ${this.bleDevice.id}`);
            this.connected = false;
            this.state = "disconnected";
            this.updateStatus();
        } else {
            console.warn("Cannot disconnect, not connected.");
        }
    }

    public async sendString(data: String): Promise<void> {
        if (this.connected) {
            console.log(`Sending string to device: ${data}`)
            await this.bleDevice.writeCharacteristicWithResponseForService(
                NUS_SERVICE_UUID,
                NUS_RX_CHARACTERISTIC,
                base64.encode(data)
            );
        }
    };

    public updateStatus(): void { }

    public handleNewLine(line: string) {
        console.log(line);
    };

    private onNewData(
        error: BleError | null,
        characteristic: Characteristic | null
    ): void {
        if (error) {
            console.error(`Error in device onNewData: ${error}`);
            return;
        } else if (!characteristic?.value) {
            console.warn("No data was received");
            return;
        }

        const data = base64.decode(characteristic.value);
        for (let i = 0; i < data.length; i++) {
            if (data.charAt(i) == "\n") {
                this.handleNewLine(this.incomingDataBuffer);
                this.incomingDataBuffer = "";
            } else {
                this.incomingDataBuffer += data.charAt(i);
            }
        }
    }
}
