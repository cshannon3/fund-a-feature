App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  name: "",
  balance: 0,


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Feature.json", function(feature) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Feature = TruffleContract(feature);
      // Connect provider to interact with contract
      App.contracts.Feature.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Feature.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.AddedDeveloper({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        //App.render();
      });
      instance.AddedFeature({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        //App.render();
      });
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
       // App.render();
      });
      instance.GoalReached({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
       // App.render();
      });
      instance.FeatureConfirmed({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
       // App.render();
      });
    });
  },


    render: function() {
      var featureInstance;
      var loader = $("#loader");
      var content = $("#content");
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  
      // Load contract data
      App.contracts.Feature.deployed().then(function(instance) {
        featureInstance = instance;
        return featureInstance.numFeats();
      }).then(function(numFeats) {
        var featureInfo = $("#FeatureInfo");
        featureInfo.empty();
        
        
        for (var i = 1; i <= numFeats; i++) {
          featureInstance.feats(i).then(function(feat){
            var name = feat[1];
            console.log(i);
            //console.log(feat[2]);
            
            var amtneeded = feat[3];
            var started = "no"
            var completed = "no"
            if (feat[4]){
              started = "&#10004; yes"
              if(feat[5]){
                completed =  "&#10004; yes"
              }
            }
            featureInstance.balances(feat[0]).then(function(t){
              
              console.log("hi" + i)
              var featureTemplate = "<tr><th>" + i + "</th><td>" + name + "</td><td>" + t + "</td><td>" + amtneeded + "</td><td>" + started+ "</td><td>" + completed+ "</td></tr>"
              featureInfo.append(featureTemplate);
            });
            
          });

        }
        
        return featureInstance.numBackers();
        }).then(function(numBackers){
          var bkrs = $("#BackersInfo");
          bkrs.empty();
          for (var j = 1; j <= numBackers; j++) {
            featureInstance.backers(j).then(function(backer){
              var backerTemplate = "<tr><th>" + backer[0] + "</th><td>" + backer[1] + "</td><td>" + backer[2] + "</td><td>" + backer[3] + "</td><td>" + backer[4] + "</td></tr>"
              bkrs.append(backerTemplate);
              console.log(backer[1] + "   " +  backer[2] + "   " + backer[3])
            });
          }
        });
         loader.hide();
         content.show();
       /* console.log("HI")
        featureInstance.feats("0xa1619ab69b3ada4a55ca7036fb734b13342e6df8").then(function(t) {

          console.log(t)
        });
        featureInstance.balances("0xa1619ab69b3ada4a55ca7036fb734b13342e6df8").then(function(c) {
          console.log(c)
        });*/
       
      
    
        return featureInstance
    }
  };
  
    /*castMove: function() {
      var location = 1;
      //$('#candidatesSelect').val();
      App.contracts.TicTacToe.deployed().then(function(instance) {
        return instance.move(location, { from: App.account });
      }).then(function(result) {
        // Wait for votes to update
       // $("#content").hide();
      //  $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
    }
  };
  */
  $(function() {
    $(window).load(function() {
     
      App.init();
    });
  });



/*App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    

    return App.initContract();
  },

  initContract: function() {
   /

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
   
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

   
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
*/