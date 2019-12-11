# Fund-A-Feature - An Introduction to Smart Contract Development on the Ethereum Blockchain

## Quick Start<br>
**Required Software**
NPM
web3.js
MetaMask
Truffle
Ganache




## Introduction <br>


**What is Blockchain?**



**What are Smart Contracts?**



**Advantages / When To Use Them**



**Disadvantages / When Not To Use Them**



**Fund-A-Feature Concept**


## Setup
1. NPM

2. Truffle

```
npm install -g truffle
```
TODO change to petshop ex since this is what i used
**From Template ([truffle box](https://www.trufflesuite.com/boxes))**
Using metacoin [example](https://github.com/truffle-box/metacoin-box)
```
mkdir Metacoin
cd Metacoin
truffle unbox metacoin
```

**New Project**
```
mkdir projectName
cd projectName
truffle init
```
**Truffle File Structure**<br>
- contracts/: Directory for Solidity contracts
- migrations/: Directory for scriptable deployment files
- test/: Directory for test files for testing your application and contracts
- truffle-config.js: Truffle configuration file

3. Write the contract using [Solidity programming language](https://solidity.readthedocs.io/en/develop/) -- See below for explanation of code

4. Getting the code working
```
truffle compile
truffle migrate
```

5. Interacting with dApp in the browser with [Metamask](https://metamask.io/)


## Writing dApps in Solidity
From solidity's website:
    "Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state."
I suggest reading their [Introduction To Smart Contracts](https://solidity.readthedocs.io/en/v0.5.13/introduction-to-smart-contracts.html) Tutorial. Below is a quick summary of the information presented there.
**What's the Same**
Functions
Structs, c++ data types

**What's Different**
The main difference is the
address data type
Events
Mapping

**events**

**structs**

**functions**


## Writing Fund-a-Feature
1. First create Feature.sol in the contracts folder, then go to Migrations.sol and copy the first line that starts with "pragma solidity" from there into the Feature.sol file. This line tells the computer that you are using the solidity programming language

2.Create an empty Feature contract that will contain your code
```
contract Feature {

}
```
3. Add the Events. These are 
```
contract Feature {
    event AddedDeveloper(address devID);
    event AddedFeature(address featid);
    event GoalReached(address featid);
    event StartedFeature(uint featnum);
    event CompletedFeature(uint featnum);
    event FeatureConfirmed(uint featnum);
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

}
```
4. Create a struct for each data model:
```
contract Feature {

    [events code]
    struct Developer {
        string name;
        bool doesExist;
    }

    struct FeatureAcnt {
        address feataccnt;
        string name;
        address owneracnt;
        uint amtneeded;
        bool started;
        bool completed;
        bool doesExist;
    }

    struct Backer {
        string name;
        address adr;
        uint featnum;
        uint amount;
        bool votedfor;
    }
}
```
5. Map the structs to objects that will be saves onto the blockchain
```
contract Feature {

    [events code]
    [struct code]
    mapping(address => Developer)public devs; 
    mapping(uint => FeatureAcnt)public feats; 
    mapping(uint => Backer)public backers;
    mapping(address => uint)public balances;
}
```
6. Add the additional variables that I want to keep track of
```
contract Feature {

    [events code]
    [struct code]
    [mapping code]

    uint numDevs;
    uint numVotes;
    uint public numFeats;
    uint public numBackers;
}
```
6. Create the public functions
```
contract Feature {

    [events code]
    [struct code]
    [mapping code]
    [variables]
    
    function Feature() public {
      
    }
    
    function addDeveloper(string name, uint amount) public {
        devs[msg.sender] = Developer(name, true);
        AddedDeveloper(msg.sender);
        balances[msg.sender] = amount; 
    }

    function getBalance(address addr) public view returns(uint) {
        return balances[addr];
    }
}
```
7. Create the additional functions
```
contract Feature {

    [events code]
    [struct code]
    [mapping code]
    [variables]
    [public functions]
    
    function addFeatureBid( address feataccnt, uint amtneeded, string name) {
        if (devs[msg.sender].doesExist == true) {
            feats[numFeats] = FeatureAcnt(feataccnt, name, msg.sender, amtneeded, false, false, true);
            AddedFeature(feataccnt);
            numFeats++;
        }
    }

    function fundFeature(string name, uint featnum, uint amount) {
      //  if (feats[featid].doesExist == true && balances[msg.sender] > amount) { 
         //voterID is the return variable
        backers[numBackers] = Backer(name, msg.sender, featnum, amount, false);
        numBackers++;
        balances[msg.sender] -= amount;
        address featadr = feats[featnum].feataccnt;
        balances[featadr] += amount;
        Transfer(msg.sender, featadr, amount);
        if (balances[featadr] > feats[featnum].amtneeded) {
            GoalReached(featadr);
        }
      //  }
           // return true;
      //  } else {return false;}
        
    }

    function setstarted(uint featnum) {
        if (msg.sender == feats[featnum].owneracnt) {
            feats[featnum].started = true;
            StartedFeature(featnum);
        }
    }

    function setcomplete(uint featnum) {
        if (msg.sender == feats[featnum].owneracnt) {
            feats[featnum].completed = true;
            CompletedFeature(featnum);
        }
    }

    function votecomplete(uint featnum, uint backernum ) {
        if (feats[featnum].completed && backers[backernum].adr == msg.sender && !backers[backernum].votedfor) {
            numVotes++;
            if (numVotes > numBackers/2) {
                feats[featnum].doesExist = false;
                address featadr = feats[featnum].feataccnt;
                Transfer(featadr, feats[featnum].owneracnt, balances[featadr]);
                balances[feats[featnum].owneracnt] += balances[featadr];
                balances[featadr] = 0;
                FeatureConfirmed(featnum);
            }
        }

    }
    function gimmecash(uint amount) {
        balances[msg.sender] += amount;
    }
}
```
## Usage


So for any truffle project you first need:
    1. Start Ganache to have a test blockchain running
    2. Connect to metamask so you can interface with the blockchain in the browser
        click custom RPC for network and name it "development", url of HTTP://127.0.0.1:7545
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

