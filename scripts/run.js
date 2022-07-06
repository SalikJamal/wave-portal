const main = async () => {

    const [owner, randomPerson] = await hre.ethers.getSigners()
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")
    const waveContract = await waveContractFactory.deploy()
    await waveContract.deployed()
    
    console.log("Contract deployed to:", waveContract.address)
    console.log("Contract deployed by:", owner.address)

    let waveCount

    waveCount = await waveContract.getTotalWaves()

    let waveTxn = await waveContract.wave()
    waveTxn = await waveContract.wave()
    await waveTxn.wait()

    waveCount = await waveContract.getTotalWaves()

    waveTxn = await waveContract.connect(randomPerson).wave()
    await waveTxn.wait()

    waveCount = await waveContract.getTotalWaves()

    let maxWaves = await waveContract.getMostWaves()
    console.log(`${maxWaves[0]} has the most waves with ${maxWaves[1]} waves`)

    
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