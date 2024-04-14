import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from "../styles/Home.module.css";
import { STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS, ACT_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS } from '../constants';
import { ethers } from 'ethers';

function StakeCards({ sdk }) {

    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI)
    const [count, setCount] = useState(0)
    const [act, setAct] = useState(0)
    const [usdt, setUsdt] = useState(0)
    const address = useAddress()

    const fetchMyStakedNFTs = async () => {
        const events = await contract?.events.getAllEvents()
        const stakedEvents = events?.filter((e) => e.eventName === "Staked" && e.data.user == address)

        let actRewardMinted = 0
        let usdRewardMinted = 0
        for (let i = 0; i < stakedEvents.length; i++) {
            const data = await contract?.call("stakingInfo", [address, i])
            let tokenId = (ethers.utils.formatEther(data.tokenId)) * 10 ** 18
            let lastStakeTime = (ethers.utils.formatEther(data.lastStakeTime)) * 10 ** 18
            let stakingPeriodEnd = (ethers.utils.formatEther(data.stakingPeriodEnd)) * 10 ** 18

            const rewards = await getRewards({
              id: tokenId, 
              lastStakeTime,
              stakingPeriodEnd
            })

            usdRewardMinted += rewards.usdt_remard_minted
            actRewardMinted += rewards.act_remard_minted

            console.log(rewards);
            if(stakingPeriodEnd - lastStakeTime == 0)
                    setCount(count +1)
        }

       

        const act = await sdk.getContract(ACT_CONTRACT_ADDRESS)
        const usdt = await sdk.getContract(USDT_CONTRACT_ADDRESS)
        const act_balance = await act.call("balanceOf", [address])
        const usdt_balance = await usdt.call("balanceOf", [address])
        // setAct(ethers.utils.formatEther(act_balance))
        // setUsdt(ethers.utils.formatEther(usdt_balance))

        setAct(actRewardMinted)
        setUsdt(usdRewardMinted)
    }



    const getTokenPrice = async(nft) => {
      try {
        let price = await contract.call("getNFTPurchasingPrice", [nft.id])
        price = ethers.utils.formatEther(price)
        return parseInt(price * 10 ** 18);
      } catch (error) {
        console.log("price", error);
      }
    }
  
    const getRewards = async(nft) => {
      try {
        let tokenPrice = await getTokenPrice(nft)
        let stakingPeriod = (nft.stakingPeriodEnd - nft.lastStakeTime) / (30 * 24 * 60 * 60)
        let data = await contract.call("calculateRewards", [1,tokenPrice,  stakingPeriod])
        let act = ethers.utils.formatEther(data[0])
        let usdt = ethers.utils.formatEther(data[1])
        
        let total_days = stakingPeriod * 30
        let currentDate = Math.floor(Date.now() / 1000); // Current UNIX timestamp
        let passed_days = Math.floor((currentDate - nft.lastStakeTime) / (24 * 60 * 60)); // Convert to days
        let leftdays = total_days - passed_days;

        act = act.includes('.')? `${act.split('.')[0]}.${act.split('.')[1].substr(0,2)}` : act
        usdt = usdt * 10 ** 12
  
        let one_day_act_rewad = act / total_days;
        let one_day_usdt_rewad = usdt / total_days;
        let completed_days = total_days - leftdays - 1
        let act_remard_minted = one_day_act_rewad * completed_days
        let usdt_remard_minted = one_day_usdt_rewad * completed_days
  
  
        return {usdt_remard_minted, act_remard_minted};
      } catch (error) {
       console.log("errrrrr", error); 
      }
    }

    useEffect(()=> {
        if(contract)
        fetchMyStakedNFTs()
    }, [contract])
  return (
    <div className='gap-4 sm:flex-wrap justify-center items-center w-full px-10' style={{display:'flex'}}>
        <div className='w-[30%] sm:w-full bg-black border-[1px] border-gray-200 rounded-lg pt-6 pb-5'>
                <p className='text-center leading-5'>Staking Completed</p>
                <p className='text-center leading-3'>{count}</p>
        </div>
        <div className='w-[30%] sm:w-full bg-black border-[1px] border-gray-200 rounded-lg pt-6 pb-5'>
                <p className='text-center leading-5'>ACT Balance</p>
                <p className='text-center leading-3'>{act.toFixed(2)}</p>
        </div>
        <div className='w-[30%] sm:w-full bg-black border-[1px] border-gray-200 rounded-lg pt-6 pb-5'>
                <p className='text-center leading-5'>USDT Balance</p>
                <p className='text-center leading-3'>{usdt.toFixed(2)}</p>
        </div>
    </div>
  )
}

export default StakeCards
