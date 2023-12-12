// Component
import Header from "../components/Header";
import Footer from "../components/Footer";
import VignetteDeck from "../components/VignetteDeck";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/Accueil.css";

// Autre
import { useState, useEffect } from "react";

function Accueil({
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
  const [allDecks, setAllDecks] = useState([]);
  const [myAllDecks, setMyAllDecks] = useState([]);

  async function getAllDecks() {
    // await response of fetch call
    let response = await fetch("/api/deck/getAllDecks", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        pseudo: pseudo,
      },
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    // only proceed once second promise is resolved
    setAllDecks(parseRes.decks);
    setMyAllDecks(parseRes.myDecks);
  }

  useEffect(() => {
    getAllDecks();
  }, []);

  return (
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
        isDeckPage={false}
        posBoardAdd={posBoardAdd}
        setPosBoardAdd={setPosBoardAdd}
      />
      <div className="board">
        <div id="all_decks" className="elm_ct colonne">
          {myAllDecks.length > 0 && isAuth ? (
            <div className="elm_ct colonne">
              <div className="titre_board elm_ct gras txt_nr txt_2 crs_ptr">
                Mes Decks
              </div>
              <div className="elm_ct ligne">
                {myAllDecks.map((deck, index) => (
                  <VignetteDeck
                    key={index}
                    deck={deck}
                    pseudo={pseudo}
                    setAllDecks={setAllDecks}
                  />
                ))}
              </div>
            </div>
          ) : null}
          {allDecks.length > 0 ? (
            <div className="elm_ct colonne">
              <div className="titre_board elm_ct gras txt_nr txt_2 crs_ptr">
                Tous les Decks
              </div>
              <div className="elm_ct ligne">
                {allDecks.map((deck, index) => (
                  <VignetteDeck
                    key={index}
                    deck={deck}
                    pseudo={pseudo}
                    setAllDecks={setAllDecks}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Accueil;
