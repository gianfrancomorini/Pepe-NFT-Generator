import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

// Contract ABI and addresses
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_tokenURI",
          "type": "string"
        }
      ],
      "name": "mintNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }]; // ABI truncated for brevity
const contractAddress = "0x53D99642Ea46039c2AB681cabd4B7Df7CD87DE19";

const PEPE_CONTRACT_ADDRESS = '0x6982508145454ce325ddbe47a25d4ec3d2311933';
const PEPE_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)'
];

const API_BASE_URL = 'https://Pepe-NFT-Generator.eba-eas8bwd2.us-west-1.elasticbeanstalk.com';

function App() {
  const [formData, setFormData] = useState({ emotion: '', clothes: '', accessories: '', background: '' });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [pepeBalance, setPepeBalance] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(nftContract);

          const pepeContract = new ethers.Contract(PEPE_CONTRACT_ADDRESS, PEPE_ABI, signer);
          const balance = await pepeContract.balanceOf(address);
          setPepeBalance(ethers.formatUnits(balance, 18));

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (error) {
          console.error("User denied account access or there was an error:", error);
          setError("Failed to connect to wallet. Please ensure MetaMask is installed and unlocked.");
        }
      } else {
        setError('Please install MetaMask to use this app');
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
    setError(null);
    console.log('Starting image generation process...');
    try {
      if (!formData.emotion || !formData.clothes || !formData.accessories || !formData.background) {
        throw new Error('Please fill in all fields');
      }
      console.log('Sending request to backend:', formData);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate-image`, formData);
      console.log('Received response from backend:', response.data);
      
      if (response.data.imageUrl) {
        setGeneratedImage(response.data.imageUrl);
        
        // Create metadata
        const metadata = {
          name: `Pepe NFT #${Date.now()}`,
          description: "A unique Pepe NFT with custom attributes",
          image: response.data.imageUrl,
          attributes: [
            { trait_type: "Emotion", value: formData.emotion },
            { trait_type: "Clothes", value: formData.clothes },
            { trait_type: "Accessories", value: formData.accessories },
            { trait_type: "Background", value: formData.background }
          ]
        };
    
        console.log('Uploading metadata to IPFS:', metadata);
        const metadataResponse = await axios.post(`${API_BASE_URL}/upload-metadata`, metadata);
        console.log('Metadata uploaded, IPFS URL:', metadataResponse.data.metadataUrl);
        setMetadataUrl(metadataResponse.data.metadataUrl);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Error generating image or uploading metadata:', error);
      setError(error.response?.data?.error || error.message || 'An error occurred while generating the image or uploading metadata. Please try again.');
    } finally {
      setIsGenerating(false);
      console.log('Generation process completed.');
    }
  };

  const mintNFT = async () => {
    if (!contract || !metadataUrl) {
      setError('Unable to mint NFT. Please ensure you are connected and have generated an image.');
      return;
    }
    try {
      console.log('Minting NFT with metadata URL:', metadataUrl);
      const tx = await contract.mintNFT(account, metadataUrl);
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);
      
      const transferEvent = receipt.logs.find(log => log.eventName === 'Transfer');
      const tokenId = transferEvent.args.tokenId;
      
      const tokenURI = await contract.tokenURI(tokenId);
      console.log('Token URI:', tokenURI);
      
      const response = await axios.get(tokenURI);
      const metadata = response.data;
      console.log('NFT Metadata:', metadata);
      
      if (metadata.image) {
        setGeneratedImage(metadata.image);
      }
      
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError(`Failed to mint NFT: ${error.message}`);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
  
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
  
        const pepeContract = new ethers.Contract(PEPE_CONTRACT_ADDRESS, PEPE_ABI, signer);
        try {
          const balance = await pepeContract.balanceOf(address);
          setPepeBalance(ethers.formatUnits(balance, 18));
        } catch (balanceError) {
          console.error("Error fetching PEPE balance:", balanceError);
          setPepeBalance("Error fetching balance");
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please ensure MetaMask is installed, unlocked, and connected to the correct network.");
      }
    } else {
      setError('Please install MetaMask to use this app');
    }
  };

  return (
    <div className="App">
  <img 
  src="/Pepe-NFT-Generator/pepe-smart.png" 
  alt="Pepe Smart" 
  style={{ width: '300px', height: '300' }} 
/>
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
        <input type="text" name="emotion" placeholder="Emotion" value={formData.emotion} onChange={handleInputChange} required />
        <input type="text" name="clothes" placeholder="Clothes" value={formData.clothes} onChange={handleInputChange} required />
        <input type="text" name="accessories" placeholder="Accessories" value={formData.accessories} onChange={handleInputChange} required />
        <input type="text" name="background" placeholder="Background" value={formData.background} onChange={handleInputChange} required />
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Pepe'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {generatedImage && metadataUrl && (
        <div>
          <img src={generatedImage} alt="Generated Pepe" />
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      )}
    </div>
  );
}

export default App;