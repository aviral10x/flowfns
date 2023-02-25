import * as fcl from "@onflow/fcl";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import {useAuth} from "../../contexts/AuthContext";
import {getMyDomainInfos} from "../../flow/scripts";
import {initializeAccount} from "../../flow/transactions";
import styles from "../../styles/Manage.module.css";
import { getAllDomainInfos } from "../../flow/scripts";


export default function Home() {
  // Use the AuthContext to track user data
  const { currentUser } = useAuth();
  const [domainInfos, setDomainInfos] = useState([]);
  const { isInitialized, checkInit } = useAuth();
  // State Variable to keep track of the domain name the user wants
  const [name, setName] = useState("");
  // State variable to keep track of how many years 
  // the user wants to rent the domain for
  const [years, setYears] = useState(1);
  // State variable to keep track of the cost of this purchase
  const [cost, setCost] = useState(0.0);
  // Loading state
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");

  const [bio, setBio] = useState("");

  const [domainInfo, setDomainInfo] = useState();



  async function fund() {
    try {
      setLoading(true);

      const txId = await registerDomain(name, duration);
      await fcl.tx(txId).onceSealed();

 
        // const timer =  setTimeout(async() => {
        //     const txId1 = await updateBioForDomain(router.query.nameHash, bio);
        //     await fcl.tx(txId1).onceSealed();
        //     await loadDomainInfo();
        // }, 5000);
        // return () => clearTimeout(timer);
      

     

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    async function fetchDomains() {
      const domains = await getAllDomainInfos();
      setDomainInfos(domains);
    }

    fetchDomains();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Flow Name Service - Manage</title>
        <meta name="description" content="Flow Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <h1>Your Registered Domains</h1>

        {
          <div className={styles.domainsContainer}>
            {
              domainInfos.map((di, idx) => (
                   
                  <div className={styles.domainInfo} key={idx}>
                <Link href={`/fund/${di.id}`}>

                    <p>
                      {di.id} - {di.name}
                    </p>
                </Link>
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
                    <button  >Fund </button>

                  </div>
              ))
            }
          </div>
        }
      </main>
    </div>
  );
}