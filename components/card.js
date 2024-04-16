import { useState } from "react";
import styles from "../styles/Home.module.css";

import { Web3Button } from "@thirdweb-dev/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useContract, useAddress } from "@thirdweb-dev/react";

export default function Card(props) {
  const address = useAddress();

  console.log(
    "in cards in type of staking address is " +
      typeof props.stakingContractAddres +
      " " +
      props.stakingContractAddres +
      "id type is " +
      typeof props.id +
      "id is " +
      props.id
  );

  const stakingContractAddress = "0x9f942b5fb2e208b5C2567349742A1B9C80ac97eB"
  const stakingContractAddres = "0x9f942b5fb2e208b5C2567349742A1B9C80ac97eB"

  const [nft, setNft] = useState(JSON.parse(props.uri.metadata));

  const [nftImage, setNftImage] = useState(() => {
    if (nft?.image) {
      return nft.image.includes("ipfs")
        ? `https://ipfs.io/ipfs/${nft.image.split("ipfs://")[1]}`
        : nft.image.split("\\")[0];
    }
  });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(props.id);
    document.execCommand("copy");

    toast.success(`Text copied: ${props.id}`);
  };

  const nftDropContractAddress = "0xdc91E2fD661E88a9a1bcB1c826B5579232fc9898";
  const { contract, isLoading } = useContract(props.stakingContractAddres);
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  async function stakeNft() {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [[props.id]]);
    window.location.reload();
  }
  return (
    <section className={styles.cardContainer}>
      {nft?.name ? <h1>{nft.name}</h1> : <h1>No NFT title can be shown.</h1>}
      {nftImage ? <img src={nftImage} /> : <p>No NFT image can be shown.</p>}
      {props.id ? (
        <>
        <h3 onClick={handleCopyClick}>id : {props.id}</h3>
        <h3 >Amount : {props.amount}</h3>
        </>
      ) : (
        <p>No id can be shown.</p>
      )}
      <ToastContainer />

      <br />
      <Web3Button
        contractAddress={stakingContractAddres}
        className='custom-class'
        action={() => {
          stakeNft();
        }}
      >
        stake
      </Web3Button>
    </section>
  );
}
