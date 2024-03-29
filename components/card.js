import { useState } from "react";
import styles from "../styles/Home.module.css";

import { Web3Button } from "@thirdweb-dev/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useContract, useAddress } from "@thirdweb-dev/react";

export default function Card({nft, setStakeNft}) {
  // const address = useAddress();



  // const stakingContractAddress = props.stakingContractAddres;

 



  // const nftDropContractAddress = "0xdc91E2fD661E88a9a1bcB1c826B5579232fc9898";
  // const { contract, isLoading } = useContract(props.stakingContractAddres);
  // const { contract: nftDropContract } = useContract(
  //   nftDropContractAddress,
  //   "nft-drop"
  // );

  return (
    <section className={styles.cardContainer}>
      {nft?.name ? <h1>{nft.name}</h1> : <h1>No NFT title can be shown.</h1>}
      {nft.image ? <img src={nft.image} /> : <p>No NFT image can be shown.</p>}
      {nft.id ? (
        <h3 >id is : {nft.id}</h3>
      ) : (
        <p>No id can be shown.</p>
      )}
      <ToastContainer />

      <br />
      {/* <Web3Button
        contractAddress={props.stakingContractAddres}
        action={() => {
          stakeNft();
        }}
      >
        stake
      </Web3Button> */}

      <button onClick={()=>{setStakeNft(nft)}}>Stake</button>
    </section>
  );
}


