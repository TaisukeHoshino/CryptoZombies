App = {
     web3Provider: null,
     contracts: {},
     loading: false,

     init: function() {
          /*
           * Replace me...
           */

          return App.initWeb3();
     },

     initWeb3: function() {
          //initialize web3
          if (typeof web3 !== 'undefined'){
            //reuse the provieder of the Web3 object injected by metamask
            App.web3Provider = web3.currentProvider;
          }else{
            //create a new provider and plug it directory into our local node
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          }

          web3 = new Web3(App.web3Provider);

          App.displayAccountInfo();

          return App.initContract();
     },

     initContract: function() {
          $.getJSON('ZombieFactory.json', function(zombieFactoryArtifact){
            //get the contract artifact file and use it to instatiate a truffle contract abstraction
            App.contracts.ZombieFactory = TruffleContract(zombieFactoryArtifact);
            //set the provider for our contracts
            App.contracts.ZombieFactory.setProvider(App.web3Provider);

            //retrieve the article from the contract

            //listen to events
            App.listenToEvents();

          })
     },

     //evnentで構造体にアクセスする説or構造体無理だから、解除してアクセス（ChainSkillsはそうなってる）
     listenToEvents: function() {
       App.contracts.ZombieFactory.deployed().then(function(instance){
         instance.NewZombie({}, {}).watch(function(error, result){
           if(!error){
             //zombieを表示
              console.log("fsfasd");
             // return App.generateZombie(result.args._zombieId, result.args._name, result.args._dna);
           }else{
             console.error(error);
           }
         });
       });
     },
     //ボタンを押された時に、テキストボックスの値を読み取り、zombie化する
     generateZombie: function(){
       //テキストボックスの値をnameに入れる
        var name = $('#nameInput').val();

        //コントラクトのインスタンス
        var zombieFactoryInstance;

        // コントラクトにアクセスし、generateRandomDnaで乱数を発生させ、dnaに保存する
        //状態を変化させるため、必ず{from: ,gas: }を指定すること.そうじゃないと誰が費用払うの問題
        App.contracts.ZombieFactory.deployed().then(function(instance){
          zombieFactoryInstance = instance;
          return zombieFactoryInstance.createRandomZombie(name, {
            from: App.account,
            gas: 500000
          });
        }).then(function(result){

          App.listenToEvents();
        }).catch(function(err){
          console.error(err.message);
        });

        App.reloadZombies();

     },

     //mappingに保存されたzombieを取得し、htmlに表示する
     reloadZombies: function() {
       //avoid reentry
       if(App.loading) {
          return;
        }
        App.loading = true;


       //コントラクトのインスタンス
       var zombieFactoryInstance;


       App.contracts.ZombieFactory.deployed().then(function(instance){
         zombieFactoryInstance = instance;
         return zombieFactoryInstance.getZombies();
       }).then(function(zombieIds){
         // retrieve the article placeholder and clear it
         $('#zombiesRow').empty();
         for(var i=0; i < zombieIds.length; i++){
           var zombieId =zombieIds[i];
           zombieFactoryInstance.zombies(zombieId.toNumber()).then(function(zombie){
             App.displayZombie(zombie[0], zombie[1], zombie[2]);
           });
         }
         App.loading = false;
       }).catch(function(err){
         console.error(err.message);
         App.loading = false;
       });

     },

     //フロントにゾンビリストを表示させる
     displayZombie: function(id, name, dna){
       //jQueryでhtmlの場所を取得

       $('#zombieId').text(id);
       $('#zombieName').text(name);
       $('#zombieDna').text(dna);


       // var zombiesRow = $('#zombiesRow');
       // var zombieTemplate = $('zombieTemplate');
       //
       // zombieTemplate.find('zombie-id').text(id);
       // zombieTemplate.find('zombie-name').text(name);
       // zombieTemplate.find('zombie-dna').text(dna);
       //
       // //htmlにぶち込む
       // zombiesRow.append(zombieTemplate.html());
     },

     //アカウントの情報をjsファイルで扱えるようにする
     displayAccountInfo: function() {
       web3.eth.getCoinbase(function(err, account){
         if(err === null){
           App.account = account;
           web3.eth.getBalance(account, function(err, balance){
             if(err===null){
               //Balance情報の取得と表示
             }
           })
         }
       })
     }



};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
