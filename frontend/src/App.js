import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

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
  // Your URL verification logic
};

// Metadata creation helper function
const createMetadata = (imageUrl, formData) => {
  // Your metadata creation logic
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
    // Your Web3 initialization logic
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Your form submission and image generation logic
  };

  const mintNFT = async () => {
    // Your NFT minting logic
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/api/placeholder/192/192"
              alt="Pepe Smart" 
              className="w-48 h-48 rounded-lg"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-emerald-600 mb-8 break-words">
            Pepe NFT Generator
          </h1>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">1.</span>
                  <span>Connect your Metamask Wallet on Ethereum Mainnet</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">2.</span>
                  <span>App will display your PEPE 0x69 balance</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">3.</span>
                  <span>Wanna generate a Pepe? Switch to Sepolia Testnet</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">4.</span>
                  <span>Fill the desired fields and click "Generate Pepe"</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">5.</span>
                  <span>You like what you see? To mint your NFT, click "Mint NFT"</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">6.</span>
                  <span>Be sure you have enough test ETH. You can obtain some for free at a Sepolia faucet</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">7.</span>
                  <span>To see your NFT, go to OpenSea Testnet</span>
                </li>
                <li className="flex items-start break-words">
                  <span className="font-bold mr-2">8.</span>
                  <span>Nice! Enjoy your Pepe kek</span>
                </li>
              </ol>

              <div className="mt-6 space-y-2 overflow-auto">
                <a 
                  href="https://www.alchemy.com/faucets/ethereum-sepolia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 block break-words"
                >
                  Get test ETH from Alchemy Faucet
                </a>
                <a 
                  href="https://testnets.opensea.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 block break-words"
                >
                  View on OpenSea Testnet
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 break-words">Emotion</label>
                <input
                  type="text"
                  name="emotion"
                  value={formData.emotion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg break-words"
                  placeholder="e.g., happy, sad, angry"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 break-words">Clothes</label>
                <input
                  type="text"
                  name="clothes"
                  value={formData.clothes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg break-words"
                  placeholder="e.g., suit, t-shirt, hoodie"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 break-words">Accessories</label>
                <input
                  type="text"
                  name="accessories"
                  value={formData.accessories}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg break-words"
                  placeholder="e.g., sunglasses, hat, watch"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 break-words">Background</label>
                <input
                  type="text"
                  name="background"
                  value={formData.background}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg break-words"
                  placeholder="e.g., beach, city, space"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Pepe'}
              </button>
            </form>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-h-32 overflow-auto break-words">
                {error}
              </div>
            )}

            {generatedImage && metadataUrl && (
              <div className="text-center space-y-4 overflow-auto">
                <img 
                  src={generatedImage} 
                  alt="Generated Pepe" 
                  className="max-w-md mx-auto rounded-lg shadow-lg break-words"
                />
                <button 
                  onClick={mintNFT}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Mint NFT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;