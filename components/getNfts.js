// import { useAccount } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Card from "./card.js";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ERC1155_ABI, ERC1155_ADDRESS, STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS } from '../constants/index'
import { ethers } from 'ethers'
import Image from "next/image";

export default function GetNfts({ sdk, setRefresh, refresh }) {

  const [nfts, setNfts] = useState(null);
  const [stakeNft, setStakeNft] = useState(false);
  const { contract } = useContract(ERC1155_ADDRESS, ERC1155_ABI)
  const address = useAddress();

  const getData = async( uri, tokenBalance, id ) => {
    uri = uri.replace('ipfs://', '')
    const response = await fetch(`https://ipfs.io/ipfs/${uri}`,{
      method:'GET',
      headers: {
        'Content-Type': 'Application/json'
      }
    })
    let res = await response.json()
    if(response.status === 200){
      if(tokenBalance > 0)
      return {
        name:res.name,
        balance: tokenBalance,
        image: `https://ipfs.io/ipfs/${res.image.replace('ipfs://', '')}`,
        id: id
      }
      else{
        return null
      }
    }
    else{
      return null
    }
  }

  const getOwnedNfts = async() => {
    // let add = '0xdA6FC02997Fb49941f2067babfC32020717fa12a'
    let balance_od_0 = await contract?.call('balanceOf', [address, 0])
    let balance_od_1 = await contract?.call('balanceOf', [address, 1])
    let balance_od_2 = await contract?.call('balanceOf', [address, 2])
    let balance_od_3 = await contract?.call('balanceOf', [address, 3])
    let id_0_balanace = ethers?.utils?.formatEther(balance_od_0) * 10 ** 18
    let id_1_balanace = ethers?.utils?.formatEther(balance_od_1) * 10 ** 18
    let id_2_balanace = ethers?.utils?.formatEther(balance_od_2) * 10 ** 18
    let id_3_balanace = ethers?.utils?.formatEther(balance_od_3) * 10 ** 18

    let nftss = []
    const uri_0 = await contract?.call('uri', [0])
    const uri_1 = await contract?.call('uri', [1])
    const uri_2 = await contract?.call('uri', [2])
    const uri_3 = await contract?.call('uri', [3])
    const data_0 = await getData(uri_0, id_0_balanace, 0)
    const data_1 = await getData(uri_1, id_0_balanace, 1)
    const data_2 = await getData(uri_2, id_0_balanace, 2)
    const data_3 = await getData(uri_3, id_0_balanace, 3)
    if(data_0)
      nftss.push(data_0)
    if(data_1)
      nftss.push(data_1)
    if(data_2)
      nftss.push(data_2)
    if(data_3)
      nftss.push(data_3)


    // const contract = await sdk.getContract(ERC1155_ADDRESS)
    // const nfts = await contract.erc1155.getOwned(address)
    // let nftss = []
    // for (let i = 0; i < nfts.length; i++) {
    //   nftss.push({
    //     name: nfts[i].metadata.name,
    //     balance: nfts[i].quantityOwned,
    //     image: nfts[i].metadata.image,
    //     id: nfts[i].metadata.id
    //   })
    // }
    
    setNfts(nftss)
  }

  useEffect(()=>{
    if(contract)
    getOwnedNfts()
  }, [refresh, contract])


  return (
    <>
   {nfts? <>
      {nfts.length > 0 ? (
        <section className={styles.dataContainer}>
          {nfts.map((nft) => {
            return (
                Array.from({ length: nft.balance }, (_, index) => (
                  <Card
                    setStakeNft={setStakeNft}
                    nft={nft}
                    key={index} // Ensure each key is unique
                  />
                ))
            );
          })}
          {stakeNft && <Model stakeNft={stakeNft} setStakeNft={setStakeNft} setRefresh={setRefresh}/>}
        </section>
      ) : (
        <h3>You do not have any nft</h3>
      )}
      {stakeNft && <Model stakeNft={stakeNft} setStakeNft={setStakeNft} setRefresh={setRefresh}/>}
    </>
      :
      <Image src={'https://icon-park.com/imagefiles/loading7_pink.gif'} width={40} height={40} className="mt"/>
    }
    </>
  );
}


