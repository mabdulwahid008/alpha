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
        for (let i = 0; i < stakedEvents.length; i++) {
            const data = await contract?.call("stakingInfo", [address, i])
            let lastStakeTime = (ethers.utils.formatEther(data.lastStakeTime)) * 10 ** 18
            let stakingPeriodEnd = (ethers.utils.formatEther(data.stakingPeriodEnd)) * 10 ** 18
            if(stakingPeriodEnd - lastStakeTime == 0)
                    setCount(count +1)
        }

        const act = await sdk.getContract(ACT_CONTRACT_ADDRESS)
        const usdt = await sdk.getContract(USDT_CONTRACT_ADDRESS)
        const act_balance = await act.call("balanceOf", [address])
        const usdt_balance = await usdt.call("balanceOf", [address])
        console.log("ethers.utils.formatEther(act_balance)", ethers.utils.formatEther(act_balance));
        console.log("ethers.utils.formatEther(usdt_balance)", ethers.utils.formatEther(usdt_balance));
        setAct(ethers.utils.formatEther(act_balance))
        setUsdt(ethers.utils.formatEther(usdt_balance))
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
                <p className='text-center leading-3'>{act}</p>
        </div>
        <div className='w-[30%] sm:w-full bg-black border-[1px] border-gray-200 rounded-lg pt-6 pb-5'>
                <p className='text-center leading-5'>USDT Balance</p>
                <p className='text-center leading-3'>{usdt}</p>
        </div>
    </div>
  )
}

export default StakeCards
