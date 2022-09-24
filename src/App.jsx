import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './styles/App.css'
import wavePortalABI from './utils/WavePortal.json'
import moment from 'moment'
import { CircularProgress } from '@mui/material'
import LinkedInLogo from './assets/linkedin-logo.png'



// Constants
const GOERLI_CHAINID = '0x5'
const LINKEDIN_LINK = 'https://www.linkedin.com/in/salik-jamal/'

const App = () => {

    const [account, setAccount] = useState('')
    const [currentChainId, setCurrentChainId] = useState('')
    const [allWaves, setAllWaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [waveMsg, setWaveMsg] = useState('')
    const [waveMsgError, setWaveMsgError] = useState(false)

    const { ethereum } = window

    const wave = async () => {

        setWaveMsgError(false)

        if(currentChainId !== GOERLI_CHAINID) {
            alert("Please switch to Goerli Test Network")
            return
        }

        if(waveMsg === '') {
            setWaveMsgError(true)
            return
        }

        setLoading(true)

        try {

            if(ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const wavePortalContract = new ethers.Contract(process.env.REACT_APP_WAVE_PORTAL_CONTRACT_ADDRESS, wavePortalABI.abi, signer)
                
                const waveTxn = await wavePortalContract.wave(waveMsg, { gasLimit: 300000  })

                await waveTxn.wait()
                await getAllWaves()
            
            } else {
                console.log('Ethereum object doesn\'t exist')
            }

        } catch(e) {
            console.log(e)
        }
        setLoading(false)
    }

    const checkIfWalletIsConnected = async () => {

        if(!ethereum) {
            alert('Make sure you have metamask!')
            return
        }

        ethereum.on('chainChanged', chainId => {
            setCurrentChainId(chainId)
            window.location.reload()
        })

        const accounts = await ethereum.request({ method: 'eth_accounts' })
        const chainId = await ethereum.request({ method: 'eth_chainId'})
        setCurrentChainId(chainId)

        if(accounts.length !== 0) {
            const account = accounts[0]
            setAccount(account)
        } else {
            console.log("No authorized account found")
        }

    }

    const connectWallet = async () => {

        try {

            if(!ethereum) {
                alert('Get Metamask!')
                return
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setAccount(accounts[0])

        } catch(e) {
            console.log(e)
        }

    }

    const getAllWaves = async () => {

        try {   

            if(ethereum) {
                
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const wavePortalContract = new ethers.Contract(process.env.REACT_APP_WAVE_PORTAL_CONTRACT_ADDRESS, wavePortalABI.abi, signer)

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
        setLoading(false)

    }

    const renderNotConnectedBtn = () => (
        <button className='waveButton' onClick={connectWallet}>Connect Wallet</button>
    )

    const renderWaveBtn = () => {
        if(loading) {
            renderLoading()
        } else {
            return (
                <button className='waveButton' onClick={wave}>Wave At Me</button>
            )
        }
    }

    const renderLoading = () => (
        <div className='loading'>
            <CircularProgress />
        </div>
    )

    useEffect(() => {
        checkIfWalletIsConnected()
        getAllWaves()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='mainContainer'>
                <div className='dataContainer'>
                    <div className='header'>👋 Hey there!</div>
                    <div className='bio'>
                        <p>I'm Salik Jamal, I like to code and make cool Dapps. Connect your Ethereum wallet and wave at me.</p>
                        <p>You might have a shot at winning some Eth!</p>
                    </div>
                    <textarea className='messageBox' rows='10' cols='50' value={waveMsg} onChange={e => setWaveMsg(e.target.value)}></textarea>
                    
                    <div className='waveBtns'>
                        {loading ? renderLoading() : (account === '' ? renderNotConnectedBtn() : renderWaveBtn())}
                    </div>

                    {waveMsgError && <div className='wave-error'>There's nothing to wave!</div>}

                    {allWaves.map((wave, index) => {
                        return (
                            <div key={index} style={{ marginTop: 16, padding: 8, border: '5px dotted white' }}>
                                <div>Address: {wave.address}</div>
                                <div>Time: {moment.unix(wave.timestamp).format('LLL')}</div>
                                <div>Message: {wave.message}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='footer-container'>
                <img className='linkedin-logo' alt='LinkedIn Logo' src={LinkedInLogo} />
                <a className='footer-text' href={LINKEDIN_LINK} target='_blank' rel='noreferrer'>Built By Salik Jamal</a>
            </div>
        </>
    )

}


export default App