require("@nomiclabs/hardhat-waffle")
require("dotenv").config()


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_APP_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  paths: {
    sources: './src/contracts',
    artifacts: './src/artifacts',
    tests: './test'
  }
}
