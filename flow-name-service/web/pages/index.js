import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllGrantInfos } from "../flow/scripts";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Create a state variable for all the GrantInfo structs
  // Initialize it to an empty array
  const [grantInfos, setGrantInfos] = useState([]);

  // Load all the GrantInfo's by running the Cadence script
  // when the page is loaded
  useEffect(() => {
    async function fetchGrants() {
      const grants = await getAllGrantInfos();
      setGrantInfos(grants);
    }

    fetchGrants();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Raise</title>
        <meta name="description" content="Raise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <h1>All Registered Grants</h1>

        <div className={styles.grantsContainer}>
          {
            // If no grants were found, display a message highlighting that
            grantInfos.length === 0 ? (
            <p>No Grants have been registered yet</p>
          ) : (
            // Otherwise, loop over the array, and render information
            // about each grant
            grantInfos.map((di, idx) => (

              <div className={styles.grantInfo} key={idx}>
                {/* <Image src={di.bio} width="20" height="20" /> */}
                <p>
                  {di.id} - {di.name} - {di.nameHash}
                </p>
                <p>Owner: {di.owner}</p>
                <p>Linked Address: {di.address ? di.address : "None"}</p>
                <p>Bio: {di.bio ? di.bio : "None"}</p>
                {/* <!-- Parse the timestamps as human-readable dates --> */}
                <p>
                  Created At:{" "}
                  {new Date(parseInt(di.createdAt) * 1000).toLocaleDateString()}
                </p>
                <p>
                  Expires At:{" "}
                  {new Date(parseInt(di.expiresAt) * 1000).toLocaleDateString()}
                </p>
              </div>

            ))
          )}
        </div>
      </main>
    </div>
  );
}