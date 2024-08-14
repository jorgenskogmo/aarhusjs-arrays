// read and write ble packages

// std LEGO
const connectionOptions: ConnectionOptions = {
  service: "00001623-1212-efde-1623-785feabcd123",
  characteristic: "00001624-1212-efde-1623-785feabcd123",
  notify: true,
};

setup = async () => {
  console.log("setup", this.nick);

  await this.write([8, 0, 129, 49, 0, 81, 0, 2]); // led pink
  await this.write([10, 0, 65, 0, 0, 1, 0, 0, 0, 1]); // enable notifications on port 0
  await this.write([10, 0, 65, 1, 0, 1, 0, 0, 0, 1]); // enable notifications on port 1
  await this.sleep(200);
  await this.write([8, 0, 129, 49, 0, 81, 0, 5]); // led green

  this.emit("ready");
};
