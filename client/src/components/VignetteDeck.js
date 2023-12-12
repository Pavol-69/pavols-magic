// CSS
import "../styles/CSSGeneral.css";
import "../styles/VignetteDeck.css";

// Images
import noCmd from "../datas/images/dos_carte.png";

// Autre
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function VignetteDeck({ setAllDecks, deck, pseudo }) {
  const [toShow, setToShow] = useState(false);

  async function SupprimerDeck() {
    // await response of fetch call
    let response = await fetch("/api/deck/deleteDeck", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        deckId: deck._id,
      }),
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    // only proceed once second promise is resolved
    setAllDecks(parseRes);
    toast.success("Deck supprimé");
  }

  return (
    <div
      className="vgt_deck_ctn elm_ct non_slt"
      onMouseEnter={(e) => {
        setToShow(true);
      }}
      onMouseLeave={(e) => {
        setToShow(false);
      }}
    >
      <div className="img_deck">
        <img
          src={deck.commander.length > 0 ? deck.commander[0].imageUrl : noCmd}
        />
      </div>
      <div
        className="menu_vgt_deck"
        style={{ bottom: toShow ? "0px" : "-50px" }}
      >
        <div className="nom_vbt_deck elm_ct txt_1_3 txt_blc">{deck.name}</div>
        <div className="pqt_btn_vbt_deck">
          <Link
            style={{ right: pseudo === deck.pseudo ? "50%" : "0px" }}
            className="btn_opn_deck elm_ct txt_1_3 txt_blc no_udl tst05"
            to={"/deck/" + deck._id}
          >
            Ouvrir
          </Link>
          {pseudo === deck.pseudo ? (
            <div
              className="btn_dlt_deck elm_ct txt_1_3 txt_blc tst05 crs_ptr"
              onClick={(e) => SupprimerDeck()}
            >
              Supprimer
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default VignetteDeck;
