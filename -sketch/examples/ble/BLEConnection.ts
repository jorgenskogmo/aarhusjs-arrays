export interface ConnectionEvent {
  error: boolean;
  message: string;
}

export interface CharacteristicValueChangedEvent {
  time: number;
  value: DataView;
  data: number[];
}

// Rename to LPF2Hub ?
// Consider separation between Hub and Devices

export class BLEConnection {
  private ble_service_uuid: BluetoothServiceUUID | undefined;
  private ble_characteristic_uuid: BluetoothServiceUUID | undefined;
  private device: BluetoothDevice | undefined;
  private characteristic: BluetoothRemoteGATTCharacteristic | undefined;

  constructor(
    serviceUUID?: BluetoothServiceUUID,
    characteristicUUID?: BluetoothServiceUUID
  ) {
    this.ble_service_uuid = serviceUUID || BLEService.LPF2_HUB;
    this.ble_characteristic_uuid =
      characteristicUUID || BLECharacteristic.LPF2_ALL;
  }

  async disconnect(onDisconnected: (e: ConnectionEvent) => void) {
    const name = this.device?.name;
    try {
      await this.device?.gatt?.disconnect();
      onDisconnected({
        error: false,
        message: `disconnected from ${name}`,
      });
    } catch (e) {
      onDisconnected({
        error: true,
        message: `error disconnecting from ${name}, error: ${e}`,
      });
    }
  }

  async connect(
    onConnected: (e: ConnectionEvent) => void,
    onCharacteristicValueChanged: (evt: CharacteristicValueChangedEvent) => void
  ) {
    if (!this.ble_service_uuid || !this.ble_characteristic_uuid) {
      console.error("BLEConnection missing service configuration");
      return;
    }

    const options: RequestDeviceOptions = {
      filters: [{ services: [this.ble_service_uuid] }],
      optionalServices: [this.ble_service_uuid],
    };

    try {
      this.device = await navigator.bluetooth.requestDevice(options);
      const server = await this.device.gatt?.connect();
      const service = await server?.getPrimaryService(this.ble_service_uuid);

      this.characteristic = await service?.getCharacteristic(
        this.ble_characteristic_uuid
      );

      this.characteristic?.addEventListener(
        "characteristicvaluechanged",
        (evt: Event) => {
          const value = (evt.target as BluetoothRemoteGATTCharacteristic).value;

          if (!value) return;

          // because numbers are easier to read than binary
          let num = [];
          for (let i = 0; i < value.byteLength; i++) {
            num.push(value.getUint8(i));
          }

          // todo: we could handle common tasks here
          // like subscribing to battery etc

          onCharacteristicValueChanged({
            time: evt.timeStamp,
            value: value,
            data: num,
          });
        }
      );

      this.characteristic?.startNotifications();
      onConnected({
        error: false,
        message: `connected to ${this.device.name}`,
      });
    } catch (error) {
      // Mute common, non actionable error messages:
      const errorString = `${error}`;
      if (errorString.includes("User cancelled the requestDevice() chooser")) {
        //console.info("User cancelled the requestDevice() chooser");
      } else {
        console.error("@connect 510", error);
      }
      onConnected({ error: true, message: errorString });
    }
  }

  _delayPromise(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  //

  write(data: number[], delay = 500) {
    if (!this.characteristic) {
      console.warn("not connected, write() ignored");
      return;
    }

    console.log("write", delay);
    const value = new Uint8Array(data);
    // todo: prefix package with checksum
    // const value2 = Uint8Array.from([data.length, ...data]);
    // console.log(data.length, data, [data.length, ...data], value2);

    this.characteristic?.writeValue(value).catch((_e) => {
      // catch 'GATT operation already in progress' errors with retry:
      return Promise.resolve()
        .then(() => this._delayPromise(delay))
        .then(() => this.write(data, delay + 500));
    });
  }
}

// LEGO Wireless Protocol (LWP) https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#document-3-GATT

export enum BLEService {
  LPF2_HUB = "00001623-1212-efde-1623-785feabcd123",
}

export enum BLECharacteristic {
  LPF2_ALL = "00001624-1212-efde-1623-785feabcd123",
}

// https://github.com/nathankellenicki/node-poweredup/blob/master/src/hubs/technicsmallhub.ts
export enum GeckoPorts {
  A = 0,
  B = 1,
  HUB_LED = 49,
  CURRENT_SENSOR = 59,
  VOLTAGE_SENSOR = 60,
  ACCELEROMETER = 97,
  GYRO_SENSOR = 98,
  TILT_SENSOR = 99,
}

export enum MessageType {
  HUB_PROPERTIES = 0x01,
  HUB_ACTIONS = 0x02,
  HUB_ALERTS = 0x03,
  HUB_ATTACHED_IO = 0x04,
  GENERIC_ERROR_MESSAGES = 0x05,
  HW_NETWORK_COMMANDS = 0x08,
  FW_UPDATE_GO_INTO_BOOT_MODE = 0x10,
  FW_UPDATE_LOCK_MEMORY = 0x11,
  FW_UPDATE_LOCK_STATUS_REQUEST = 0x12,
  FW_LOCK_STATUS = 0x13,
  PORT_INFORMATION_REQUEST = 0x21,
  PORT_MODE_INFORMATION_REQUEST = 0x22,
  PORT_INPUT_FORMAT_SETUP_SINGLE = 0x41,
  PORT_INPUT_FORMAT_SETUP_COMBINEDMODE = 0x42,
  PORT_INFORMATION = 0x43,
  PORT_MODE_INFORMATION = 0x44,
  PORT_VALUE_SINGLE = 0x45,
  PORT_VALUE_COMBINEDMODE = 0x46,
  PORT_INPUT_FORMAT_SINGLE = 0x47,
  PORT_INPUT_FORMAT_COMBINEDMODE = 0x48,
  VIRTUAL_PORT_SETUP = 0x61,
  PORT_OUTPUT_COMMAND = 0x81,
  PORT_OUTPUT_COMMAND_FEEDBACK = 0x82,
}
