// Browser compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

import {
  BLEConnection,
  ConnectionEvent,
  CharacteristicValueChangedEvent,
  MessageType,
  GeckoPorts,
} from "./BLEConnection";

import { store } from "../../store";

const connection = new BLEConnection();

const values: Record<string, any> = {};

export const connect = async () => {
  connection.connect(onConnected, onMessage);
};

export const disconnect = async () => {
  connection.disconnect(onDisconnected);
};

export const unsubscribe = async () => {
  console.log("unsubscribe", Object.keys(store.values));
  Object.keys(store.values).forEach((k) => {
    const port = GeckoPorts[k as keyof typeof GeckoPorts];
    connection.write([10, 0, 65, port, 0, 1, 0, 0, 0, 0]);
  });
};

const onDisconnected = (evt: ConnectionEvent) => {
  store.connected = !evt.error;
};

const onConnected = (evt: ConnectionEvent) => {
  store.connected = !evt.error;
};

const onMessage = (evt: CharacteristicValueChangedEvent) => {
  //   console.log("onMessage", evt.data);
  //   console.log("onMessage", evt.data, evt.value?.byteLength+'b');

  const msgType = evt.data[2];
  const port = evt.data[3];

  // console.log(
  //   "msgType:",
  //   msgType,
  //   MessageType[msgType],
  //   port,
  //   GeckoPorts[port]
  // );

  //   // tight
  //   switch (evt.data[2]) {
  //     case 0x04 /* HUB_ATTACHED_IO */: {
  //       if ([59, 60, 97, 98].includes(port)) {
  //         console.log("subscribe to internal sensor");
  //         //prettier-ignore
  //         connection.write([10, 0x00, 0x41, port, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01]);
  //       }
  //     }
  //     break;

  //     case 0x45: {
  //         // parse PORT_VALUE_SINGLE
  //     }
  //     break;
  //   }

  // using enums
  switch (msgType) {
    case MessageType.HUB_ATTACHED_IO /* 0x04 */: {
      // console.log('HUB_ATTACHED_IO', port )

      if (
        port === GeckoPorts.CURRENT_SENSOR ||
        port === GeckoPorts.VOLTAGE_SENSOR ||
        port === GeckoPorts.GYRO_SENSOR ||
        port === GeckoPorts.ACCELEROMETER
      ) {
        console.log("subscribing to internal", GeckoPorts[port]);
        connection.write([10, 0, 65, port, 0, 1, 0, 0, 0, 1]);
        values[GeckoPorts[port]] = 0;
      }

      break;
    }

    case MessageType.PORT_VALUE_SINGLE /* 0x45 */: {
      if (port === GeckoPorts.CURRENT_SENSOR) {
        const maxCurrentValue = 2444; // TECHNIC_MEDIUM_HUB: 4175
        const maxCurrentRaw = 4095;
        const current = Math.round(
          (evt.value.getUint16(4, true) * maxCurrentValue) / maxCurrentRaw
        );
        // console.log("current:", current);
        values[GeckoPorts[port]] = current;
      }

      if (port === GeckoPorts.VOLTAGE_SENSOR) {
        const maxVoltageValue = 9.615; // DUPLO_TRAIN_BASE: 6.4, REMOTE_CONTROL: 6.4
        const maxVoltageRaw = 3893; // DUPLO_TRAIN_BASE: 3047, REMOTE_CONTROL: 3200, TECHNIC_MEDIUM_HUB: 4095
        const voltage = Math.round(
          (evt.value.getUint16(4, true) * maxVoltageValue) / maxVoltageRaw
        );
        // console.log("voltage:", voltage);
        values[GeckoPorts[port]] = voltage;
      }

      if (port === GeckoPorts.GYRO_SENSOR) {
        // Measured in DPS - degrees per second.
        const x = Math.round((evt.value.getInt16(4, true) * 7) / 400);
        const y = Math.round((evt.value.getInt16(6, true) * 7) / 400);
        const z = Math.round((evt.value.getInt16(8, true) * 7) / 400);
        // console.log(x, y, z);
        values[GeckoPorts[port]] = { x, y, z };
      }

      if (port === GeckoPorts.ACCELEROMETER) {
        // Measured in mG.
        const x = Math.round(evt.value.getInt16(4, true) / 4.096);
        const y = Math.round(evt.value.getInt16(6, true) / 4.096);
        const z = Math.round(evt.value.getInt16(8, true) / 4.096);
        // console.log(x, y, z);
        values[GeckoPorts[port]] = { x, y, z };
      }

      // console.log(values);
      store.values = values;

      break;
    }
  }
};
