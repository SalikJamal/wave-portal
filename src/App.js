import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import wavePortalABI from './utils/WavePortal.json'
import moment from 'moment'


const App = () => {

    const [account, setAccount] = useState('')
    const [allWaves, setAllWaves] = useState([])

    const wavePortalContractAddress = process.env.REACT_APP_WAVE_PORTAL_CONTRACT_ADDRESS

    const wave = async (message) => {

        try {
            const { ethereum } = window

            if(ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const wavePortalContract = new ethers.Contract(wavePortalContractAddress, wavePortalABI.abi, signer)

                let count = await wavePortalContract.getTotalWaves()
                console.log('Retrieved total wave count: ', count.toNumber())

                const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 })
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

            await getAllWaves()

        } catch(e) {
            console.log(e)
        }

    }

    const getAllWaves = async () => {

        try {   

            const { ethereum } = window

            if(ethereum) {
                
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const wavePortalContract = new ethers.Contract(wavePortalContractAddress, wavePortalABI.abi, signer)

                const waves = await wavePortalContract.getAllWaves()

                const wavesCleaned = waves.map(wave => {
                    return {
                        address: wave.waver,
                        timestamp: wave.timestamp.toNumber(),
                        message: wave.message
                    }
                })

                setAllWaves(wavesCleaned)

            } else {
                console.log('Ethereum object doesn\'t exist')
            }

        } catch(e) {
            console.log(e)
        }

    }


    useEffect(() => {

        let wavePortalContract

        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message)

            setAllWaves(prevState => [...prevState, {
                address: from,
                message: message,
                timestamp: new Date(timestamp * 1000)
            }])
        }

        if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
        
            wavePortalContract = new ethers.Contract(wavePortalContractAddress, wavePortalABI.abi, signer)
            wavePortalContract.on("NewWave", onNewWave)
        }

        return () => {
            if(wavePortalContract) wavePortalContract.off("NewWave", onNewWave)
        }

      }, [wavePortalContractAddress])

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
                <button className='waveButton' onClick={() => wave("My name is Salik")}>Wave at Me</button>

                {!account && (
                    <button className='waveButton' onClick={connectWallet}>Connect Wallet</button>
                )}
                
                {allWaves.map((wave, index) => {
                    return (
                        <div key={index} style={{ backgroundColor: "#252525", marginTop: "16px", padding: "8px" }}>
                            <div>Address: {wave.address}</div>
                            <div>Time: {moment.unix(wave.timestamp).format('LLL')}</div>
                            <div>Message: {wave.message}</div>
                        </div>
                    )
                })}
            </div>

        </div>
    )

}


export default App