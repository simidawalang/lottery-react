import { useEffect, useState } from "react";
import lottery from "./lottery";
import "./App.css";
import web3 from "./web3";

function App() {
  //web3.eth.getAccounts().then(console.log);
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [etherValue, setEtherValue] = useState("");
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getManager = async () => {
      const managerAddress = await lottery.methods.manager().call();
      setManager(managerAddress);
    };
    getManager();
  }, [manager]);

  useEffect(() => {
    const getLotteryPlayers = async () => {
      const playerAddresses = await lottery.methods.getPlayers().call();
      setPlayers(playerAddresses);
    };
    getLotteryPlayers();
  }, []);

  useEffect(() => {
    const getContractBalance = async () => {
      const contractBalance = await web3.eth.getBalance(
        lottery.options.address
      );
      setBalance(contractBalance);
    };
    getContractBalance();
  }, [balance]);

  const handleChange = (e) => {
    const { value } = e.target;
    setEtherValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(etherValue, 'ether')
    });

    setMessage('You have been entered!');
  }

  const handlePickWinner =  async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Picking a winner...');
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('The winner has been picked!')
  }
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This is managed by: {manager}</p>
      <p>
        There are currently {players.length}{" "}
        {players.length === 1 ? "person" : "people"} entered in this lottery.
      </p>
      <p>
        The money to be won is {web3.utils.fromWei(balance, "ether")} ether.
      </p>
      <form onSubmit={handleSubmit}>
        <h4>Want to try? </h4>
        <label htmlFor="ether-value">Amount of ether: </label>
        <input
          id="ether-value"
          type="number"
          onChange={handleChange}
          value={etherValue}
        />
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={handlePickWinner}>Pick Winner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
