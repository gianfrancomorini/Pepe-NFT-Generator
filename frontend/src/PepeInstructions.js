import React from 'react';

const PepeInstructions = () => {
  return (
    <div className="text-center mb-8">
      <img 
        src="/pepe-smart.png" 
        alt="Pepe Smart" 
        className="w-48 h-48 mx-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-green-600 mb-6">Pepe NFT Generator</h1>
      
      <div className="space-y-3 text-left max-w-2xl mx-auto mb-8 p-4">
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">1</span>
          <span className="text-base">Connect your Metamask Wallet on Ethereum Mainnet</span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">2</span>
          <span className="text-base">App will display your PEPE 0x69 balance</span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">3</span>
          <span className="text-base">Wanna generate a Pepe? Switch to Sepolia Testnet</span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">4</span>
          <span className="text-base">Fill the desired fields and click "Generate Pepe"</span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">5</span>
          <span className="text-base">You like what you see? To mint your NFT, click "Mint NFT"</span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">6</span>
          <span className="text-base">
            Be sure you have enough test ETH. You can obtain some for free at a Sepolia faucet like{' '}
            <a 
              href="https://www.alchemy.com/faucets/ethereum-sepolia" 
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Alchemy Faucet
            </a>
          </span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">7</span>
          <span className="text-base">
            To see your NFT, go to{' '}
            <a 
              href="https://testnets.opensea.io/" 
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              OpenSea Testnet
            </a>
          </span>
        </h5>
        <h5 className="flex items-start">
          <span className="inline-flex items-center justify-center bg-green-500 text-white rounded-full w-6 h-6 mr-2 flex-shrink-0">8</span>
          <span className="text-base">Nice! Enjoy your Pepe kek</span>
        </h5>
      </div>
    </div>
  );
};

export default PepeInstructions;