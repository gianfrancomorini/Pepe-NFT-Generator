import React from 'react';

const PepeInstructions = () => {
  return (
    <div className="mx-auto mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="text-center">
        <img 
          src="/api/placeholder/192/192"
          alt="Pepe Smart" 
          className="w-48 h-48 mx-auto mb-4 rounded-lg"
        />
        <h1 className="text-3xl font-bold text-green-600 mb-6">Pepe NFT Generator</h1>
      </div>
      
      <div className="space-y-4 max-w-2xl mx-auto">
        {[
          "Connect your Metamask Wallet on Ethereum Mainnet",
          "App will display your PEPE 0x69 balance",
          "Wanna generate a Pepe? Switch to Sepolia Testnet",
          "Fill the desired fields and click \"Generate Pepe\"",
          "You like what you see? To mint your NFT, click \"Mint NFT\"",
          <>
            Be sure you have enough test ETH. You can obtain some for free at a Sepolia faucet like{' '}
            <a 
              href="https://www.alchemy.com/faucets/ethereum-sepolia" 
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Alchemy Faucet
            </a>
          </>,
          <>
            To see your NFT, go to{' '}
            <a 
              href="https://testnets.opensea.io/" 
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              OpenSea Testnet
            </a>
          </>,
          "Nice! Enjoy your Pepe kek"
        ].map((text, index) => (
          <div key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-base text-gray-700">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PepeInstructions;