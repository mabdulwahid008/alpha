import React, { useState } from 'react';
import { ethers } from 'ethers';

const YourContractStakeComponent = () => {
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');

  const stake = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Use MetaMask provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Your contract address and ABI
        const contractAddress = '0x9f942b5fb2e208b5C2567349742A1B9C80ac97eB';
        const contractABI = [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_erc1155Token",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_actToken",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_usdtToken",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
          },
          {
            "inputs": [],
            "name": "ReentrancyGuardReentrantCall",
            "type": "error"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "before",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "now",
                "type": "uint256"
              }
            ],
            "name": "ConversionRate",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "FundsDebited",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdtPrice",
                "type": "uint256"
              }
            ],
            "name": "NFTSold",
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
                "name": "user",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "actReward",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdtReward",
                "type": "uint256"
              }
            ],
            "name": "RewardClaimed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "stakingPeriod",
                "type": "uint256"
              }
            ],
            "name": "Staked",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "TokensDebited",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "token",
                "type": "string"
              }
            ],
            "name": "TokensReceived",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "actReceived",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdtSent",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "actPricePertoken",
                "type": "uint256"
              }
            ],
            "name": "USDTTransfer",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "stakingIndex",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "actReward",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdtReward",
                "type": "uint256"
              }
            ],
            "name": "Unstaked",
            "type": "event"
          },
          {
            "inputs": [],
            "name": "ACT_ADDRESS",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "ACT_DECIMALS",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "CONVERSION_RATE",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "ERC1155_ADDRESS",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "MONTH_IN_SECONDS",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "USDT_ADDRESS",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "USDT_DECIMALS",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "stakedAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_perTokenPurchasingPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakingDuration",
                "type": "uint256"
              }
            ],
            "name": "calculateRewards",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "contractNFTs",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakedAmount",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "debitFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "name": "debitTokenBalance",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "depositACT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "depositUSDT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "stakingIndex",
                "type": "uint256"
              }
            ],
            "name": "forceUnstake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_percent",
                "type": "uint256"
              }
            ],
            "name": "getACTsWorth",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "getNFTPurchasingPrice",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "pure",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
              },
              {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
              },
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              }
            ],
            "name": "onERC1155BatchReceived",
            "outputs": [
              {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              }
            ],
            "name": "onERC1155Received",
            "outputs": [
              {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
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
            "type": "function"
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
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
              }
            ],
            "name": "sellNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_stakedAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_stakingPeriodMonths",
                "type": "uint256"
              }
            ],
            "name": "stake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "stakedNFTs",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "stakingInfo",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakedAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastStakeTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakingPeriodEnd",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
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
                "internalType": "uint256",
                "name": "stakingIndex",
                "type": "uint256"
              }
            ],
            "name": "unstake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_rate",
                "type": "uint256"
              }
            ],
            "name": "updateConversionRate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
              }
            ],
            "name": "withDrawNFTs",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "stateMutability": "payable",
            "type": "receive"
          }
        ]; // Your contract's ABI here
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Convert amount to the appropriate format
        const parsedAmount = ethers.utils.parseEther(amount);

        // Call the stake function of the contract
        const tx = await contract.stake(tokenId, parsedAmount, duration, { gasLimit: 1000000 });

        setStatus('Transaction sent, waiting for confirmation...');
        await tx.wait();

        setStatus('Stake successful!');
      } else {
        setStatus('MetaMask is not installed');
      }
    } catch (error) {
      setStatus(`Error staking: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Stake Tokens</h2>
      <div>
        <label>Token ID:</label>
        <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      </div>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label>Duration:</label>
        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <button onClick={stake}>Stake</button>
      <div>{status}</div>
    </div>
  );
};

export default YourContractStakeComponent;