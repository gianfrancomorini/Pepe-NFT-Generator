import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers, BrowserProvider, Contract } from 'ethers';

// Replace with your actual contract ABI and address
const PEPE_CONTRACT_ADDRESS = '0x6982508145454ce325ddbe47a25d4ec3d2311933';
const PEPE_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)'
];

function App() {
  const [formData, setFormData] = useState({
    emotion: '',
    clothes: '',
    accessories: '',
    background: ''
  });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pepeBalance, setPepeBalance] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new BrowserProvider(window.ethereum);
          setProvider(provider);

          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const nftContract = new Contract(contractAddress, contractABI, signer);
          setContract(nftContract);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (error) {
          console.error("User denied account access or there was an error:", error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initEthers();

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', setAccount);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:3001/generate-image', formData);
      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const mintNFT = async () => {
    if (!contract || !generatedImage) return;
    try {
      const tx = await contract.mintNFT(generatedImage);
      await tx.wait();
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
  
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
  
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(nftContract);
  
        const pepeContract = new ethers.Contract(PEPE_CONTRACT_ADDRESS, PEPE_ABI, signer);
        const balance = await pepeContract.balanceOf(address);
        setPepeBalance(ethers.utils.formatUnits(balance, 18));
  
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  return (
    <div className="App">
      <h1>Pepe NFT Generator</h1>
      <div className="wallet-info">
        {account ? (
          <div>
            <p>Connected: {account}</p>
            <p>PEPE Balance: {pepeBalance ? `${pepeBalance} PEPE` : 'Loading...'}</p>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="emotion"
          placeholder="Emotion"
          value={formData.emotion}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="clothes"
          placeholder="Clothes"
          value={formData.clothes}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="accessories"
          placeholder="Accessories"
          value={formData.accessories}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="background"
          placeholder="Background"
          value={formData.background}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Pepe'}
        </button>
      </form>
      {generatedImage && (
        <div>
          <img src={generatedImage} alt="Generated Pepe" />
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      )}
    </div>
  );
}

export default App;