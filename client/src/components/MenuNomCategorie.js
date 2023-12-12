// CSS
import "../styles/CSSGeneral.css";
import "../styles/MenuNomCategorie.css";

// Autre
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function MenuNomCategorie({
  setToShow,
  tailleTel,
  deck,
  setDeck,
  pseudo,
  catName,
  setChgCatName,
  setCatList,
  setChsnList,
}) {
  const [name, setName] = useState(catName);

  async function onSubmitForm(e) {
    e.preventDefault();
    let response = await fetch("/api/deck/changeCategoryName", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        deckId: deck._id,
        newName: name,
        oldName: catName,
      }),
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();
    if (parseRes.deck) {
      setDeck(parseRes.deck);
      setCatList(parseRes.myTriCat);
      setChsnList(parseRes.myTriCat);
      setToShow(false);
      setChgCatName(false);
    } else {
      toast.error(parseRes.message);
    }
  }

  function annuler(e) {
    e.preventDefault();
    setToShow(false);
    setChgCatName(false);
  }

  return (
    <div className="name_menu elm_ct">
      <form
        className="form_site elm_ct colonne non_slt"
        onSubmit={(e) => onSubmitForm(e)}
      >
        <label className="label_site txt_nr gras elm_ct">
          Nom de la catégorie
        </label>
        <input
          className={tailleTel ? "input_site_tel" : "input_site"}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          name="deckName"
          placeholder="Nom de catégorie..."
          value={name}
        ></input>
        <div className="elm_ct ligne">
          <div
            className={tailleTel ? "btn_brd_tel" : "btn_brd"}
            onClick={(e) => onSubmitForm(e)}
          >
            Modifier
          </div>
          <div
            className={tailleTel ? "btn_brd_tel" : "btn_brd"}
            onClick={(e) => annuler(e)}
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

export default MenuNomCategorie;
