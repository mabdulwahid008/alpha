import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { ERC1155_ABI, ERC1155_ADDRESS, STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS } from '../constants'
import { ethers } from 'ethers'
import { useTimer } from 'react-timer-hook';
import styles from "../styles/Home.module.css";
import Image from 'next/image';

function StakedNfts({ sdk }) {
    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI)

    const [stakedNfts, setStakeNfts] = useState(null)

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
        
        console.log("stakedNfts", stakedNfts);
        setStakeNfts(stakedNfts)
    }

    useEffect(()=> {
        if(contract)
        fetchMyStakedNFTs()
    }, [contract])
  return (
    <div className='mb-2' style={{display: "flex"}}>
        {!stakedNfts && <Image src={'https://icon-park.com/imagefiles/loading7_pink.gif'} width={40} height={40} className="mt"/>}
        {stakedNfts?.map((nft, i) => (
            <Card nft={nft} key={i}/>
        ))}
    </div>
  )
}

export default StakedNfts


const Card = ({ nft }) => {
    let expiryTimestamp  = new Date(nft.stakingPeriodEnd * 1000)
    const {
        seconds,
        minutes,
        hours,
        days,
      } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

      const [timeLeft, setTimeLeft] = useState()

      useEffect(()=>{
          
        const fixValue = (x) => {
            return x <= 9 ? `0${x}` : x 
        }
            
        let daysLeft = days % 30
        setTimeLeft({
            months: fixValue((days - daysLeft)/30),
            days: fixValue(daysLeft),
            hours: fixValue(hours),
            minutes: fixValue(minutes),
            seconds: fixValue(seconds),
        })
      }, [seconds])
  
    return (
      <div className={styles.cardContainer}>
            <h1>{nft.name}</h1>
            <img src={nft.image} /> 
            <h4 className='font-bold mt-2'>Time Left to Unstake</h4>
            <div className='gap-1 flex-wrap mt-1' style={{display:"flex"}}>
                <h4> <span className='font-semibold'>{timeLeft?.months}</span>mo - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.days}</span>d - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.hours}</span>h - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.minutes}</span>m - </h4>
                <h4> <span className='font-semibold'>{timeLeft?.seconds}</span>s </h4>
            </div>
        </div>
    );
  };
