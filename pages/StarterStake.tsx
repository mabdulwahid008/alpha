import {
    ConnectWallet,
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";

import styles from "../styles/Home.module.css";
import { Header } from "../components/Header";
import LoggedIn from "../components/loggedIn";
import GetNfts from "../components/getNfts";
import StakedNfts from "../components/StakedNfts";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("mumbai", {
    clientId: "b811b882dc25f4433d4e7c259175ebef",
  });


import ClaimableRewards from "../components/ClaimableRewards" 
const Stake: NextPage = () => {

    // const { contract } = useContract(ERC1155_ADDRESS, ERC1155_ABI)
    

    // const tokenContractAddress = "0x370806781689E670f85311700445449aC7C3Ff7a";

    const address = useAddress();

    // const { contract: tokenContract } = useContract(tokenContractAddress,"token");
    // const { data: tokenBalance, isLoading: tisLoading } = useTokenBalance(tokenContract, address);


    useEffect(()=>{
  
        
    }, [])

    return (
        <>
            <div className={address ? "stake loadingstake" : "stake loadingstake "} style={{display:''}}>

                <Header />
                <div
                    className={
                        !address
                            ? "stakeaa loadingstakea"

                            : ""
                    }
                >

                    {!address ? (

                        <div className="connect"> <ConnectWallet /> </div>
                        // undefined
                    ) : (
                        <div className={styles.container}>
                            <h1 className={styles.h1}>Stake Your NFTs</h1>
                            <hr className={`${styles.divider} ${styles.spacerTop} my-5`} />

                            {!address ? (
                                <ConnectWallet />
                            ) : (
                                <>
                                    <h2>Your Tokens</h2>
                                    <div className={styles.tokenGrid}>
                                        <div className={styles.tokenItem}>
                                            <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                                            <p className={styles.tokenValue}>
                                               {/* <ClaimableRewards stakingAddress={STAKING_CONTRACT_ADDRESS} tokenId={0}/> */}
                                                {/* {tokenBalance?.symbol} */}
                                            </p>
                                        </div>
                                        <div className={styles.tokenItem}>
                                            <h3 className={styles.tokenLabel}>Current Balance</h3>
                                            <p className={styles.tokenValue}>
                                                {/* <b>{tisLoading ? "Loading..." : tokenBalance?.displayValue}</b> {tokenBalance?.symbol} */}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <Web3Button
                                        action={(contract) => contract.call("claimRewards")}
                                        contractAddress={stakingContractAddress}
                                    >
                                        Claim Rewards
                                    </Web3Button> */}
                                    {/* <hr className={`${styles.divider} ${styles.spacerTop} my-5`} /> */}
                                    <h2 className="mt-10">Your Staked NFTs</h2>
                                    <StakedNfts sdk={sdk}/>

                                    <hr className={`${styles.divider} ${styles.spacerTop} my-5`} />
                                    <h2>Your Unstaked NFTs</h2>
                                     <GetNfts sdk={sdk}/>

                                    {/* {
                                        stisLoading ?
                                            "Loading..." :
                                            tisLoading ?
                                                "Loading..."
                                                :
                                                <div className={styles.nftBoxGrid}>
                                                    {stakedTokens &&
                                                        stakedTokens[0]?.map((stakedToken: BigNumber) => (
                                                            <NFTCard
                                                                tokenId={stakedToken.toNumber()}
                                                                stakingContractAddresss={stakingContractAddress}
                                                                key={stakedToken.toString()}
                                                            />
                                                        ))}
                                                </div>
                                    } */}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default Stake;


