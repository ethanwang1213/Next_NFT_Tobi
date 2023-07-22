import { NextPage } from "next";
import { ethers } from "ethers";
import * as fcl from "@blocto/fcl";
import * as t from "@onflow/types";
import { useEffect, useState } from "react";
import { functions } from "@/firebase/client";
import { httpsCallable } from "@firebase/functions";

type Item = {
  name: string;
  price: string;
  quantity: number;
};

type PaymentOrder = {
  name: string;
  email: string;
  status: string;
  total_price: string;
  items: Array<Item>;
};
/**
 * 支払いページサンプル
 * @returns
 */
const Payment: NextPage = () => {
  const [payments, setPayments] = useState<PaymentOrder[]>([]);

  useEffect(() => {
    console.log("getPayments");
    const callable = httpsCallable<{}, PaymentOrder[]>(
      functions,
      "journalNfts-getPayments"
    );
    callable()
      .then((result) => {
        setPayments(
          result.data.map((payment) => {
            return payment;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUSDCPayment = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask is not installed");
      return;
    }
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }], // goerli testnet
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                rpcUrl: "https://goerli.infura.io/v3/",
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // USDC contract address and ABI
      const usdcAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; // Replace with the actual USDC contract address
      const usdcABI = ["function transfer(address to, uint256 amount)"];

      // Connect to the USDC contract
      const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);

      // Recipient address and payment amount
      const recipientAddress = "0x2C1dE53e09493dd3d44ba531b67C65f8BdfF2a48"; // Replace with the recipient's Ethereum address
      const paymentAmount = ethers.utils.parseUnits("10", 6); // 100 USDC with 6 decimals

      // Transfer USDC to the recipient
      const tx = await usdcContract.transfer(recipientAddress, paymentAmount);

      // Wait for the transaction to be mined
      await tx.wait();

      console.log("Payment successful with USDC!");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };
  const sendTransaction = async (transaction, args) => {
    const response = await fcl.send([
      fcl.transaction(transaction),
      fcl.args(args),
      fcl.proposer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.payer(fcl.currentUser().authorization),
      fcl.limit(9999),
    ]);
    return response;
  };
  const handleFLOWPayment = async () => {
    console.log("handleFLOWPayment");
    try {
      fcl
        .config()
        .put("accessNode.api", "https://access-testnet.onflow.org") // connect to Flow testnet
        .put(
          "challenge.handshake",
          "https://flow-wallet-testnet.blocto.app/authn"
        ); // use Blocto testnet wallet

      fcl.currentUser().subscribe(console.log); // fires everytime account connection status updates

      // authenticate
      fcl.authenticate();

      const transactionId = await sendTransaction(
        `
      import FungibleToken from 0x9a0766d93b6608b7
      transaction(amount: UFix64, to: Address) {
        let vault: @FungibleToken.Vault
        prepare(signer: AuthAccount) {
        self.vault <- signer
          .borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
          .withdraw(amount: amount)
        }
        execute {
          getAccount(to)
            .getCapability(/public/flowTokenReceiver)!
            .borrow<&{FungibleToken.Receiver}>()!
            .deposit(from: <-self.vault)
        }
      }
      `,
        [fcl.arg("10.0", t.UFix64), fcl.arg("0x5e9ccdb91ff7ad93", t.Address)]
      );

      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Payment successful with FLOW!");
      console.log(transaction); // The transactions status and events after being sealed
    } catch (error) {
      console.error("flow connect failed:", error);
    }
  };
  return (
    <div className="h-[90vh]">
      <h1>Payment Page</h1>
      <table>
        <thead>
          <tr>
            <th>注文ID</th>
            <th>金額</th>
            <th>内容</th>
            <th>支払い</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.total_price}</td>
              <td>{JSON.stringify(p.items)}</td>
              <td>
                <div>
                  <button onClick={handleFLOWPayment}>FLOW で支払い</button>
                </div>
                <div>
                  <button onClick={handleUSDCPayment}>USDC で支払い</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payment;
