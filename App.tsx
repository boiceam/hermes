import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WowzerView from "./WowzerView";
import DeviceSelectionModal from "./DeviceSelectionModal";
import useBLE from "./useBLE";
import { HermesDevice } from "./HermesDevice";
import { Wowzer, WowzerStatus } from "./Wowzer";

const App = () => {
  const {
    requestPermissions,
    selectDevice,
    startBleScan,
    stopBleScan,
    clearScanHistory,
    deselectDevice,
    allDevices,
    selectedDevice,
    deviceStatus,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      startBleScan();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const selectDeviceAndClose = (device: HermesDevice) => {
    selectDevice(device);
    setIsModalVisible(false);
    stopBleScan();
  };

  const cancelScanAndClose = () => {
    setIsModalVisible(false);
    stopBleScan();
    clearScanHistory();
  };

  if (!selectedDevice) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.deviceDataTitleWrapper}>
          {selectedDevice ? (
            <>
              <Text style={styles.deviceDataTitleText}>Placeholder</Text>
            </>
          ) : (
            <Text style={styles.deviceDataTitleText}>
              Please Select a Device
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={openModal}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            Select Device
          </Text>
        </TouchableOpacity>
        <DeviceSelectionModal
          closeModal={cancelScanAndClose}
          visible={isModalVisible}
          selectDevice={selectDeviceAndClose}
          devices={allDevices}
        />
      </SafeAreaView>
    );
  } else {
    return <WowzerView
      selectedDevice={selectedDevice as Wowzer}
      deviceStatus={deviceStatus as WowzerStatus}
      deselectDevice={deselectDevice}
    />
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  deviceDataTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceDataTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
