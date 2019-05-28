pragma solidity ^0.4.2;


contract Feature {
    //Store canidate
     //Read canidate
    event AddedDeveloper(address devID);
    event AddedFeature(address featid);
    event GoalReached(address featid);
    event StartedFeature(uint featnum);
    event CompletedFeature(uint featnum);
    event FeatureConfirmed(uint featnum);
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

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
    
    // declares a state variable - number Of Candidates
    uint numDevs;
    uint numVotes;
    // Store accounts that have voted
  //  mapping(uint => uint)public fundingRecieved;
    // Store Funders
   
    mapping(address => Developer)public devs; 
    mapping(uint => FeatureAcnt)public feats; 
    mapping(uint => Backer)public backers;
   // uint public funds;
    mapping(address => uint)public balances;
    uint public numFeats;
    uint public numBackers;

    function Feature() public {
      
    }
    
    function addDeveloper(string name, uint amount) public {
        // candidateID is the return variable

        // Create new Candidate Struct with name and saves it to storage.
        devs[msg.sender] = Developer(name, true);
        AddedDeveloper(msg.sender);
        balances[msg.sender] = amount; 
    }
    
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

    function getBalance(address addr) public view returns(uint) {
        return balances[addr];
    }
    
}