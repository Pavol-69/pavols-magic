const express = require("express");
const Deck = require("../models/Deck");

// Fonctions de tri pour faciliter le front
// Toutes présentés de la même manière : tableau à 2 dimensions, chaque colonne a le nom de la catégorie en 0, et les cartes associées dans la même colonne à partir du 1
function triType(cardList) {
  // en fonction du type
  let byCrea = ["Créature"];
  let byEnch = ["Enchantement"];
  let byEph = ["Ephémère"];
  let byRit = ["Rituel"];
  let byTer = ["Terrain"];
  let byArt = ["Artefact"];
  let myTri = [];

  // Créatures
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("creature") >= 0) {
      byCrea.push(cardList[i][0]);
    }
  }

  // Enchantement
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("enchantment") >= 0) {
      byEnch.push(cardList[i][0]);
    }
  }

  // Ephémères
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("instant") >= 0) {
      byEph.push(cardList[i][0]);
    }
  }

  // Rituels
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("sorcery") >= 0) {
      byRit.push(cardList[i][0]);
    }
  }

  // Terrains
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("land") >= 0) {
      byTer.push(cardList[i][0]);
    }
  }

  // Artefacts
  for (let i = 0; i < cardList.length; i++) {
    if (cardList[i][0].type.toLowerCase().indexOf("artefact") >= 0) {
      byArt.push(cardList[i][0]);
    }
  }

  // Assemblage
  if (byCrea.length > 1) {
    myTri.push(byCrea);
  }
  if (byEnch.length > 1) {
    myTri.push(byEnch);
  }
  if (byEph.length > 1) {
    myTri.push(byEph);
  }
  if (byRit.length > 1) {
    myTri.push(byRit);
  }
  if (byTer.length > 1) {
    myTri.push(byTer);
  }
  if (byArt.length > 1) {
    myTri.push(byArt);
  }
  return myTri;
}

function triCmc(cardList) {
  //Tri selon CMC
  let myTri = [];
  let myBool = false;

  // On récupère d'abord tous les CMC
  for (let i = 0; i < cardList.length; i++) {
    myBool = true;
    for (let j = 0; j < myTri.length; j++) {
      if (myTri[j][0] === cardList[i][0].cmc) {
        myBool = false;
      }
    }
    if (myBool) {
      myTri.push([cardList[i][0].cmc]);
    }
  }
  myTri = myTri.sort();

  // Ensuite on complète avec les cartes associées
  for (let i = 0; i < cardList.length; i++) {
    for (let j = 0; j < myTri.length; j++) {
      if (cardList[i][0].cmc === myTri[j][0]) {
        myTri[j].push(cardList[i][0]);
      }
    }
  }

  return myTri;
}

function triCat(deck) {
  //Tri selon Catégorie
  let myTri = [];
  let myBool = false;
  let cardList = deck.cardList;

  // On récupère d'abord tous les catégories
  for (let i = 0; i < cardList.length; i++) {
    myBool = true;
    for (let j = 0; j < myTri.length; j++) {
      if (myTri[j][0] === cardList[i][2]) {
        myBool = false;
      }
    }
    if (myBool) {
      myTri.push([cardList[i][2]]);
    }
  }
  myTri = myTri.sort();

  // Ensuite on complète avec les cartes associées
  for (let i = 0; i < cardList.length; i++) {
    for (let j = 0; j < myTri.length; j++) {
      if (deck.commander.length > 0) {
        if (
          cardList[i][2] === myTri[j][0] &&
          cardList[i][0].id !== deck.commander[0].id
        ) {
          myTri[j].push(cardList[i][0]);
        }
      } else {
        if (cardList[i][2] === myTri[j][0]) {
          myTri[j].push(cardList[i][0]);
        }
      }
    }
  }

  return myTri;
}

// Tri alphabétique des cartes du decks
function triAlpha(deckList) {
  let myTab = [];
  let myTriDckLst = [];

  // Récupération de tous les noms
  for (let i = 0; i < deckList.length; i++) {
    myTab.push(deckList[i][0].name);
  }

  // tri alphabétique des noms
  myTab = myTab.sort();

  // association de chaque nom à la carte correspondante
  for (let i = 0; i < myTab.length; i++) {
    for (let j = 0; j < deckList.length; j++) {
      if (deckList[j][0].name === myTab[i]) {
        myTriDckLst.push(deckList[j]);
      }
    }
  }

  return myTriDckLst;
}

