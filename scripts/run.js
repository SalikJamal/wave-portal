const main = async () => {

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther('0.1') })
    await waveContract.deployed()
    
    console.log("Contract deployed to:", waveContract.address)

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance))
    
    // Let's send a wave!
    let waveTxn1 = await waveContract.wave("This is wave #1")
    await waveTxn1.wait() // Wait for the transaction to be mined

    let waveTxn2 = await waveContract.wave("This is wave #2")
    await waveTxn2.wait() // Wait for the transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
    console.log('Contract balance: ', hre.ethers.utils.formatEther(contractBalance))

    let allWaves = await waveContract.getAllWaves()
    console.log(allWaves)

    
}
  

const runMain = async () => {

    try {
        await main()
        process.exit(0) // exit Node process without error
    } catch (e) {
        console.log(e)
        process.exit(1) // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    
}
 

runMain()