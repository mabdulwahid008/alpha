import React from 'react'
import styles from "../styles/Home.module.css";

function StakePopup({ stakeNft, setStakeNft }) {

    const staking_contract = useContract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI)
  
    useEffect(()=>{
      console.log("staking ", staking_contract?.contract);
    }, [staking_contract])

  return (
    <div className={styles.popup_bg} >
      <div className={styles.popup}>
        <h1 style={{ position: 'absolute', right: 20, top: 0 }} onClick={() => setStakeNft(false)}>X</h1>
        <Image src={stakeNft.image} width={200} height={300} />
        <div className={styles.popup_right}>
          <h3>{stakeNft.name}</h3>

          <h4>Stake for</h4>
          <div className={styles.stake_periods}>
              <span>
                  <input type="radio"/>
                  12 months
              </span>
              <button className={styles.stake_btn}>
                12 months
              </button>
              <button className={styles.stake_btn}>
                6 months
              </button>
              <button className={styles.stake_btn}>
                3 months
              </button>
          </div>

          <button style={{marginTop:20}}>Stake NFT</button>
        </div>
      </div>
    </div>
  )
}

export default StakePopup
