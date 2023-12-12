// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuRecherche from "../components/MenuRecherche";
import VignetteCarte from "../components/VignetteCarte";
import MenuNomDeck from "../components/MenuNomDeck";
import MenuNomCategorie from "../components/MenuNomCategorie";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/Deck.css";

// Autre
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

function Deck({
  isAuth,
  setIsAuth,
  pseudo,
  setPseudo,
  tailleOrdi,
  tailleInt1,
  tailleInt2,
  tailleTel,
  posBoardAdd,
  setPosBoardAdd,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [deck, setDeck] = useState({});
  const [toShow, setToShow] = useState(false);
  const [menuRch, setMenuRch] = useState(false);
  const [byType, setByType] = useState(false);
  const [byCmc, setByCmc] = useState(false);
  const [byCat, setByCat] = useState(true);
  const [typeList, setTypeList] = useState([]);
  const [cmcList, setCmcList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [chsnList, setChsnList] = useState([]);
  const [commander, setCommander] = useState({ id: "" });
  const [chgDckName, setChgDeckName] = useState(false);
  const [chgCatName, setChgCatName] = useState(false);
  const [catName, setCatName] = useState("");
  const tlg_card = 36;
  const dcl_card = 290;

  let { deckId } = useParams();

  async function getDeck() {
    // await response of fetch call
    let response = await fetch("/api/deck/getMyDeck?deckId=" + deckId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    // only proceed once second promise is resolved

    setDeck(parseRes.deck);
    setTypeList(parseRes.myTriType);
    setChsnList(parseRes.myTriCat); // de base, on dit que c'est par type
    setCmcList(parseRes.myTriCmc);
    setCatList(parseRes.myTriCat);
    setCommander(parseRes.commandant);
    setIsLoaded(true);
  }

  async function changeCat(card, catName) {
    // await response of fetch call
    let response = await fetch("/api/deck/changeCategory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        deckId: deck._id,
        card: card,
        name: catName,
      }),
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    if (parseRes.deck) {
      setDeck(parseRes.deck);
      setCatList(parseRes.myTriCat);
      setChsnList(parseRes.myTriCat);
    } else {
      toast.error(parseRes);
    }
  }

  async function changeCmd(card) {
    let response = await fetch("/api/deck/defineCommander", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        deckId: deck._id,
        card: card,
      }),
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    if (parseRes.deck) {
      setDeck(parseRes.deck);
      setCatList(parseRes.myTriCat);
      setChsnList(parseRes.myTriCat);
      setCommander(parseRes.commandant);
    } else {
      toast.error(parseRes.message);
    }
  }

  useEffect(() => {
    getDeck();
  }, []);

  // fonction qui décale les cartes empillées afin de pouvoir lire le texte
  function mvt_tuilage(e, i, out) {
    // Si l'objet n'a pas de class, il ne faut pas le considérer
    if (e.target.className) {
      // Première étape, il faut choper le groupe contenant toutes les cartes, dont la class s'appelle "cat"
      // e.target ciblant toujours un truc différent, on va remonter jusqu'à trouver l'élément qui nous intéresse, qui est forcément plus haut que e.target
      let myCat = e.target;
      do {
        myCat = myCat.parentNode;
      } while (myCat.className !== "cat");

      // Si on sort, on repositionne tout correctement, quoi qu'il arrive
      if (out) {
        for (let j = 1; j < myCat.childNodes.length; j++) {
          myCat.childNodes[j].style.top = 25 + (j - 1) * tlg_card + "px";
        }
        myCat.style.height =
          345 + tlg_card * (myCat.childNodes.length - 2) + "px";

        // Sinon on décale tout vers le bas
      } else {
        // Il faut également penser à agrandir l'élément cat pour que rien ne dépasse
        // Mais attention, on ne l'agrandit pas quand on regarde la dernière carte, car il n'y a rien à décaler vers le bas
        if (i < myCat.childNodes.length - 1) {
          myCat.style.height =
            345 + tlg_card * (myCat.childNodes.length - 2) + dcl_card + "px";
        } else {
          myCat.style.height =
            345 + tlg_card * (myCat.childNodes.length - 2) + "px";
        }

        // Du coup on décale toutes les cartes se trouvant en dessous
        // ET, on remet en position toutes celles au dessus
        for (let j = 1; j < myCat.childNodes.length; j++) {
          if (j > i) {
            myCat.childNodes[j].style.top =
              25 + (j - 1) * tlg_card + dcl_card + "px";
          } else {
            myCat.childNodes[j].style.top = 25 + (j - 1) * tlg_card + "px";
          }
        }
      }
    }
  }

  // Fonction Drag&Drop, on veut pouvoir passer une carte d'une catégorie à une autre en faisant un glisser déposer avec la souris
  function dragDrop(e) {
    // Fonction possible que si le classement est catégorie
    if (byCat) {
      // Récupération du bon élément e.target
      let myVgt = e.target;

      if (myVgt.className.indexOf("carre_vgt") < 0) {
        do {
          myVgt = myVgt.parentNode;
        } while (myVgt.className.indexOf("slot_vgt") < 0);

        // Récupération de la catégorie dans laquelle elle est présente
        let myOldCat = myVgt.parentNode;

        // On clone l'image pour ne pas toucher la vignette
        let myImg = myVgt.cloneNode(true);
        myImg.style.position = "absolute";
        myImg.style.transition = "0s";

        // Annulation du drag&drop par défaut
        myVgt.ondragstart = function () {
          return false;
        };
        // Annulation du drag&drop par défaut
        myImg.ondragstart = function () {
          return false;
        };

        myImg.id = "drag_drop";

        // Récupération l'élément sur lequel on va balader l'objet, et intégration de ce dernier à l'intérieur
        let myBoard = document.getElementById("board_deck");
        myBoard.appendChild(myImg);

        // Récupération de la carte associée
        let cardId = myVgt.childNodes[0].id;
        let myCard = "";
        for (let i = 0; i < deck.cardList.length; i++) {
          if (deck.cardList[i][0].id === cardId) {
            myCard = deck.cardList[i][0];
          }
        }

        // Trigger à chaque mvt de souris
        document.addEventListener("mousemove", onMouseMove);

        // Coordonnées souris
        let myX = 0;
        let myY = 0;

        let myCat = "";

        function onMouseMove(event) {
          myX = event.pageX;
          myY = event.pageY;

          myImg.style.top = myY + "px";
          myImg.style.left = myX + "px";

          // On utilise la position X et Y pour savoir devant quel cat on se trouve

          let myNode = "";
          for (let i = 0; i < myBoard.childNodes.length; i++) {
            myNode = myBoard.childNodes[i];
            if (myNode.id !== "drag_drop") {
              if (
                myX > myNode.offsetLeft &&
                myX < myNode.offsetLeft + myNode.offsetWidth &&
                myY > myNode.offsetTop &&
                myY < myNode.offsetTop + myNode.offsetHeight
              ) {
                myCat = myNode;
                myNode.style.background = "rgb(255, 255, 255)";
                myNode.style.boxShadow = "1px 1px 20px rgb(50, 50, 50)";
                break;
              } else {
                myNode.style.background = "var(--main-color-blc)";
                myNode.style.boxShadow = "none";
                myCat = "";
              }
            }
          }
        }

        // Dès que le clique de la souris se relève
        document.onmouseup = function () {
          if (myCat !== "") {
            myCat.style.background = "var(--main-color-blc)";
            myCat.style.boxShadow = "none";

            // Selon la catégorie dans laquelle on lâche la carte
            // Création nouvelle catégorie
            if (myCat.id === "new_cat") {
              changeCat(myCard, newCategory());
            } else if (myCat.id === "cat_cmd") {
              changeCmd(myCard);
            } else {
              changeCat(myCard, myCat.id);
            }
          }
          // Suppression de l'évenement mousemove
          document.removeEventListener("mousemove", onMouseMove);

          // Suppression de l'élément cloné
          myImg.remove();

          // On vide les variables
          myCat = "";
        };
      }
    }
  }

  function newCategory() {
    // On va forcément l'appeler "Nouvelle catégorie (1)" puis incrémenter, on va alors d'abord se renseigner sur combien de catégorie avec le même nom existe pour trouver la bonne incrémentation
    let myTab = [];
    let myName = "";

    // Récupération de tous les éléments avec Nouvelle catégorie()
    for (let i = 0; i < catList.length; i++) {
      if (catList[i][0].indexOf("Nouvelle catégorie(") >= 0) {
        // On enlève ce qui nous intéresse pas, et si on obtient un nombre, on enregistre
        myName = catList[i][0].replace("Nouvelle catégorie(", "");
        myName = myName.replace(")", "");
        if (!isNaN(+myName)) {
          myTab.push(+myName);
        }
      }
    }

    // On trie
    myTab = myTab.sort();

    // on attribue le dernier num
    if (myTab.length === 0) {
      return "Nouvelle catégorie(1)";
    } else {
      return "Nouvelle catégorie(" + (myTab[myTab.length - 1] + 1) + ")";
    }
  }

  return isLoaded ? (
    <div className="fond">
      <Header
        tailleOrdi={tailleOrdi}
        tailleInt1={tailleInt1}
        tailleInt2={tailleInt2}
        tailleTel={tailleTel}
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        pseudo={pseudo}
        setPseudo={setPseudo}
        isDeckPage={true}
        posBoardAdd={posBoardAdd}
        setPosBoardAdd={setPosBoardAdd}
        setToShow={setToShow}
        setMenuRch={setMenuRch}
        setByType={setByType}
        setByCmc={setByCmc}
        setByCat={setByCat}
        typeList={typeList}
        cmcList={cmcList}
        catList={catList}
        setChsnList={setChsnList}
      />
      <div id="board_deck" className="board fond_cat">
        <div
          onClick={(e) => {
            setToShow(true);
            setChgDeckName(true);
          }}
          className="titre_board elm_ct gras txt_nr txt_2 crs_ptr"
        >
          {deck.name}
        </div>
        {byCat ? (
          <div id="cat_cmd" className="cat" style={{ height: "345px" }}>
            <div className="titre_cat elm_ct txt_ct txt_blc gras">
              Commandant
            </div>
            {deck.commander.length > 0 ? (
              <VignetteCarte
                card={commander}
                deck={deck}
                setDeck={setDeck}
                pseudo={pseudo}
                setTypeList={setTypeList}
                setCmcList={setCmcList}
                setCatList={setCatList}
                setChsnList={setChsnList}
                byType={byType}
                byCmc={byCmc}
                byCat={byCat}
                setCommander={setCommander}
              />
            ) : (
              <div className="cat_vide txt_nr gras elm_ct txt_ct txt_1_6">
                Faîtes glisser votre Commandant ici
              </div>
            )}
          </div>
        ) : null}
        {chsnList.length > 0
          ? chsnList.map((cat, index) =>
              cat.length <= 1 ? null : (
                <div
                  id={cat[0]}
                  className="cat"
                  key={index}
                  style={{ height: 345 + tlg_card * (cat.length - 2) + "px" }}
                  onMouseLeave={(e) => {
                    mvt_tuilage(e, index, true);
                  }}
                >
                  <div
                    onClick={(e) => {
                      if (byCat) {
                        setToShow(true);
                        setChgCatName(true);
                        setCatName(cat[0]);
                      }
                    }}
                    className={
                      byCat
                        ? "titre_cat elm_ct txt_ct txt_blc gras crs_ptr"
                        : "titre_cat elm_ct txt_ct txt_blc gras"
                    }
                  >
                    {cat[0]}
                  </div>
                  {cat.map((card, index_j) =>
                    index_j > 0 ? (
                      <div
                        key={index_j}
                        className="slot_vgt tst05"
                        draggable="true"
                        style={{
                          top: 25 + (index_j - 1) * tlg_card + "px",
                        }}
                        onMouseDown={(e) => dragDrop(e)}
                        onMouseEnter={(e) => {
                          mvt_tuilage(e, index_j, false);
                        }}
                      >
                        <VignetteCarte
                          card={card}
                          deck={deck}
                          setDeck={setDeck}
                          pseudo={pseudo}
                          setTypeList={setTypeList}
                          setCmcList={setCmcList}
                          setCatList={setCatList}
                          setChsnList={setChsnList}
                          byType={byType}
                          byCmc={byCmc}
                          byCat={byCat}
                          setCommander={setCommander}
                        />
                      </div>
                    ) : null
                  )}
                </div>
              )
            )
          : null}
        {byCat ? (
          <div id="new_cat" className="cat" style={{ height: "345px" }}>
            <div className="titre_cat elm_ct txt_ct txt_blc gras">
              Nouvelle catégorie
            </div>
            <div className="cat_vide txt_nr gras elm_ct txt_ct txt_1_6">
              Faîtes glisser une carte ici pour créer une nouvelle catégorie
            </div>
          </div>
        ) : null}
      </div>
      <div className="side_board" style={{ left: toShow ? "0px" : "100vw" }}>
        {menuRch ? (
          <MenuRecherche
            setMenuRch={setMenuRch}
            setToShow={setToShow}
            tailleTel={tailleTel}
            deck={deck}
            setDeck={setDeck}
            pseudo={pseudo}
            setTypeList={setTypeList}
            setCmcList={setCmcList}
            setCatList={setCatList}
            setChsnList={setChsnList}
            byType={byType}
            byCmc={byCmc}
            byCat={byCat}
            setCommander={setCommander}
          />
        ) : null}
        {chgDckName ? (
          <MenuNomDeck
            setToShow={setToShow}
            tailleTel={tailleTel}
            deck={deck}
            setDeck={setDeck}
            pseudo={pseudo}
            setChgDeckName={setChgDeckName}
          />
        ) : null}
        {chgCatName ? (
          <MenuNomCategorie
            setToShow={setToShow}
            tailleTel={tailleTel}
            deck={deck}
            setDeck={setDeck}
            pseudo={pseudo}
            catName={catName}
            setChgCatName={setChgCatName}
            setCatList={setCatList}
            setChsnList={setChsnList}
          />
        ) : null}
      </div>
      <Footer />
    </div>
  ) : null;
}

export default Deck;
