
// LEGO Wireless Protocol (LWP) v.3.0 RC-10 @ page 12
// https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#document-3-GATT
const LEGO_BLE_SERVICE = "00001623-1212-efde-1623-785feabcd123";
const LEGO_BLE_CHARACTERISTIC = "00001624-1212-efde-1623-785feabcd123";


const ConnectionStates = {
  DISCONNECTED: 1,
  CONNECTING: 2,
  CONNECTED: 3,
}

export class BLEDeviceBase extends EventEmitter {
  init = false;
  nick = "default nickname";
  name = "";
  char = undefined;
  connectionState = ConnectionStates.DISCONNECTED;
  _initializationTimeout = -1;
  verbose = 0;

  constructor(nickname, verbose = 0) {
    super();
    this.verbose = verbose;
    this.nick = nickname;
  }

  sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  write = async (data) => {
    if (!this.char) return;

    await this.char.writeValue(new Uint8Array(data));
  };

  connect = async () => {
    console.log("BLEDevice", this.nick, "connect");
    if (this.connectionState !== ConnectionStates.DISCONNECTED) return;

    this.connectionState = ConnectionStates.CONNECTING;

    let characteristic;

    try {
      const options = {
        filters: [{ services: [LEGO_BLE_SERVICE] }],
        optionalServices: [LEGO_BLE_SERVICE],
      };

      // console.log("Requesting Bluetooth Device with options:", options);
      const device = await navigator.bluetooth.requestDevice(options);

      this.name = device.name || "unnamed device";

      const server = await device.gatt?.connect();

      const service = await server?.getPrimaryService(LEGO_BLE_SERVICE);

      characteristic = await service?.getCharacteristic(
        LEGO_BLE_CHARACTERISTIC
      );
    } catch (error) {
      console.error("@connect 510", error);
    }

    if (!characteristic) {
      console.error("@connect 520", "Failed to get characteristic");
      return;
    }

    this.char = characteristic;
    console.log(`BLEDevice "${this.name}" connected`);

    this.char.addEventListener("characteristicvaluechanged", (evt: { target: { value: any; }; timeStamp: any; }) => {

      let value = evt.target.value;

      this.verbose > 1 &&
        console.log(
          "characteristicvaluechanged on",
          this.nick,
          evt.timeStamp,
          "value",
          value
        );

      //
      if (this.init === false) {
        if (this._initializationTimeout != -1) {
          clearTimeout(this._initializationTimeout);
          this.verbose > 2 && console.log("init step", this.nick);
        }
        this._initializationTimeout = setTimeout(() => {
          this.init = true;
          this.verbose > 2 && console.log("init", this.nick);
          this.emit("internal.connected");
        }, 1);
      }

      //
      this._parseMessage(value);
    });

    this.char.startNotifications();
  };

  _parseMessage = (value) => {
    let hex = [];
    let num = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
      hex.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
      num.push(value.getUint8(i));
    }

    this.verbose > 2 && console.log("> hex:" + hex);
    // console.log("> num:" + num);
    this.verbose > 2 && console.log("> num:" + `[${num.join(", ")}]`);

    //
    const port = num[3];

    // [5, 0, 69, 1, 10]
    if (num.length === 5 && num[2] === 69) {
      this.emit("internal.value", num);
    }

    if (num.length === 5 && num[2] === 4 && num[4] === 0) {
      console.log("Disconnect?", port);
      this.emit("internal.disconnected", num);
    }

    if (num.length === 15 && num[2] == 4) {
      // attached I/O

      const deviceId = num[5];
      const deviceName = LPF2Devices[`${deviceId}`];
      console.log(
        "> attached I/O port:",
        port,
        "LPF2 id:",
        deviceId,
        "LPF2 type:",
        deviceName
      );
    }
  };
}


// event emitter

const events = new WeakMap();

export class EventEmitter {
  constructor() {
    events.set(this, new Map());
  }

  addListener(label, callback, once = false) {
    if (
      typeof callback !== "function" ||
      typeof label !== "string" ||
      typeof once !== "boolean"
    ) {
      throw TypeError(
        "label must be a string, callback must be a function, once must be a boolean"
      );
    }

    this.emit("newListener", label, callback);

    const event = events.get(this);
    event.has(label) || event.set(label, new Map());

    const callbacks = event.get(label);
    callbacks.set(callback, once);

    if (callbacks.size > 10) {
      console.warn("more than 10 listeners in", this, "on", label);
    }
  }

  removeListener(label, callback) {
    if (typeof callback !== "function" || typeof label !== "string") {
      throw TypeError("label must be a string, callback must be a function");
    }

    const event = events.get(this);
    const callbacks = event.get(label);

    if (callbacks) {
      return callbacks.delete(callback);
    }

    this.emit("removeListener", label, callback);
  }

  emit(label, ...args) {
    const event = events.get(this);

    let callbacks = event.get(label);
    if (callbacks) {
      // let consume = false;

      // args.unshift({
      //  type: label,
      //  consume: (value = true) => {
      //    consume = value;
      //  }
      // });

      for (let [callback, once] of callbacks) {
        if (once) {
          callbacks.delete(callback);
        }
        let c = callback(...args);
        if (c === false) {
          return true;
        }
      }
      return true;
    }
    return false;
  }

  on(label, callback) {
    this.addListener(label, callback, false);
  }

  once(label, callback) {
    this.addListener(label, callback, true);
  }

  off(label, callback) {
    return this.removeListener(label, callback);
  }
}


// lpf2devices

const LPF2Devices = {
  MOTOR: 1,
  HUB_VOLTAGE: 20,
  HUB_CURRENT: 21,
  HUB_PIEZO: 22,
  HUB_LED: 23,
  WEDO_TILT_SENSOR: 34,
  WEDO_MOTION_SENSOR: 35,
  BOOST_COLOR_SENSOR: 37,
  BOOST_EXTERNAL_MOTOR: 38,
  BOOST_INTERNAL_MOTOR: 39,
  BOOST_INTERNAL_TILT: 40,
  DUPLO_TRAIN_MOTOR: 41,
  DUPLO_TRAIN_SOUND: 42,
  DUPLO_TRAIN_COLOR_SENSOR: 43,
  DUPLO_TRAIN_MOVE_SENSOR: 44,
  CONVOY_MEDIUM_MOTOR: 46,
  CONVOY_LARGE_MOTOR: 47,
  FLIPPER_MEDIUM_MOTOR: 48,
  FLIPPER_LARGE_MOTOR: 49,
  HUB_GESTURE: 54,
  REMOTE_BUTTON_SENSOR: 55,
  RSSI_SENSOR: 56,
  HUB_ACCELEROMETER: 57,
  HUB_GYROSCOPE: 58,
  HUB_ORIENTATION: 59,
  HUB_TEMPERATURE: 60,
  FLIPPER_COLOR_SENSOR: 61,
  FLIPPER_DISTANCE_SENSOR: 62,
  FLIPPER_FORCE_SENSOR: 63,
  GECKO_RGB_LED: 64,
  GECKO_MOTOR: 65,
}
