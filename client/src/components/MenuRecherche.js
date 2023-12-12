// Components
import VignetteCarte from "./VignetteCarte";

// CSS
import "../styles/CSSGeneral.css";
import "../styles/MenuRecherche.css";

// Images
import blanc from "../datas/icones/Blanc.png";
import bleu from "../datas/icones/Bleu.png";
import incolore from "../datas/icones/Incolore.png";
import noir from "../datas/icones/Noir.png";
import rouge from "../datas/icones/Rouge.png";
import vert from "../datas/icones/Vert.png";

// Autre
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function MenuRecherche({
  setToShow,
  setMenuRch,
  tailleTel,
  deck,
  setDeck,
  pseudo,
  setTypeList,
  setCmcList,
  setCatList,
  setChsnList,
  byType,
  byCmc,
  byCat,
  setCommander,
}) {
  const [shkArr, setShkArr] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [srchPropo, setSrchPropo] = useState([]);
  const [showPropal, setShowPropal] = useState(false);
  const [mySearch, setMySearch] = useState({
    cardName: "",
    cardType: "Toutes",
    W: true,
    U: true,
    I: true,
    B: true,
    R: true,
    G: true,
  });
  const [result, setResult] = useState([]);

  useEffect(() => {
    getAllCards();
  }, []);

  async function getAllCards() {
    let response = await fetch(
      "https://api.magicthegathering.io/v1/cards?page=199"
    );
    let parseRes = await response.json();
    // only proceed once second promise is resolved
    setAllCards(parseRes.cards);
  }

  function closeMenu(e) {
    setToShow(false);
    setMenuRch(false);
  }

  function myOnChange(e) {
    setMySearch({ ...mySearch, [e.target.name]: e.target.value });

    if (e.target.name === "cardName") {
      let myTab = [];
      if (e.target.value.length > 2) {
        for (let i = 0; i < allCards.length; i++) {
          if (
            allCards[i].name
              .toLowerCase()
              .indexOf(e.target.value.toLowerCase()) >= 0 &&
            allCards[i].imageUrl // certains doublons, on ne considère que les cartes avec une image
          ) {
            myTab.push(allCards[i].name);
          }
        }
      }
      setSrchPropo(myTab);
    }
  }

  function myChangeColor(myColor) {
    if (mySearch[myColor]) {
      setMySearch({ ...mySearch, [myColor]: false });
    } else {
      setMySearch({ ...mySearch, [myColor]: true });
    }
  }

  function reinit(e) {
    e.preventDefault();

    setMySearch({
      ...mySearch,
      cardName: "",
      cardType: "Toutes",
      W: true,
      U: true,
      I: true,
      B: true,
      R: true,
      G: true,
    });
    setSrchPropo([]);
    setResult([]);
  }

  // Obligé de se faire son propre onBlur, ça n'a pas l'air de marcher avec un élément en position absolute
  function myOnBlur(e) {
    e.preventDefault();
    let myClass = e.target.className;
    if (typeof myClass === "string") {
      if (myClass.indexOf("blur_propal") < 0) {
        setShowPropal(false);
      }
    }
  }

  function rechercher(e) {
    e.preventDefault();
    setShowPropal(false);
    let myTab = [];

    for (let i = 0; i < allCards.length; i++) {
      if (allCards[i].imageUrl) {
        if (
          allCards[i].name
            .toLowerCase()
            .indexOf(mySearch.cardName.toLowerCase()) >= 0
        ) {
          let myBoolType = false;
          for (let j = 0; j < allCards[i].types.length; j++) {
            // Obligé d'y faire un à un pour la traduction
            if (
              allCards[i].types[j] === "Creature" &&
              mySearch.cardType === "Créature"
            ) {
              myBoolType = true;
            }
            if (
              allCards[i].types[j] === "Enchantment" &&
              mySearch.cardType === "Enchantement"
            ) {
              myBoolType = true;
            }
            if (
              allCards[i].types[j] === "Sorcery" &&
              mySearch.cardType === "Rituel"
            ) {
              myBoolType = true;
            }
            if (
              allCards[i].types[j] === "Instant" &&
              mySearch.cardType === "Ephémère"
            ) {
              myBoolType = true;
            }
            if (
              allCards[i].types[j] === "Land" &&
              mySearch.cardType === "Terrain"
            ) {
              myBoolType = true;
            }
            if (mySearch.cardType === "Toutes") {
              myBoolType = true;
            }
          }
          if (myBoolType) {
            let myBoolColor = false;

            if (allCards[i].colorIdentity) {
              for (let j = 0; j < allCards[i].colorIdentity.length; j++) {
                if (mySearch[allCards[i].colorIdentity[j]]) {
                  myBoolColor = true;
                  break;
                }
              }
            } else {
              if (!mySearch.I) {
                myBoolColor = false;
              }
            }
            if (myBoolColor) {
              myTab.push(allCards[i]);
            }
          }
        }
      }
    }
    setResult(myTab);
  }

  return (
    <div onClick={(e) => myOnBlur(e)}>
      <div>
        <FontAwesomeIcon
          id="cls_menu_arr"
          onClick={(e) => closeMenu(e)}
          onMouseEnter={(e) => {
            setShkArr(true);
          }}
          onMouseLeave={(e) => {
            setShkArr(false);
          }}
          icon={faArrowRight}
          shake={shkArr}
        />
      </div>
      <div className="board elm_ct colonne">
        <form
          className="form_site elm_ct colonne non_slt"
          onSubmit={(e) => rechercher(e)}
        >
          <label className="label_site txt_nr gras elm_ct txt_ct">
            Nom de la carte que vous recherchez
          </label>
          <input
            className={
              tailleTel
                ? "input_site_tel blur_propal"
                : "input_site blur_propal"
            }
            onChange={(e) => myOnChange(e)}
            onClick={(e) => {
              setShowPropal(true);
            }}
            type="text"
            name="cardName"
            placeholder="Nom de la carte que vous recherchez..."
            value={mySearch.cardName}
          ></input>
          {srchPropo.length > 0 && showPropal ? (
            <div id="liste_proposition_recherche">
              {srchPropo.map((card, index) => (
                <div
                  className="proposition_recherche crs_ptr blur_propal"
                  key={index}
                  onClick={(e) => {
                    setSrchPropo([]);
                    setMySearch({ ...mySearch, cardName: card });
                  }}
                >
                  {card}
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={
              tailleTel
                ? "elm_ct pqt_search colonne"
                : "pqt_search elm_ct ligne"
            }
          >
            <div className="pqt_search_cln">
              <label className="label_site txt_nr gras elm_ct txt_ct">
                Type de carte
              </label>
              <div className="pqt_search_scd_ligne elm_ct">
                <select
                  value={mySearch.cardType}
                  className="menu_drl"
                  name="cardType"
                  onChange={(e) => myOnChange(e)}
                >
                  <option>Toutes</option>
                  <option>Créature</option>
                  <option>Enchantement</option>
                  <option>Rituel</option>
                  <option>Ephémère</option>
                  <option>Terrain</option>
                  <option>Artefact</option>
                </select>
              </div>
            </div>
            <div className="pqt_search_cln">
              <label className="label_site txt_nr gras elm_ct txt_ct">
                Couleur de la carte
              </label>
              <div id="pqt_clr" className="elm_ct ligne pqt_search_scd_ligne">
                <img
                  className="color_search crs_ptr"
                  alt="blanc"
                  src={blanc}
                  onClick={(e) => myChangeColor("W")}
                  style={{ opacity: mySearch.W ? "1" : "0.3" }}
                />
                <img
                  className="color_search crs_ptr"
                  alt="bleu"
                  src={bleu}
                  onClick={(e) => myChangeColor("U")}
                  style={{ opacity: mySearch.U ? "1" : "0.3" }}
                />
                <img
                  className="color_search crs_ptr"
                  alt="noir"
                  src={noir}
                  onClick={(e) => myChangeColor("B")}
                  style={{ opacity: mySearch.B ? "1" : "0.3" }}
                />
                <img
                  className="color_search crs_ptr"
                  alt="rouge"
                  src={rouge}
                  onClick={(e) => myChangeColor("R")}
                  style={{ opacity: mySearch.R ? "1" : "0.3" }}
                />
                <img
                  className="color_search crs_ptr"
                  alt="vert"
                  src={vert}
                  onClick={(e) => myChangeColor("G")}
                  style={{ opacity: mySearch.G ? "1" : "0.3" }}
                />
                <img
                  className="color_search crs_ptr"
                  alt="incolore"
                  src={incolore}
                  onClick={(e) => myChangeColor("I")}
                  style={{ opacity: mySearch.I ? "1" : "0.3" }}
                />
              </div>
            </div>
          </div>
          <div className="elm_ct ligne">
            <div
              className={tailleTel ? "btn_brd_tel" : "btn_brd"}
              onClick={(e) => rechercher(e)}
            >
              Recherche
            </div>
            <div
              className={tailleTel ? "btn_brd_tel" : "btn_brd"}
              onClick={(e) => reinit(e)}
            >
              Réinitialisation
            </div>
          </div>
          <button
            onClick={(e) => rechercher(e)}
            style={{ visibility: "hidden" }}
          ></button>
        </form>
        <div id="result_search" className="elm_ct">
          {result.length > 0
            ? result.map((card, index) => (
                <VignetteCarte
                  key={index}
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
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default MenuRecherche;
