import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import './tasks/accounts';
import './tasks/clean';
import './tasks/execute-payouts';

import { resolve } from 'path';

import { config as dotenvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';

dotenvConfig({ path: resolve(__dirname, './.env') });

const chainIds = {
  goerli: 5,
  hardhat: 1337,
  mainnet: 1
};

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                optimizer: {
                enabled: true,
                runs: 800,
                              },
                          },
            },
              {
          version: "0.8.9",
          settings: {
              optimizer: {
                  enabled: true,
                  runs: 800,
              },
          },
      },
            {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: '0.6.2',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
          version: "0.7.6",
          settings: {
              optimizer: {
                  enabled: true,
                  runs: 800,
              },
          },
      }]
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        chainId: 31337,
        forking: {
            url: process.env.MAINNET_RPC_URL
        },
    },
  }
};
