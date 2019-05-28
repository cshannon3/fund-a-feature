So for any truffle project you first need:
    1. Start Ganache to have a test blockchain running
    2. Connect to metamask so you can interface with the blockchain in the browser

To start the browser side use the cmd
    npm run dev

Then in a different command prompt you want to first migrate your contracts onto the blockchain, this can be done with the cmd:
    truffle.cmd migrate
    **note: you have to migrate the contract every time you change it, after the first time use:
    truffle.cmd migrate --reset


Next go into the truffle console with in with the cmd:
    
    truffle.cmd console

Then, to be able interact with the contract, give yourself a handle to it with: 
    Feature.deployed().then(function(i) { app = i })
    
Then you can interact with the contract inside the truffle console..Examples:

    Add developer
    app.addDeveloper("Gary", 300, { from: web3.eth.accounts[5] } ) 

    Add feature
    app.addFeatureBid(web3.eth.accounts[6], 100, "A cool feature", { from: web3.eth.accounts[5] } )

    give user money
    app.gimmecash(10000, { from: web3.eth.accounts[2] } ) 

    fund a feature
    app.fundFeature("Joe", 0, 50, { from: web3.eth.accounts[2] } ) 

