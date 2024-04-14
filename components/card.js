
import styles from "../styles/Home.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Card({nft, setStakeNft}) {
 

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

      <button onClick={()=>{setStakeNft(nft)}} className="stakebtn">Stake</button>
    </section>
  );
}


