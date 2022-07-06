import React from 'react'
import { ethers } from 'ethers'
import './App.css'


const App = () => {

    const wave = () => {

    }

    return (
        <div className='mainContainer'>

            <div className='dataContainer'>
                <div className='header'>👋 Hey there!</div>
                <div className='bio'>
                    <p>I'm Salik, and I like to code, and help people! Connect your Ethereum wallet and wave at me!</p>
                </div>
                <button className='waveButton' onClick={wave}>Wave at Me</button>
            </div>

        </div>
    )

}


export default App