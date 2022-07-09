const main = async () => {

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal")
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther('0.001') })
    await waveContract.deployed()

    console.log('Wave contract deployed to:', waveContract.address)

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