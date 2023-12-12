// CSS
import "../styles/CSSGeneral.css";
import "../styles/BoardAdd.css";

// Autre
import { useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

function BoardAdd({ tailleTel, pseudo, posBoardAdd, setPosBoardAdd }) {
  const [deckName, setDeckName] = useState("");
  const [deckId, setDeckId] = useState("");
  const [toGo, setToGo] = useState(false);

  async function onSubmitForm(e) {
    e.preventDefault();
    if (deckName !== "") {
      try {
        const response = await fetch("/api/deck/createDeck", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pseudo: pseudo,
            name: deckName,
          }),
        });

        const parseRes = await response.json();
        setDeckId(parseRes._id);
        toast.success("Deck créé.");
        setToGo(true);
        setPosBoardAdd("100vw");
      } catch (err) {
        console.error(err.message);
      }
    } else {
      toast.error("Le nom ne peut pas être vide.");
    }
  }

  function myOnChange(e) {
    setDeckName(e.target.value);
  }

  function cancel(e) {
    e.preventDefault();
    setPosBoardAdd("100vw");
  }

  return toGo ? (
    <Navigate to={"/deck/" + deckId} />
  ) : (
    <div
      id="board_add"
      className="side_board elm_ct"
      style={{ left: posBoardAdd }}
    >
      <form
        className="form_site elm_ct colonne non_slt"
        onSubmit={(e) => onSubmitForm(e)}
      >
        <label className="label_site txt_nr gras elm_ct">Nom du deck</label>
        <input
          className={tailleTel ? "input_site_tel" : "input_site"}
          onChange={myOnChange}
          type="text"
          name="deckName"
          placeholder="Nom de votre nouveau deck..."
          value={deckName}
        ></input>

        <div className="elm_ct">
          <div
            className={tailleTel ? "btn_brd_tel" : "btn_brd"}
            onClick={(e) => onSubmitForm(e)}
          >
            Créer deck
          </div>
          <div
            className={tailleTel ? "btn_brd_tel" : "btn_brd"}
            onClick={(e) => cancel(e)}
          >
            Annuler
          </div>
        </div>
        <button
          onClick={(e) => onSubmitForm(e)}
          style={{ visibility: "hidden" }}
        ></button>
      </form>
    </div>
  );
}

export default BoardAdd;
