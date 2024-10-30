import React, { useEffect, useState } from "react";

import { Layout, Row, Col, Button, Spin } from "antd";
import { Network, Provider } from "aptos";


import "./index.css";

export const provider = new Provider(Network.DEVNET);
// change this to be your module account address
export const moduleAddress = "0xe4b58bcc62759559c7a9f4c63a5fa91711b3ff3381db404ca82ea9feb974df06";

function App() {
  const [account, setAccount] = useState(null);
  const [counter, setCounter] = useState(0);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      if (window.aptos) {
        const account = await window.aptos.connect();
        setAccount(account);
      } else {
        alert("Aptos wallet extension is not installed.");
      }
    } catch (error) {
      console.log("Wallet connection failed:", error);
    }
  };

  const fetchCounter = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::counter::Count`,
      );
      let data = JSON.parse(todoListResource?.data.count);
      setCounter(data);
    } catch (e) {
      if (e.message.includes("resource_not_found")) {
        // Initialize the counter if the resource is not found
        await createCounter();
      } else {
        console.error("Unexpected error fetching counter:", e);
      }
    }
  };
  

  const createCounter = async () => {
    if (!account) return;
    setTransactionInProgress(true);
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::counter::create_counter`,
      arguments: [],
    };
    try {
      const response = await window.aptos.signAndSubmitTransaction({payload});
      await provider.waitForTransaction(response.hash);
      fetchCounter();
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };


  const increaseCounter = async () => {
    try {
      setTransactionInProgress(true);
      const payload = {
        data: {
          function: `${moduleAddress}::increase::raise_c`,
          functionArguments: [],
        },
      };
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error) {
      console.error("Error raising counter:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };
  
  const decreaseCounter = async () => {
    try {
      setTransactionInProgress(true);
      const payload = {
        data: {
          function: `${moduleAddress}::increase::decrement_c`,
          functionArguments: [],
        },
      };
      const response = await signAndSubmitTransaction({payload});
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error) {
      console.error("Error decrementing counter:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };
  
  // const increaseCounter = async () => {
  //   setTransactionInProgress(true);
  //   const payload = {
  //     type: "entry_function_payload",
  //     function: `${moduleAddress}::counter::increase_c`,
  //     arguments: [],
  //   };
  //   try {
  //     const response = await window.aptos.signAndSubmitTransaction({payload});
  //     await provider.waitForTransaction(response.hash);
  //     fetchCounter();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  // const decreaseCounter = async () => {
  //   setTransactionInProgress(true);
  //   const payload = {
  //     type: "entry_function_payload",
  //     function: `${moduleAddress}::counter::decrease_c`,
  //     arguments: [],
  //   };
  //   try {
  //     const response = await window.aptos.signAndSubmitTransaction({payload});
  //     await provider.waitForTransaction(response.hash);
  //     fetchCounter();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  // Fetch counter on account change
  useEffect(() => {
    fetchCounter();
  }, [account?.address]);

  return (
    <div className="container mx-auto flex justify-center items-center h-[100vh] flex-col">
      <h1 className="text-5xl font-extrabold mb-20 text-center">Counter</h1>
      <Col style={{ textAlign: "right", margin: "10px" }}>
        <Button onClick={connectWallet}>
          {account ? `Connected: ${account.address.slice(0, 6)}...` : "Connect Wallet"}
        </Button>
      </Col>
      <div className="w-[50%] flex justify-between mt-3">
        <div>
          <div className="group relative">
            
        <div>
          <h1 className="counter text-8xl font-extrabold -mt-6">{counter || 0}</h1>
        </div>
        <div className="btn-con">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
            <button
              className="relative rounded-lg bg-black px-7 py-4 text-white"
              onClick={increaseCounter}
              disabled={transactionInProgress}
            >
              Increase By One
            </button>
        
      


        <div>
          <div className="group relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
            <button
              className="relative rounded-lg bg-black px-7 py-4 text-white"
              onClick={decreaseCounter}
              disabled={transactionInProgress}
            >
              Decrease By One
            </button>
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
