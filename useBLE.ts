import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

import { HermesDevice, HermesDeviceStatus } from "./HermesDevice";
import { DeviceManager, } from "./DeviceManager";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

let incomingDataBuffer: string = ""

interface BluetoothLowEnergyApi {
  requestPermissions: () => Promise<boolean>;
  startBleScan: () => void;
  stopBleScan: () => void;
  clearScanHistory: () => void;
  selectDevice: (device: HermesDevice) => void;
  deselectDevice: () => void;
  selectedDevice: HermesDevice | null;
  allDevices: HermesDevice[];
  deviceStatus: HermesDeviceStatus | null;
}

function useBLE(): BluetoothLowEnergyApi {
  const [allDevices, setAllDevices] = useState<HermesDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<HermesDevice | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<HermesDeviceStatus | null>(null);

  const bleManager = useMemo(() => new BleManager(), []);
  const deviceManager = useMemo(() => new DeviceManager(bleManager, setDeviceStatus), []);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Bluetooth Scan Permission",
        message: "Bluetooth Low Energy scanning required to find devices",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Bluetooth Connect Permission",
        message: "Bluetooth Low Energy connection required to talk to devices",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires location permission since it could be used to determine your location.",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires location permission since it could be used to determine your location.",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: HermesDevice[], nextDevice: Device) => {
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  const startBleScan = () => {
    bleManager.startDeviceScan([DeviceManager.SERVICE_UUID,], null, (error, device) => {
      if (error) {
        console.error("Error during BLE device scan", error);
      }
      if (device) {
        setAllDevices((prevState: HermesDevice[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            console.log(`Found new BLE device`);
            console.log(`- Name: ${device.name}`);
            console.log(`- Device ID: ${device.id}`);
            console.log(`- MTU: ${device.mtu}`);
            console.log(`- Manufacturer Data: ${base64.decode(device.manufacturerData)}`);
            let foundDevice = deviceManager.createDevice(device);
            if (foundDevice) {
              console.log(`Device identified as type: ${foundDevice.constructor.name}`);
              return [...prevState, foundDevice];
            }
          }
          return prevState;
        });
      }
    });
  };

  const stopBleScan = () => {
    bleManager.stopDeviceScan();
    console.log("Ended BLE device scan")
  }

  const clearScanHistory = () => {
    setAllDevices(new Array<HermesDevice>());
    console.log("Cleared found device list")
  }

  const selectDevice = async (device: HermesDevice) => {
    if (selectedDevice && selectedDevice.connected) {
      await selectedDevice.disconnect();
    }
    setSelectedDevice(device);
    device.updateStatus();
  }

  const deselectDevice = async () => {
    if (selectedDevice?.connected) {
      await selectedDevice.disconnect();
    }
    setSelectedDevice(null);
    setDeviceStatus(null);
  }

  return {
    requestPermissions,
    startBleScan,
    stopBleScan,
    clearScanHistory,
    selectDevice,
    deselectDevice,
    allDevices,
    selectedDevice,
    deviceStatus,
  };
}

export default useBLE;
