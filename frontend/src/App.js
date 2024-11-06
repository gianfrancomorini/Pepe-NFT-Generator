import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

// Create configured axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://www.pepenftgenerator.xyz/api'
    : 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Your existing contract configurations remain the same

// Contract configurations
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
    }]; // Your existing ABI
const contractAddress = "0x53D99642Ea46039c2AB681cabd4B7Df7CD87DE19";

const PEPE_CONTRACT_ADDRESS = '0x6982508145454ce325ddbe47a25d4ec3d2311933';
const PEPE_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)'
];


function App() {
  // State declarations
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
  const [pepeBalance, setPepeBalance] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState(null);
  const [error, setError] = useState(null);

  // Your existing useEffect for Web3 initialization remains the same

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
        } catch (error) {
          console.error("User denied account access or there was an error:", error);
          setError("Failed to connect to wallet. Please ensure MetaMask is installed and unlocked.");
        }
      } else {
        setError('Please install MetaMask to use this app');
      }
    };

    initEthers();

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0]);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Updated handleSubmit with proper error handling and API calls
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      // Validate form data
      const missingFields = Object.entries(formData)
        .filter(([_, value]) => !value.trim())
        .map(([key]) => key);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }
      
      // Generate image using configured axios instance
      const imageResponse = await api.post('/generate-image', formData);
      
      if (!imageResponse.data || !imageResponse.data.imageUrl) {
        throw new Error('Invalid response from image generation');
      }
      
      const imageUrl = imageResponse.data.imageUrl;
      setGeneratedImage(imageUrl);
      
 // Create and upload metadata
 const metadata = {
  name: `Pepe NFT #${Date.now()}`,
  description: "A unique Pepe NFT with custom attributes",
  image: imageUrl,
  attributes: Object.entries(formData).map(([trait_type, value]) => ({
    trait_type,
    value
  }))
};

const metadataResponse = await api.post('/upload-metadata', metadata);

if (!metadataResponse.data || !metadataResponse.data.metadataUrl) {
  throw new Error('Invalid response from metadata upload');
}

setMetadataUrl(metadataResponse.data.metadataUrl);
} catch (error) {
console.error('Error:', error);
setError(error.response?.data?.error || error.message || 'An error occurred');
} finally {
setIsGenerating(false);
}
};

  // Your existing mintNFT function remains the same

  const mintNFT = async () => {
    if (!contract || !metadataUrl) {
      setError('Unable to mint NFT. Please ensure you are connected and have generated an image.');
      return;
    }
    try {
      const tx = await contract.mintNFT(account, metadataUrl);
      await tx.wait();
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError(`Failed to mint NFT: ${error.message}`);
    }
  };

    // Your existing JSX remains the same

  return (
    <div className="App">
      <img 
        src="/pepe-smart.png" 
        alt="Pepe Smart" 
        style={{ width: '300px', height: '300px' }} 
      />
      <h1>Pepe NFT Generator</h1>
      <h5>1- Connect your Metamask Wallet on Ethereum Mainnet</h5>
      <h5>2- App will display your PEPE 0x69 balance </h5>
      <h5>3- To mint an NFT, switch to Sepolia Testnet. Fill the desired fields and click "Generate Pepe". </h5>
      
      <div className="wallet-info">
        {account ? (
          <div>
            <p>Connected: {account}</p>
            <p>PEPE Balance: {pepeBalance ? `${pepeBalance} PEPE` : 'Loading...'}</p>
          </div>
        ) : (
          <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
            Connect Wallet
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {['emotion', 'clothes', 'accessories', 'background'].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleInputChange}
            required
          />
        ))}
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Pepe'}
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      {generatedImage && metadataUrl && (
        <div>
          <img src={generatedImage} alt="Generated Pepe" style={{ maxWidth: '400px' }} />
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      )}
    </div>
  );
}

export default App;