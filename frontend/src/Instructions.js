import React from 'react';

const Instructions = () => {
  return (
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
          <span>
            Be sure you have enough test ETH. You can obtain some for free at a
            Sepolia faucet like{" "}
            <a
              href="https://www.alchemy.com/faucets/ethereum-sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Alchemy Faucet
            </a>
          </span>
        </li>
        <li className="flex items-start break-words">
          <span className="font-bold mr-2">7.</span>
          <span>
            To see your NFT, go to{" "}
            <a
              href="https://testnets.opensea.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              OpenSea Testnet
            </a>
          </span>
        </li>
        <li className="flex items-start break-words">
          <span className="font-bold mr-2">8.</span>
          <span>Nice! Enjoy your Pepe kek</span>
        </li>
      </ol>
    </div>
  );
};

export default Instructions;