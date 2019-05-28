import ip from "secret.js";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: ip,
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
