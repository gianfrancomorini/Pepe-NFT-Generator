import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import PepeInstructions from './PepeInstructions';

// Create configured axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://pepenftgenerator.xyz/api'
    : 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Contract configurations
const contractABI = [[
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
  }
]]; // Replace with your actual ABI
const contractAddress = "0x53D99642Ea46039c2AB681cabd4B7Df7CD87DE19";

const PEPE_CONTRACT_ADDRESS = '0x6982508145454ce325ddbe47a25d4ec3d2311933';
const PEPE_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address recipient, uint256 amount) external returns (bool)'
];

// URL verification helper function
const verifyUrls = async (metadataUrl, imageUrl) => {
  try {
    // Check if metadata URL is accessible
    const metadataResponse = await axios.get(metadataUrl);
    if (!metadataResponse.data || !metadataResponse.data.image) {
      throw new Error('Invalid metadata format');
    }

    // Check if image URL is accessible
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    if (!imageResponse.data) {
      throw new Error('Image not accessible');
    }

    return true;
  } catch (error) {
    console.error('URL verification failed:', error);
    return false;
  }
};

// Metadata creation helper function
const createMetadata = (imageUrl, formData) => {
  return {
    name: `Pepe NFT #${Date.now()}`,
    description: "A unique Pepe NFT with custom attributes",
    image: imageUrl,
    external_url: "https://pepenftgenerator.xyz",
    attributes: [
      {
        trait_type: "Emotion",
        value: formData.emotion
      },
      {
        trait_type: "Clothes",
        value: formData.clothes
      },
      {
        trait_type: "Accessories",
        value: formData.accessories
      },
      {
        trait_type: "Background",
        value: formData.background
      }
    ]
  };
};

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

  // Initialize Web3 and contracts
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      // Form validation
      const missingFields = Object.entries(formData)
        .filter(([_, value]) => !value.trim())
        .map(([key]) => key);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }
      
      // Generate image
      const imageResponse = await api.post('/generate-image', formData);
      
      if (!imageResponse.data || !imageResponse.data.imageUrl) {
        throw new Error('Invalid response from image generation');
      }
      
      const imageUrl = imageResponse.data.imageUrl;
      
      // Verify image URL is accessible
      const isImageValid = await verifyUrls(imageUrl);
      if (!isImageValid) {
        throw new Error('Generated image is not accessible');
      }
      
      setGeneratedImage(imageUrl);
      
      // Create and upload metadata
      const metadata = createMetadata(imageUrl, formData);
      const metadataResponse = await api.post('/upload-metadata', metadata);

      if (!metadataResponse.data || !metadataResponse.data.metadataUrl) {
        throw new Error('Invalid response from metadata upload');
      }

      // Verify metadata URL is accessible
      const isMetadataValid = await verifyUrls(metadataResponse.data.metadataUrl);
      if (!isMetadataValid) {
        throw new Error('Metadata is not accessible');
      }

      setMetadataUrl(metadataResponse.data.metadataUrl);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || error.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const mintNFT = async () => {
    if (!contract || !metadataUrl) {
      setError('Unable to mint NFT. Please ensure you are connected and have generated an image.');
      return;
    }

    try {
      // Verify chain ID is correct for Sepolia
      const { chainId } = await provider.getNetwork();
      if (chainId !== 11155111) { // Sepolia chain ID
        throw new Error('Please switch to Sepolia testnet to mint NFTs');
      }

      // Verify metadata one final time before minting
      const isValid = await verifyUrls(metadataUrl);
      if (!isValid) {
        throw new Error('Metadata verification failed. Please try generating the image again.');
      }

      setError('Minting NFT... Please wait and approve the transaction.');
      const tx = await contract.mintNFT(account, metadataUrl);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the token ID from the event logs
      const transferEvent = receipt.logs.find(
        log => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      
      if (transferEvent) {
        const tokenId = ethers.getBigInt(transferEvent.topics[3]).toString();
        setError(`NFT minted successfully! Token ID: ${tokenId}`);
        
        // Provide OpenSea link
        const openSeaUrl = `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`;
        alert(`NFT minted successfully! View on OpenSea: ${openSeaUrl}`);
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError(`Failed to mint NFT: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <PepeInstructions />
        
        <div className="wallet-info mb-6 p-4 bg-gray-50 rounded-lg">
          {account ? (
            <div className="space-y-2">
              <p className="font-mono text-sm">Connected: {account}</p>
              <p className="font-bold">PEPE Balance: {pepeBalance ? `${pepeBalance} PEPE` : 'Loading...'}</p>
            </div>
          ) : (
            <button 
              onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {['emotion', 'clothes', 'accessories', 'background'].map(field => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          ))}
          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate Pepe'}
          </button>
        </form>
        
        {error && (
          <p className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</p>
        )}
        
        {generatedImage && metadataUrl && (
          <div className="mt-6 text-center">
            <img src={generatedImage} alt="Generated Pepe" className="max-w-md mx-auto rounded-lg shadow-lg" />
            <button 
              onClick={mintNFT}
              className="mt-4 bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              Mint NFT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;