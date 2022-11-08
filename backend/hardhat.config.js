/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: {
        version: "0.8.1",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000
            }
        }
    },
    defaultNetwork: "mumbai",
    networks: {
        hardhat: {},
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        mumbai: {
            url: process.env.MUMBAI_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
    },
}
