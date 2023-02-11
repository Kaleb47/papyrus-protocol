import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

import landingImg from './landing.jpg'
import {ReactComponent as Searchicon} from './imgs/search-icon.svg';

// libraries for connecting wallet with web3
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism,arbitrum } from 'wagmi/chains'
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectBtn } from "./connect_btn.js";

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Papyri DAO",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      page:'home'
    }
  }

  render() {
  return (
    <div>
      <Nav />
      {this.state.page === 'home' && <Home />}
      {this.state.page === 'libraries' && <Libraries search={this.state.search}/>}

    </div>
  );
  }
}

class Nav extends React.Component {
  render() {
    return (
      <div className='nav'>
        <span className='nav__title'>Papyri DAO</span>
        <span className='nav__account'>
        <span className='nav__account__balance'>10.0 USDC</span>
        <span> <ConnectWallet /> </span>
      </span>
    </div>
    );
  }
}

class Libraries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: []
    }
  }
  
  render() {
    return (
      <div className='libraries'>
      </div>
    );
  }
}



/* Home stuff*/
class Home extends React.Component {
  render() {
    return (
      <div className='home'>
        <img className='home__img' src={landingImg} alt='landing' />
        <SearchBar />
        </div>
    )
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <div className='search-bar'>
        <input className='search-bar__input' type='text' placeholder='Search' />
        <Searchicon className='search-bar__button' width="3rem" />
      </div>
    );
  }
}

function ConnectWallet() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ConnectBtn />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}


export default App;
