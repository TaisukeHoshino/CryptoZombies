pragma solidity ^0.4.17;

contract ZombieFactory {

  //DNAのパラメーターを用意
  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;

  //Zombieの構造体
  struct Zombie {
    uint id;
    string name;
    uint dna;
  }

  //Zombieの配列を用意⇨あとでzombie達を保存する
  mapping(uint => Zombie) public zombies;
  uint zombieCounter;


  //新しいzombieを作るEvent
  event NewZombie(
    uint indexed _zombieId,
    string _name,
    uint _dna
    );

  function _createZombie(string _name, uint _dna) private {
    /* zombieCounter = zombies.push(Zombie(zombieCounter, _name, _dna)) - 1; */
    zombieCounter++;
    zombies[zombieCounter] = Zombie(zombieCounter,_name,_dna);
    NewZombie(zombieCounter, _name, _dna);
  }

  function generateRandomDna(string _str) public view returns(uint) {
    uint rand = uint(keccak256(_str));
    return rand % dnaModulus;
  }

  function createRandomZombie(string _name) public {
    uint randDna = generateRandomDna(_name);
    _createZombie(_name, randDna);
  }

  //独自
  //zombiesに入っているzombieのidを全て返す
  function getZombies() public view returns (uint []) {
    //prepare output array
    uint[] memory zombieIds = new uint[](zombieCounter);
    uint numberOfZombies = 0;

    //zombiesに一体しか登録されていない場合⇨zombieIdsに1を追加する

    for(uint i=1; i<= zombieCounter; i++){
      zombieIds[numberOfZombies] = zombies[i].id;
      numberOfZombies++;
    }


    return zombieIds;






  }

}
