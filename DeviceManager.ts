import { BleManager, Device, } from "react-native-ble-plx";
import { HermesDevice, HermesDeviceStatus } from "./HermesDevice";
import { Wowzer, } from "./Wowzer";


export class DeviceManager {
    // All BLE devices using this service will stream data using the Nordic UART Service
    static SERVICE_UUID: string = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    static RX_CHARACTERISTIC: string = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
    static TX_CHARACTERISTIC: string = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

    manager: BleManager;
    setStatus: (status: HermesDeviceStatus) => void;

    constructor(manager: BleManager, setStatus: (status: HermesDeviceStatus) => void) {
        this.manager = manager;
        this.setStatus = setStatus;
    }

    public createDevice = (device: Device): HermesDevice | null => {
        if (device.name && Wowzer.checkPrefix(device.name)) {
            return new Wowzer(device, this.manager, this.setStatus)
        }
        return null;
    }
}