const Model = ({ stakeNft, setStakeNft, setRefresh }) => {
  const [stakingPeriod, setSetakingPeriod] = useState(12)
  const [rewards, setRewards] = useState(null)
  const staking_contract = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI)
  const erc1155 = useContract(ERC1155_ADDRESS, ERC1155_ABI)

  const address = useAddress()

  const getTokenPrice = async() => {
    try {
      let price = await staking_contract?.contract.call("getNFTPurchasingPrice", [stakeNft.id])
      price = ethers.utils.formatEther(price)
      return parseInt(price * 10 ** 18);
    } catch (error) {
      console.log("price", error);
    }
  }

  const getRewards = async() => {
    try {
      let tokenPrice = getTokenPrice()
      let data = await staking_contract.contract.call("calculateRewards", [1,tokenPrice,  stakingPeriod])
      let act = await ethers.utils.formatEther(data[0])
      let usdt = await ethers.utils.formatEther(data[1])
      act = act.includes('.')? `${act.split('.')[0]}.${act.split('.')[1].substr(0,2)}` : act
      setRewards({
        act: act,
        usdt: usdt * 10 ** 12,
      })
    } catch (error) {
     console.log("errrrrr", error); 
    }
  }


  const stake = async () => {
    try {
      const approval = await erc1155?.contract?.call("isApprovedForAll", [address, STAKING_CONTRACT_ADDRESS])
      if(!approval)
        await erc1155?.contract?.call("setApprovalForAll", [STAKING_CONTRACT_ADDRESS, true])

      await staking_contract?.contract?.call("stake", [stakeNft.id, 1, stakingPeriod])
      alert("NFT Staked Successfylly.")
      setStakeNft(false)
      setRefresh(s => !s )
    } catch (error) {
      alert(error)
      console.log("staking err", error);
    }
  }
  
  
  useEffect(()=>{
    setRewards(null)
    if(staking_contract)
      getRewards()
  }, [stakingPeriod, stakeNft])

  useEffect(()=>{
    console.log(typeof(rewards?.act));
  }, [rewards])
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#000000be] z-[999999999999999] " >
        <div className=" mx-auto mt-[100px] rounded-2xl p-5 bg-[#121212] relative w-[50%] md:w-[80%] sm:w-[90%] sm:flex-col sm:mt-[40px]  gap-5 justify-start items-center" style={{display:'flex'}}>
          <h2 className="absolute top-0 right-5 cursor-pointer" onClick={() => setStakeNft(false)}>X</h2>
          <Image src={stakeNft.image} width={300} height={400} className="w-full sm:h-[200px] object-cover"/>

          <div className="flex-col gap-2 w-full" style={{display:"flex"}}>
            <h3 className="text-2xl font-bold">{stakeNft.name}</h3>

              <h4>Stake For</h4>
              <div className="gap-2 w-full" style={{display:"flex"}}>
                <span onClick={()=>{setSetakingPeriod(12)}} className={`justify-center items-center gap-3 ${stakingPeriod == 12 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer`} style={{display:"flex"}}>
                    12 Months
                  </span>
                <span onClick={()=>{setSetakingPeriod(6)}} className={`justify-center items-center gap-3 ${stakingPeriod == 6 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer`} style={{display:"flex"}}>
                    6 Months
                  </span>
                <span onClick={()=>{setSetakingPeriod(3)}} className={`justify-center items-center gap-3 ${stakingPeriod == 3 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer`} style={{display:"flex"}}>
                    3 Months
                  </span>
              </div>

              <div className="flex-col gap-1 mt-6 sm:mt-3" style={{display:"flex"}}>
                <h4>Approximate Reward</h4>
                {rewards? <>
                <div className="justify-between items-center mt-4" style={{display:"flex"}}>
                    <p className="text-sm leading-3">Alpha Tokens</p>
                    <p className="text-sm leading-3">{rewards.act} ACT</p>
                </div>
                <div className="justify-between items-center" style={{display:"flex"}}>
                    <p className="text-sm leading-3">USD Thether</p>
                    <p className="text-sm leading-3">{rewards.usdt} USDT</p>
                </div>
                </>
                :
                <Image src={'https://icon-park.com/imagefiles/loading7_pink.gif'} width={40} height={40} className="mt-2"/>
                }
              </div>

            <button onClick={stake} style={{marginTop:20}}>Stake NFT</button>
    </div>

      </div>
    </div>
  )
}