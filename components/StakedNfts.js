import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { ERC1155_ADDRESS, STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS } from '../constants'
import { ethers } from 'ethers'
import { useTimer } from 'react-timer-hook';
import styles from "../styles/Home.module.css";
import Image from 'next/image';

function StakedNfts({ sdk, setRefresh, refresh }) {
    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI)

    const [stakedNfts, setStakeNfts] = useState(null)
    const [loading, setLoading] = useState(false)

    const address = useAddress()

    const fetchMyStakedNFTs = async () => {
        const events = await contract?.events.getAllEvents()
        const stakedEvents = events?.filter((e) => e.eventName === "Staked" && e.data.user == address)

        const stakedNfts = []
        for (let i = 0; i < stakedEvents.length; i++) {
            let tokenId = parseInt(ethers.utils.formatEther(stakedEvents[i].data.tokenId))
            const data = await contract?.call("stakingInfo", [address, i])
            let erc1155 = await sdk.getContract(ERC1155_ADDRESS)
            const nft = await erc1155.erc1155.get(tokenId)
            stakedNfts.push({
                id: tokenId,
                name: nft?.metadata.name,
                image: nft?.metadata.image,
                stakedAmount: (ethers.utils.formatEther(data.stakedAmount)) * 10 ** 18,
                lastStakeTime: (ethers.utils.formatEther(data.lastStakeTime)) * 10 ** 18,
                stakingPeriodEnd: (ethers.utils.formatEther(data.stakingPeriodEnd)) * 10 ** 18,
            })
        }
        
        setStakeNfts(stakedNfts)
    }

    const unstake = async(index) => {
        setLoading(true)
        try {
            const tx = await contract?.call("unstake", [index])
            setRefresh(s => !s)
        } catch (error) {
            console.log(error);
            alert(error)
        }
        setLoading(false)
    }

    const forcedUnstake = async(index) => {
        const confirm = window.confirm("Are you sure for unstaking forcibly?")
        if(!confirm)
            return;
        setLoading(true)
        try {
            const tx = await contract?.call("forceUnstake", [index])
            setRefresh(s => !s)
        } catch (error) {
            console.log(error);
            alert(error)
        }
        setLoading(false)
    }

    setRefresh(s => !s )

    useEffect(()=> {
        if(contract)
        fetchMyStakedNFTs()
    }, [contract, refresh])
  return (
    <div className='mb-2 flex-wrap justify-center items-center' style={{display: "flex"}}>
        {!stakedNfts && <Image src={'https://icon-park.com/imagefiles/loading7_pink.gif'} width={40} height={40} className="mt"/>}
        {stakedNfts?.map((nft, i) => {
            nft.index = i;
            return <Card nft={nft} key={i} loading={loading} unstake={unstake} forcedUnstake={forcedUnstake}/>
        })}
    </div>
  )
}

export default StakedNfts


const Card = ({ nft, loading, unstake, forcedUnstake }) => {
    let expiryTimestamp  = new Date(nft.stakingPeriodEnd * 1000)
    const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
    const [timeLeft, setTimeLeft] = useState()
    const [rewards, setRewards] = useState({usdt: 0, act: 0})

    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS)


    useEffect(()=>{
        const fixValue = (x) => { return x <= 9 ? `0${x}` : x } 
        let daysLeft = days % 30
        setTimeLeft({
            months: fixValue((days - daysLeft)/30),
            days: fixValue(daysLeft),
            hours: fixValue(hours),
            minutes: fixValue(minutes),
            seconds: fixValue(seconds),
        })

    if(true)
        getRewards()
    }, [seconds])


    
  const getTokenPrice = async() => {
    try {
      let price = await contract.call("getNFTPurchasingPrice", [nft.id])
      price = ethers.utils.formatEther(price)
      return parseInt(price * 10 ** 18);
    } catch (error) {
      console.log("price", error);
    }
  }

  const getRewards = async() => {
    try {
      let tokenPrice = getTokenPrice()
      let stakingPeriod = (nft.stakingPeriodEnd - nft.lastStakeTime) / (30 * 24 * 60 * 60)
      let data = await contract.call("calculateRewards", [1,tokenPrice,  stakingPeriod])
      let act = await ethers.utils.formatEther(data[0])
      let usdt = await ethers.utils.formatEther(data[1])
      
      let total_days = stakingPeriod * 30
      act = act.includes('.')? `${act.split('.')[0]}.${act.split('.')[1].substr(0,2)}` : act
      usdt = usdt * 10 ** 12

      let one_day_act_rewad = act / total_days;
      let one_day_usdt_rewad = usdt / total_days;
      let completed_days = total_days - days - 1
      let act_remard_minted = one_day_act_rewad * completed_days
      let usdt_remard_minted = one_day_usdt_rewad * completed_days

      console.log("nft_index", nft.index, completed_days);

      setRewards({
        act: act_remard_minted.toFixed(2),
        usdt: usdt_remard_minted.toFixed(2),
      })
    } catch (error) {
     console.log("errrrrr", error); 
    }
  }


      
  
    return (
      <div className={styles.cardContainer}>
            <h1>{nft.name}</h1>
            <img src={nft.image} /> 
            <h4 className='font-bold mt-1.5 text-gray-400'>Time Left to Unstake</h4>
            <div className='gap-1 flex-wrap mt-1' style={{display:"flex"}}>
                <h4> <span className='font-semibold'>{timeLeft?.months}</span>mo - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.days}</span>d - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.hours}</span>h - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.minutes}</span>m - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.seconds}</span>s </h4>
            </div>
            <h4 className='font-bold mt-2 text-gray-400'>Reward Calculated</h4>
            <div className="justify-between items-center mt-4 w-full" style={{display:"flex"}}>
                <p className="text-sm leading-3">Alpha Tokens</p>
                <p className="text-sm leading-3">{rewards.act} ACT</p>
            </div>
            <div className="justify-between items-center w-full" style={{display:"flex"}}>
                <p className="text-sm leading-3">USD Thether</p>
                <p className="text-sm leading-3">{rewards.usdt} USDT</p>
            </div>
       

            <div className='' style={{display:'flex'}}>
                {nft.stakingPeriodEnd - nft.lastStakeTime == 0?
                        <button disabled={loading} className='disabled:opacity-70 disabled:cursor-wait mt-4' onClick={() => unstake(nft.index)}>UnStake</button>
                    :
                    <div className='relative'>
                        <button disabled={loading} className='disabled:opacity-70 forced-unstake disabled:cursor-wait mt-4 bg-red-600 hover:bg-red-700' onClick={() => forcedUnstake(nft.index)}>Forced Unstake</button>
                        <p className='absolute text-center w-[256px] opacity-0 -left-14 bg-gray-800 text-white text-[10px] p-2 rounded-md shadow-lg'>To encourage long-term commitment, unstaking forcibly yields 80% of the NFT's price with zero rewards, incentivizing stakers to uphold their stake duration. However, should the need arise, this option provides an 80% return for early unstaking.</p>
                    </div>
                }
            </div>
        </div>
    );
  };
