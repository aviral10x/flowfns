import * as fcl from "@onflow/fcl";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useAuth} from "../../contexts/AuthContext";
import {getMyGrantInfos,getFlowBalance} from "../../flow/scripts";
import {initializeAccount} from "../../flow/transactions";
import styles from "../../styles/Manage.module.css";

export default function Home() {
  // Use the AuthContext to track user data
  const { currentUser, isInitialized, checkInit } = useAuth();
  const [grantInfos, setGrantInfos] = useState([]);
  const [bal, setBal] = useState("");


  // Function to initialize the user's account if not already initialized
  async function initialize() {
    try {
      const txId = await initializeAccount();
      await fcl.tx(txId).onceSealed();
      await checkInit();
    } catch (error) {
      console.error(error);
    }
  }

  // Function to fetch the grants owned by the currentUser
  async function fetchMyGrants() {
    try {
      const grants = await getMyGrantInfos(currentUser.addr);
      setGrantInfos(grants);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchBalance() {
    try {
      const balance = await getFlowBalance(currentUser.addr);
setBal(balance);
    } catch (error) {
      console.error(error.message);
    }
  }


  // Load user-owned grants if they are initialized
  // Run if value of `isInitialized` changes
  useEffect(() => {
    if (isInitialized) {
      fetchMyGrants();
    
    }
  }, [isInitialized]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Flow Name Service - Manage</title>
        <meta name="description" content="Flow Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <button onClick={fetchBalance}>FetchBalance{bal ? bal :"bal"}</button>
      <main className={styles.main}>
        <h1>Your Registered Grants</h1>

        {!isInitialized ? (
          <>
            <p>Your account has not been initialized yet</p>
            <button onClick={initialize}>Initialize Account</button>
          </>
        ) : (
          <div className={styles.grantsContainer}>
            {grantInfos.length === 0 ? (
              <p>You have not registered any FNS Grants yet</p>
            ) : (
              grantInfos.map((di, idx) => (
                <Link href={`/manage/${di.nameHash}`}>
                  <div className={styles.grantInfo} key={idx}>
                    <p>
                      {di.id} - {di.name}
                    </p>
                    <p>Owner: {di.owner}</p>
                    <p>Linked Address: {di.address ? di.address : "None"}</p>
                    <p>Bio: {di.bio ? di.bio : "None"}</p>
                  
                    <p>
                      Created At:{" "}
                      {new Date(
                        parseInt(di.createdAt) * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Expires At:{" "}
                      {new Date(
                        parseInt(di.expiresAt) * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}