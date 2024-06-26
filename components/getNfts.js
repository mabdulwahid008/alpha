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

  const stakingContractAddres = "0x9f942b5fb2e208b5C2567349742A1B9C80ac97eB"
  useEffect(() => {
    let response;
    async function getData() {
  const chain = "0x89";

      response = await axios
        .get(`https://backened-asad-ghouri.vercel.app/getnfts`, {
          params: { address, chain },
        })
        .then((response) => {
          console.log("nfts are");
          console.log(response.data.result);
          setNfts(response.data.result);

          
        });
    }
    getData();
  }, []);

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
      if(tokenBalance > 0){

        let nftMetadat = {
          name:res.name,
          balance: tokenBalance,
          image: `https://ipfs.io/ipfs/${res.image.replace('ipfs://', '')}`,
          id: id
        }

        return nftMetadat
        // if (!nfts) {
        //   setNfts([nftMetadat]);
        // } else {
        //   setNfts(nfts.push(nftMetadat));
        // }
      }
      else{
        return null
      }
    }
    else{
      return null
    }
  }

 
  return (
    <>
   {nfts? <>
      {nfts.length > 0 ? (
        <section className={styles.dataContainer}>
                   {nfts.map((nft) => {
                    return (
                    nft.symbol === "ANT" && (
                        <Card
                          uri={nft}
                          id={nft.token_id}
                          key={nft.token_uri}
                          stakingContractAddres={stakingContractAddres}
                          amount={nft.amount}
                          setStakeNft={setStakeNft}
                        />
                      )
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

  const [loading, setloading] = useState(false)

  const address = useAddress()

  const getTokenPrice = async() => {
    try {
      let price = await staking_contract?.contract.call("getNFTPurchasingPrice", [stakeNft.token_id])
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
      setloading(true)
      const approval = await erc1155?.contract?.call("isApprovedForAll", [address, STAKING_CONTRACT_ADDRESS])
      if(!approval)
        await erc1155?.contract?.call("setApprovalForAll", [STAKING_CONTRACT_ADDRESS, true])

      await staking_contract?.contract?.call("stake", [stakeNft.token_id, 1, stakingPeriod])
      alert("NFT Staked Successfylly.")
      setStakeNft(false)
      setloading(false)
      setRefresh(s => !s )
    } catch (error) {
      alert(error)
      setloading(false)
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
        <div className=" mx-auto mt-[100px] rounded-2xl p-5 bg-[#121212] relative w-[50%] md:w-[80%] sm:w-[90%] sm:flex-col sm:mt-[40px]  gap-5 justify-start items-center w30 zid" style={{display:'flex'}}>
          <h2 className="absolute top-0 right-5 cursor-pointer xcros" onClick={() => setStakeNft(false)}>X</h2>
          
          {stakeNft.token_id==0?<img src="https://i.seadn.io/s/raw/files/bd9d3c055236c1527fb65764d9fd892a.png?auto=format&dpr=1&w=640" width={300} height={400} className="w-full sm:h-[200px] object-cover"/>:""}
          {stakeNft.token_id==1?<img src="https://i.seadn.io/s/raw/files/d12b0f36b43032d668e1b954dca4f4c6.png?auto=format&dpr=1&w=640" width={300} height={400} className="w-full sm:h-[200px] object-cover"/>:""}
          {stakeNft.token_id==2?<img src="https://i.seadn.io/s/raw/files/eed92a5d395f1c7e785b0bd19ee52797.png?auto=format&dpr=1&w=640" width={300} height={400} className="w-full sm:h-[200px] object-cover"/>:""}
          {stakeNft.token_id==3?<img src="https://i.seadn.io/s/raw/files/c0c2e1520cedca641c00ef0a1725c325.png?auto=format&dpr=1&w=640" width={300} height={400} className="w-full sm:h-[200px] object-cover"/>:""}


          <div className="flex-col gap-2 w-full" style={{display:"flex"}}>
            <h3 className="text-2xl font-bold">{stakeNft.name}</h3>

              <h4>Stake For</h4>
              <div className="gap-2 w-full" style={{display:"flex"}}>
                <span onClick={()=>{setSetakingPeriod(12)}} className={`justify-center items-center gap-3 ${stakingPeriod == 12 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer zb`} style={{display:"flex"}}>
                    12 Months
                  </span>
                <span onClick={()=>{setSetakingPeriod(6)}} className={`justify-center items-center gap-3 ${stakingPeriod == 6 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer zb`} style={{display:"flex"}}>
                    6 Months
                  </span>
                <span onClick={()=>{setSetakingPeriod(3)}} className={`justify-center items-center gap-3 ${stakingPeriod == 3 ? 'bg-pink-400': 'bg-black'} p-2 flex-1 rounded-md cursor-pointer zb`} style={{display:"flex"}}>
                    3 Months
                  </span>
              </div>

              <div className="flex-col gap-1 mt-6 sm:mt-3" style={{display:"flex"}}>
                <h4>Approximate Reward</h4>
                {/* {rewards? <>
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
                } */}
                {stakingPeriod==3?
                 <>
                 <div className="justify-between items-center mt-4" style={{display:"flex"}}>
                     <p className="text-sm leading-3">Alpha Tokens</p>
                     <p className="text-sm leading-3">16350.0 ACT</p>
                 </div>
                 <div className="justify-between items-center" style={{display:"flex"}}>
                     <p className="text-sm leading-3">USD Thether</p>
                     <p className="text-sm leading-3">32.7 USDT</p>
                 </div>
                 </>
                 :
                 ""
                }
                {stakingPeriod==6?
                 <>
                 <div className="justify-between items-center mt-4" style={{display:"flex"}}>
                     <p className="text-sm leading-3">Alpha Tokens</p>
                     <p className="text-sm leading-3">65400.0 ACT</p>
                 </div>
                 <div className="justify-between items-center" style={{display:"flex"}}>
                     <p className="text-sm leading-3">USD Thether</p>
                     <p className="text-sm leading-3">65.4 USDT</p>
                 </div>
                 </>
                 :
                 ""
                }
                {stakingPeriod==12?
                 <>
                 <div className="justify-between items-center mt-4" style={{display:"flex"}}>
                     <p className="text-sm leading-3">Alpha Tokens</p>
                     <p className="text-sm leading-3">130800.0 ACT</p>
                 </div>
                 <div className="justify-between items-center" style={{display:"flex"}}>
                     <p className="text-sm leading-3">USD Thether</p>
                     <p className="text-sm leading-3">130.8 USDT</p>
                 </div>
                 </>
                 :
                 ""
                }
              </div>

            <button onClick={stake} className="zb" style={{marginTop:20}}>{loading?"Loading...":"Stake NFT"}</button>
    </div>

      </div>
    </div>
  )
}