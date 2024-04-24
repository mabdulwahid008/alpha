import {
    ConnectWallet,
    useAddress,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { Header } from "../components/Header";
import GetNfts from "../components/getNfts";
import StakedNfts from "../components/StakedNfts";
import StakeCards from "../components/StakeCards";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("polygon", {
    clientId: "3772a2a8dd76298dcd6b0015731299d2",
});

const Stake: NextPage = () => {
    const [refresh, setRefresh] = useState(false)
    const address = useAddress();
    return (
        <>
            <div className={address ? "stake loadingstake" : "stake loadingstake "} style={{display:''}}>
                <Header />
                {/* <div className="justify-between mt-5 w-full px-10" style={{display: 'flex'}}> 
                    <button onClick={()=> window.location.href = 'https://ildattero.com/'} className="bg-gray-800 rounded-md border-none ">
                        Back
                    </button>
                    <ConnectWallet /> 
                </div> */}
                <div
                    className={
                        !address
                            ? "stakeaa loadingstakea"
                              
                            : ""
                    }
                >
                {
                    !address?
                    <div className="containe">
                    <ConnectWallet className="centered-butto" />
                    </div>
                    :
                    ""
                }
                    {address && (
                        <div className={styles.container}>
                    {/* <ConnectWallet />  */}
                            
                            <h1 className={styles.h1}>Stake Your NFTs</h1>
                            <hr className={`${styles.divider} ${styles.spacerTop} my-5`} />

                        
                                <>
                                    <h2>Your Tokens</h2>
                                    <StakeCards sdk={sdk} />
                                    <h2 className="mt-10">Your Staked NFTs</h2>
                                    <StakedNfts sdk={sdk} setRefresh={setRefresh} refresh={refresh}/>

                                    <hr className={`${styles.divider} ${styles.spacerTop} my-5`} />
                                    <h2>Your Unstaked NFTs</h2>
                                     <GetNfts sdk={sdk} setRefresh={setRefresh}  refresh={refresh}/>

                                  
                                </>
                            
                        </div>
                    )}
                    
                </div>
            </div>

        </>
    );
};

export default Stake;