exports.createDeck = (req, res, next) => {
  const deck = new Deck({
    pseudo: req.body.pseudo,
    name: req.body.name,
  });

  deck
    .save()
    .then((newDeck) => Deck.find().then((decks) => res.status(200).json(deck)))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Ajout d'une carte dans la DeckList
exports.addCard = (req, res, next) => {
  // Recherche du deck en question
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    // Vérification que l'utilisateur est bien proprietaire du deck
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({
        message:
          "Vous ne pouvez pas modifier un deck qui ne vous appartient pas.",
      });
    } else {
      // Variable booléenne pour repérer si carte déjà présente dans DeckList
      let MyBool = true;

      // Quantité carte
      let qtyCard = 1;

      // Récupération de la DeckList
      let MyTab = [];
      for (let i = 0; i < myDeck.cardList.length; i++) {
        /*for (let j = 0; j < 3; j++){
                    MyTab[i][j] = myDeck.cardList[i][j];
                };*/

        MyTab[i] = myDeck.cardList[i];

        // Vérification si la carte est déjà présente dans la liste, si c'est le cas, on incrémente juste sa quantité
        if (req.body.card.name == MyTab[i][0].name) {
          MyBool = false;
          MyTab[i][1] = MyTab[i][1] + 1;
          qtyCard = MyTab[i][1];
        }
      }

      // Intégration de la nouvelle si elle est nouvelle
      if (MyBool) {
        MyTab.push([req.body.card, 1, req.body.category]);
      }

      // Màj de la BDD
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: myDeck.name,
          pseudo: myDeck.pseudo,
          commander: myDeck.commander,
          cardList: triAlpha(MyTab),
          _id: req.body.deckId,
        }
      )
        .then((thing) => {
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            let myTriType = triType(deck.cardList);
            let myTriCmc = triCmc(deck.cardList);
            let myTriCat = triCat(deck);
            res
              .status(200)
              .json({ deck, qtyCard, myTriType, myTriCmc, myTriCat });
          });
        })
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.defineCommander = (req, res, next) => {
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({ message: "Non autorise" });
    } else if (req.body.card.type.indexOf("Legendary Creature") < 0) {
      res.status(401).json({
        message: "Un commandant ne peut qu'être une créature légendaire",
      });
    } else {
      let MyTab = [];
      MyTab[0] = req.body.card;

      let myCardList = myDeck.cardList;
      let commandant = "";
      for (let i = 0; i < myCardList.length; i++) {
        if (myCardList[i][0].name === req.body.card.name) {
          commandant = myCardList[i][0];
        }
      }

      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: myDeck.name,
          pseudo: myDeck.pseudo,
          commander: MyTab,
          cardList: myCardList,
          _id: req.body.deckId,
        }
      )
        .then((thing) =>
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            let myTriCat = triCat(deck);
            res.status(200).json({ commandant, deck, myTriCat });
          })
        )
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.changeDeckName = (req, res, next) => {
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({ message: "Non autorise" });
    } else {
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: req.body.name,
          pseudo: myDeck.pseudo,
          commander: myDeck.commander,
          cardList: myDeck.cardList,
          _id: req.body.deckId,
        }
      )
        .then((thing) =>
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            res.status(200).json({ deck });
          })
        )
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.deleteCommander = (req, res, next) => {
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({ message: "Non autorise" });
    } else {
      let MyTab = [];
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: myDeck.name,
          pseudo: myDeck.pseudo,
          commander: MyTab,
          cardList: myDeck.cardList,
          _id: myDeck.deckId,
        }
      )
        .then((thing) =>
          res.status(200).json({ message: "Commandant supprimé" })
        )
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

