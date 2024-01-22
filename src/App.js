import './App.css';
import {marketplace_abi, nft_abi} from "./abi.js"
import { ethers } from 'ethers';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './components/Home.jsx';
import Create from './components/Create.jsx';
import MyItem from './components/MyItem.jsx';
import MyPurchases from "./components/Mypurchases.jsx";
import Nav from './components/Nav.jsx';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  const [nft, setNFT] = useState({})


  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let marketplaceAddress = "0x5B2cEb3b2c0981f91BaDec22302dC064b2D9339c";
        let nftAddress = "0x57d43b02FDdc168E4684a0F4B7f91BfdEa68b8c4";

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          marketplace_abi,
          signer
        );

        const nftcontract = new ethers.Contract(
          nftAddress,
          nft_abi,
          signer
        )

        //console.log(contract);
        setMarketplace(marketplacecontract);
        setNFT(nftcontract)
       
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);


  return (
   
    <BrowserRouter>
     <ToastContainer/>
    <div className="App">
      <Nav account={account}/>
      {
        loading ? (<div>Connecting to Metamask</div>) :(
          <Routes>
          <Route path='/' element={<Hero marketplace={marketplace} nft={nft} />}/>
          <Route path='/create'  element={<Create marketplace={marketplace} nft={nft} />}/>
          <Route path='/my-listed-nfts' element={<MyItem marketplace={marketplace} nft={nft} account={account} />}/>
          <Route path='/my-purchases' element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} />
        </Routes>
        )}
    
    </div>
    </BrowserRouter>
  );
}

export default App;