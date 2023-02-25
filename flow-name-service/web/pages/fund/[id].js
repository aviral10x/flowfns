import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as fcl from "@onflow/fcl";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import { getDomainInfoByNameHash, getRentCost } from "../../flow/scripts";
import styles from "../../styles/Fund.module.css";
import { getAllDomainInfos } from "../../flow/scripts";

import {
  renewDomain,
  updateAddressForDomain,
  updateBioForDomain,
} from "../../flow/transactions";

// constant representing seconds per year
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

export default function Fund() {
  // Use AuthContext to gather data for current user
  const { currentUser, isInitialized } = useAuth();
  const [domainInfos, setDomainInfos] = useState([]);

  // Next Router to get access to `nameHash` query parameter
  const router = useRouter();
  // State variable to store the DomainInfo
  const [domainInfo, setDomainInfo] = useState();
  // State variable to store the bio given by user
  const [bio, setBio] = useState("");
  // State variable to store the address given by user
  const [linkedAddr, setLinkedAddr] = useState("");
  // State variable to store how many years to renew for
  const [renewFor, setRenewFor] = useState(1);
  // Loading state
  const [loading, setLoading] = useState(false);
  // State variable to store cost of renewal
  const [cost, setCost] = useState(0.0);
  const [years, setYears] = useState("");


    
  // Function to load the domain info
  async function loadDomainInfo() {
    try {
      const info = await getDomainInfoByNameHash(
        domainInfo.owner,
        router.query.nameHash
      );
      console.log(info);
      setDomainInfo(info);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchDomains() {
      const domains = await getAllDomainInfos();
      setDomainInfos(domains);
    }

    fetchDomains();
  }, []);

  






  // Load domain info if user is initialized and page is loaded
  useEffect(() => {
    if (router && router.query ) {
      loadDomainInfo();
    }
  }, [router]);





  return (
    <div className={styles.container}>
      <Head>
        <title>Flow Name Service - Manage Domain</title>
        <meta name="description" content="Flow Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <div>
          <h1>{domainInfo.name}</h1>
          <p>ID: {domainInfo.id}</p>
          <p>Owner: {domainInfo.owner}</p>
          <p>
            Created At:{" "}
            {new Date(
              parseInt(domainInfo.createdAt) * 1000
            ).toLocaleDateString()}
          </p>
          <p>
            Expires At:{" "}
            {new Date(
              parseInt(domainInfo.expiresAt) * 1000
            ).toLocaleDateString()}
          </p>
          <hr />
          <p>Bio: {domainInfo.bio ? domainInfo.bio : "Not Set"}</p>
          <p>Address: {domainInfo.address ? domainInfo.address : "Not Set"}</p>
        </div>

        <div>
          <h1>Update</h1>
          <div className={styles.inputGroup}>
            <span>Update Bio: </span>
            <input
              type="text"
              placeholder="Lorem ipsum..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
      
          </div>

          <br />

 <div className={styles.inputGroup}>
            <span>Fund: </span>
            <input
              type="number"
              placeholder="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
            <span>years</span>
          </div> 
          {/* <div className={styles.inputGroup}>
            <span>Update Address: </span>
            <input
              type="text"
              placeholder="0xabcdefgh"
              value={linkedAddr}
              onChange={(e) => setLinkedAddr(e.target.value)}
            />
            <button onClick={updateAddress} disabled={loading}>
              Update
            </button>
          </div> */}

          {/* <h1>Renew</h1>
          <div className={styles.inputGroup}>
            <input
              type="number"
              placeholder="1"
              value={renewFor}
              onChange={(e) => setRenewFor(e.target.value)}
            />
            <span> years</span>
            <button onClick={renew} disabled={loading}>
              Renew Domain
            </button>
          </div>
          <p>Cost: {cost} FLOW</p>
          {loading && <p>Loading...</p>} */}
        </div>
      </main>
    </div>
  );
}
