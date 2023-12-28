import './App.css';
import idl from './idl.json';
import React from 'react';
import { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [contractState, setContractState] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const {SystemProgram, Keypair} = anchor.web3;
  let caller = Keypair.generate()

  // get contract address
  let programId = new PublicKey(idl.metadata.address);
  console.log('Program Id set correctly: ', programId); 

  // define solana cluster
  const network = clusterApiUrl("devnet");

  // transaction confirmation level
  const opts = {
    preflightCommitment: "processed"
  }

  window.onload = async () => {
    try {
      if(window.solana) {
        const solana = window.solana;
        if (solana.isPhantom) {
          console.log('Phantom wallet found');
          const res = await solana.connect({ onlyIfTrusted: true });
          console.log('Phantom wallet connected with address: ', res.publicKey.toString());
          setWalletAddress(res.publicKey.toString());
        }
      }else {
        alert("Wallet not found! Get Phantom wallet 👻")
      }
    } catch (error) {
      console.error('failed to connect wallet with error: ', error)
    }
  }

  const connectWallet = async () => {
    if(window.solana) {
      const solana = window.solana;
      const res = await solana.connect();
      setWalletAddress(res.publicKey.toString());
    }else {
      alert('Wallet not found! Get Phantom wallet 👻');
    }
  }

  // connect to a solana cluster provider
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new anchor.AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    console.log("connected to provider: ", provider)
    return provider;
  }

  // call contract
  const getContractState = async () => {
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl, programId, provider);
      const account = await program.account.init.fetch(caller.publicKey);
      setContractState(account.value.toString());
      console.log("contract state: ", contractState);
    } catch (error) {
      console.error("error when fetching contract state: ", error);
      setContractState(null)
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const updateContractState = async () => {

  }

  return (
    <div className="App">
      <h2>SOLANA BASIC STORAGE DAPP</h2>
      <header className="App-header">
        {!walletAddress && (
          <div>
            <button className='btn' onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
        {walletAddress && (
          <div>
              <p>
                Connected account:  {' '}
                <span className='address'>{walletAddress}</span>
              </p>
                <div className='grid-container'>
                  <div className='grid-item'>
                    <input
                      placeholder='value'
                      value={inputValue}
                      onChange={onInputChange}
                    ></input>
                    <br></br>
                    <button className='btn' onClick={updateContractState}>Store</button>
                  </div>
                  <div className='grid-item'>
                    <button className='btn' onClick={getContractState}>
                      Retrieve
                    </button>
                    <p>{contractState}</p>
                  </div>
                </div> 
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