// Supprime une carte de la DeckList
exports.deleteCard = (req, res, next) => {
  // Recherche de la DeckList en particulier
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    // On vérifie que c'est bien le propriétaire du deck qui le modifie
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({
        message:
          "Vous ne pouvez pas modifier un deck qui ne vous appartient pas.",
      });
    } else {
      let j = -1;
      let k = 0;
      let MyTab = [];
      let qtyCard = 0;
      let myCmd = myDeck.commander;

      // Création d'une liste sans la carte en question, ou avec la quantité diminuée
      for (let i = 0; i < myDeck.cardList.length; i++) {
        // Si la carte n'a pas le même nom que celle que l'on veut supprimer, on ajoute à la liste
        if (myDeck.cardList[i][0].id != req.body.card.id) {
          j++;
          MyTab[j] = myDeck.cardList[i];
        } else if (myDeck.cardList[i][1] > 1) {
          // Si la carte a le même nom mais que la quantité est supérieure à 1, on fait -1 à la quantité
          j++;
          MyTab[j] = myDeck.cardList[i];
          myDeck.cardList[i][1] = myDeck.cardList[i][1] - 1;
          qtyCard = myDeck.cardList[i][1];
        } else if (myCmd.length > 0) {
          // S'il s'agit du commandant, il faut également le supprimer de sa fonction
          if (myDeck.cardList[i][0].name === myCmd[0].name) {
            myCmd = [];
          }
        }
      }

      // On écrase tout avec la liste que l'on vient de créer, qui est la même qu'avant, avec la carte en moins
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: myDeck.name,
          pseudo: myDeck.pseudo,
          commander: myCmd,
          cardList: triAlpha(MyTab),
          _id: req.body.deckId,
        }
      )
        .then((thing) => {
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            let myTriType = triType(deck.cardList);
            let myTriCmc = triCmc(deck.cardList);
            let myTriCat = triCat(deck);
            let commander = "";
            if (myCmd.length > 0) {
              commander = myCmd[0];
            } else {
              commander = { id: "" };
            }
            res.status(200).json({
              deck,
              qtyCard,
              myTriType,
              myTriCmc,
              myTriCat,
              commander,
            });
          });
        })
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.getAllDecks = (req, res, next) => {
  Deck.find()
    .then((decks) => {
      let myDecks = [];
      for (let i = 0; i < decks.length; i++) {
        if (decks[i].pseudo === req.headers.pseudo) {
          myDecks.push(decks[i]);
        }
      }

      res.status(200).json({ decks, myDecks });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getMyDeck = async (req, res) => {
  Deck.findOne({ _id: req.query.deckId })
    .then((deck) => {
      let commandant = [{ id: "" }];
      if (deck.commander.length > 0) {
        for (let i = 0; i < deck.cardList.length; i++) {
          if (deck.cardList[i][0].id === deck.commander[0].id) {
            commandant = deck.cardList[i][0];
          }
        }
      }
      let myTriType = triType(deck.cardList);
      let myTriCmc = triCmc(deck.cardList);
      let myTriCat = triCat(deck);

      res.status(200).json({ deck, myTriType, myTriCmc, myTriCat, commandant });
    })
    //.then(deck => console.log(deck))
    .catch((error) => res.status(400).json({ error }));
};

exports.getCommander = async (req, res) => {
  Deck.findOne({ _id: req.query.deckId })
    .then((deck) => res.status(200).json(deck.commander))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteDeck = (req, res, next) => {
  Deck.findOne({ _id: req.body.deckId })
    .then((deck) => {
      if (deck.pseudo != req.body.pseudo) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Deck.deleteOne({ _id: req.body.deckId })
          .then(() => {
            Deck.find().then((decks) => res.status(200).json(decks));
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteAllDecks = (req, res, next) => {
  Deck.find()
    .then((decks) => {
      let MyTab = [];
      for (let i = 0; i < decks.length; i++) {
        MyTab[i] = decks[i]._id;
      }
      Deck.deleteMany({ MyTab })
        .then(() => {
          res.status(200).json({ message: "Tous les decks sont supprimés !" });
        })
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Change la catégorie d'une carte
exports.changeCategory = (req, res, next) => {
  // Recherche du deck en question
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    // Vérification que l'utilisateur est bien proprietaire du deck
    if (myDeck.pseudo !== req.body.pseudo) {
      res.status(401).json({ message: "Non autorise" });
    } else {
      let MyTab = myDeck.cardList;

      // Recherche de la carte
      for (let i = 0; i < myDeck.cardList.length; i++) {
        //console.log(MyTab[i][2])
        // Une fois qu'on l'a trouvé, on peut changer la catégorie
        if (req.body.card.name === MyTab[i][0].name) {
          MyTab[i][2] = req.body.name;
        }
      }

      // Màj de la BDD
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          //name : myDeck.name,
          //pseudo : myDeck.pseudo,
          //commander : myDeck.commander,
          cardList: triAlpha(MyTab),
          //_id: req.body.deckId
        }
      )
        .then((thing) =>
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            let myTriCat = triCat(deck);
            res.status(200).json({ deck, myTriCat });
          })
        )
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

exports.changeCategoryName = (req, res, next) => {
  Deck.findOne({ _id: req.body.deckId }).then((myDeck) => {
    let myBool = false;
    for (let i = 1; i < myDeck.cardList.length; i++) {
      if (myDeck.cardList[i][2] === req.body.newName) {
        myBool = true;
      }
    }
    if (myDeck.pseudo != req.body.pseudo) {
      res.status(401).json({ message: "Non autorise" });
    } else if (myBool && req.body.newName !== req.body.oldName) {
      res.status(401).json({ message: "Nom déjà existant" });
    } else {
      let myTab = myDeck.cardList;

      for (let i = 1; i < myTab.length; i++) {
        if (myTab[i][2] === req.body.oldName) {
          myTab[i][2] = req.body.newName;
        }
      }
      Deck.updateOne(
        { _id: req.body.deckId },
        {
          name: myDeck.name,
          pseudo: myDeck.pseudo,
          commander: myDeck.commander,
          cardList: myTab,
          _id: myDeck.deckId,
        }
      )
        .then((thing) =>
          Deck.findOne({ _id: req.body.deckId }).then((deck) => {
            let myTriCat = triCat(deck);
            res.status(200).json({ deck, myTriCat });
          })
        )
        .catch((error) => res.status(401).json({ error }));
    }
  });
};
