// import { useAccount } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Card from "./card.js";
import { useAddress } from "@thirdweb-dev/react";

export default function GetNfts(props) {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [nfts, setNfts] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const address = useAddress();
  const chain = "0x89";
  const stakingContractAddres = "0x9f942b5fb2e208b5C2567349742A1B9C80ac97eB";
  console.log("nfts are");
  console.log(nfts);

  useEffect(() => {
    let response;
    async function getData() {
      response = await axios
        .get(`https://backened-asad-ghouri.vercel.app/getnfts`, {
          params: { address, chain },
        })
        .then((response) => {
          setNfts(response.data.result);
          console.log("ids are ");
        });
    }
    getData();
  }, []);

 

  return (
    <>
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
                />
              )
            );
          })}
        </section>
      ) : (
        <h3>You do not have any nft</h3>
      )}
    </>
  );
}
