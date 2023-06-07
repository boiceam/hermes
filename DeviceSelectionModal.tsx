import React, { FC, useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { HermesDevice } from "./HermesDevice";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<HermesDevice>;
  selectDevice: (device: HermesDevice) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: HermesDevice[];
  visible: boolean;
  selectDevice: (device: HermesDevice) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, selectDevice, closeModal } = props;

  const selectAndCloseModal = useCallback(() => {
    selectDevice(item.item);
    closeModal();
  }, [closeModal, selectDevice, item.item]);

  return (
    <TouchableOpacity
      onPress={selectAndCloseModal}
      style={modalStyle.ctaButton}
    >
      <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceSelectionModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, selectDevice, closeModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<HermesDevice>) => {
      return (
        <DeviceModalListItem
          item={item}
          selectDevice={selectDevice}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, selectDevice]
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>
          Select Device
        </Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        <TouchableOpacity
          onPress={closeModal}
          style={modalStyle.ctaButton} >
          <Text style={modalStyle.ctaButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
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

export default DeviceSelectionModal;
