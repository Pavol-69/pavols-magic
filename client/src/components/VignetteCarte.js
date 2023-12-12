// CSS
import "../styles/CSSGeneral.css";
import "../styles/VignetteCarte.css";

// Autre
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function VignetteCarte({
  card,
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
  const [qtyCard, setQtyCard] = useState(0);

  async function addCard(e) {
    e.preventDefault();
    // await response of fetch call
    let response = await fetch("/api/deck/addCard", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        deckId: deck._id,
        card: card,
        category: "Aucune Catégorie",
      }),
    });
    // only proceed once promise is resolved
    let parseRes = await response.json();

    if (parseRes.deck) {
      setDeck(parseRes.deck);
      setQtyCard(parseRes.qtyCard);
      setTypeList(parseRes.myTriType);
      setCmcList(parseRes.myTriCmc);
      setCatList(parseRes.myTriCat);
      if (byType) {
        setChsnList(parseRes.myTriType);
      }
      if (byCmc) {
        setChsnList(parseRes.myTriCmc);
      }
      if (byCat) {
        setChsnList(parseRes.myTriCat);
      }
    } else {
      toast.error(parseRes.message);
    }
  }

  async function rmvCard(e) {
    e.preventDefault();
    // await response of fetch call
    let response = await fetch("/api/deck/deleteCard", {
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
      setQtyCard(parseRes.qtyCard);
      setTypeList(parseRes.myTriType);
      setCmcList(parseRes.myTriCmc);
      setCatList(parseRes.myTriCat);
      setCommander(parseRes.commander);
      if (byType) {
        setChsnList(parseRes.myTriType);
      }
      if (byCmc) {
        setChsnList(parseRes.myTriCmc);
      }
      if (byCat) {
        setChsnList(parseRes.myTriCat);
      }
    } else {
      toast.error(parseRes.message);
    }
  }

  useEffect(() => {
    seekInitNb();
  }, []);

  function seekInitNb() {
    for (let i = 0; i < deck.cardList.length; i++) {
      if (deck.cardList[i][0].name === card.name) {
        setQtyCard(deck.cardList[i][1]);
      }
    }
  }

  return (
    <div id={card.id} className="vgt_card elm_ct">
      <div className="img_card">
        <img
          onDragStart={(event) => event.preventDefault()}
          className="lmt_img"
          alt="carte"
          src={card.imageUrl}
        />
      </div>
      <div className="pqt_btn_vgt gras non_slt">
        <div
          onClick={(e) => addCard(e)}
          className="carre_vgt btn_vgt txt_2 elm_ct txt_ct tst05 crs_ptr"
        >
          +
        </div>
        <div className="carre_vgt nb_card_vgt txt_1_6 elm_ct tst05">
          {qtyCard}
        </div>
        <div
          onClick={(e) => rmvCard(e)}
          className="carre_vgt btn_vgt txt_2 elm_ct txt_ct tst05 crs_ptr"
        >
          -
        </div>
      </div>
    </div>
  );
}

export default VignetteCarte;
