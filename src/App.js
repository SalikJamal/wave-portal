import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import contractABI from './artifacts/src/contracts/WavePortal.sol/WavePortal.json'


const App = () => {

    const [account, setAccount] = useState('')

    const wavePortalContractAddress = process.env.REACT_APP_WAVE_PORTAL_CONTRACT_ADDRESS

    const wave = async () => {
        try {
            const { ethereum } = window

            if(ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const wavePortalContract = new ethers.Contract(wavePortalContractAddress, contractABI.abi, signer)

                let count = await wavePortalContract.getTotalWaves()
                console.log('Retrieved total wave count: ', count.toNumber())

                const waveTxn = await wavePortalContract.wave()
                console.log('Mining... ', waveTxn.hash)

                await waveTxn.wait()
                console.log('Mined -- ', waveTxn.hash)

                count = await wavePortalContract.getTotalWaves()
                console.log('Retrieved total wave count: ', count.toNumber())

            
            } else {
                console.log('Ethereum object doesn\'t exist')
            }

        } catch(e) {
            console.log(e)
        }
    }

    const checkIfWalletIsConnected = async () => {

        try {

            const { ethereum } = window;

            if(!ethereum) {
                console.log('Make sure you have metamask!')
            } else {
                console.log('We have the ethereum provider', ethereum)
            }

            // const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            // if(accounts.length !== 0) {
            //     setAccount(accounts[0])
            //     console.log('Found an authorized account: ', accounts[0])
            // } else {
            //     console.log('No authorized account found')
            // }

        } catch(e) {
            console.log(e)
        }
    }

    const connectWallet = async () => {

        try {
            const { ethereum } = window

            if(!ethereum) {
                alert('Get Metamask!')
                return
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            console.log("Connected", accounts[0])
            setAccount(accounts[0])

        } catch(e) {
            console.log(e)
        }

    }


    useEffect(() => {
        checkIfWalletIsConnected()
    })

    return (
        <div className='mainContainer'>

            <div className='dataContainer'>
                <div className='header'>👋 Hey there!</div>
                <div className='bio'>
                    <p>I'm Salik, and I like to code, and help people! Connect your Ethereum wallet and wave at me!</p>
                </div>
                <button className='waveButton' onClick={wave}>Wave at Me</button>

                {!account && (
                    <button className='waveButton' onClick={connectWallet}>Connect Wallet</button>
                )}
            </div>

        </div>
    )

}


export default App