import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Wowzer, WowzerStatus } from "./Wowzer";

type WowzerViewProps = {
    selectedDevice: Wowzer;
    deviceStatus: WowzerStatus;
    deselectDevice: () => void;
};

const WowzerView = (props: WowzerViewProps) => {

    const connect = () => {
        console.log("Attempting to connect");
        props.selectedDevice.connect();
    };

    const disconnect = () => {
        props.selectedDevice.disconnect();
    };

    const cancel = () => {
        props.deselectDevice();
    };

    return <View style={styles.mainView}>
        <Text style={styles.titleText}>
            Wowzer Device
        </Text>
        <Text style={styles.bodyText}>
            Device Type: {props.deviceStatus?.type ?? "none"}
        </Text>
        <Text style={styles.bodyText}>
            Connection Status: {props.deviceStatus?.state ?? "none"}
        </Text>
        <Text style={styles.bodyText}>
            Raw: {props.deviceStatus?.rawData ?? "none"}
        </Text>
        {props.deviceStatus?.state == "disconnected" ?
            <TouchableOpacity
                onPress={connect}
                style={styles.ctaButton}
            >
                <Text style={styles.ctaButtonText}>
                    Connect
                </Text>
            </TouchableOpacity>
            : null}
        {props.deviceStatus?.state == "connected" ?
            <TouchableOpacity
                onPress={disconnect}
                style={styles.ctaButton}
            >
                <Text style={styles.ctaButtonText}>
                    Disconnect
                </Text>
            </TouchableOpacity>
            : null}

        <TouchableOpacity
            onPress={cancel}
            style={styles.ctaButton}
        >
            <Text style={styles.ctaButtonText}>
                Cancel
            </Text>
        </TouchableOpacity>

    </View>;
};

const styles = StyleSheet.create({
    mainView: {
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
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    bodyText: {
        fontSize: 14,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});

export default WowzerView;