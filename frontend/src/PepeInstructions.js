import React from 'react';

const PepeInstructions = () => {
  const instructions = [
    "Connect your Metamask Wallet on Ethereum Mainnet",
    "App will display your PEPE 0x69 balance",
    "Wanna generate a Pepe? Switch to Sepolia Testnet",
    "Fill the desired fields and click \"Generate Pepe\"",
    "You like what you see? To mint your NFT, click \"Mint NFT\"",
    "Be sure you have enough test ETH. You can obtain some for free at a Sepolia faucet",
    "To see your NFT, go to OpenSea Testnet",
    "Nice! Enjoy your Pepe kek"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <img 
          src="/api/placeholder/192/192"
          alt="Pepe Smart" 
          className="w-48 h-48 mx-auto mb-6 rounded-lg shadow-md"
        />
        <h1 className="text-4xl font-bold text-green-600 mb-8">Pepe NFT Generator</h1>
      </div>
      
      <div className="space-y-6">
        {instructions.map((text, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <p className="text-lg text-gray-700 pt-1">{text}</p>
          </div>
        ))}

        <div className="mt-8 space-y-4">
          <a 
            href="https://www.alchemy.com/faucets/ethereum-sepolia" 
            className="block text-lg text-blue-600 hover:text-blue-800 underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Get test ETH from Alchemy Faucet
          </a>
          <a 
            href="https://testnets.opensea.io/" 
            className="block text-lg text-blue-600 hover:text-blue-800 underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on OpenSea Testnet
          </a>
        </div>
      </div>
    </div>
  );
};

export default PepeInstructions;