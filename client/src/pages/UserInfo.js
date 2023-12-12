// Component
import Header from "../components/Header";
import Footer from "../components/Footer";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/LogIn.css";

// Autre
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function UserInfo({
  isAuth,
  setIsAuth,
  setPseudo,
  myPseudo,
  tailleOrdi,
  tailleInt1,
  tailleInt2,
  tailleTel,
  posBoardAdd,
  setPosBoardAdd,
}) {
  const [myInfo, setMyInfo] = useState({
    mail: "",
    pseudo: "",
  });

  const { mail, pseudo, password1, password2 } = myInfo;

  async function getInfo() {
    try {
      const response = await fetch("/api/auth/getInfo", {
        method: "GET",
        headers: {
          token: localStorage.token,
        },
      });

      const parseRes = await response.json();
      if (parseRes.user) {
        setMyInfo((prev) => ({
          ...prev,
          mail: parseRes.user.mail,
          pseudo: parseRes.user.pseudo,
        }));
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function deleteUser() {
    try {
      const response = await fetch("/api/auth/deleteUser", {
        method: "POST",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      console.log(parseRes);
      if (parseRes) {
        return true;
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function onSubmitForm(e) {
    e.preventDefault();
    try {
      let response = await fetch("/api/auth/modifyInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          pseudo: pseudo,
          mail: mail,
          password1: password1,
          password2: password2,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        toast.success("Modifications appliquées.");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  function myOnChange(e) {
    setMyInfo({ ...myInfo, [e.target.name]: e.target.value });
  }

  function unsubscribe(e) {
    e.preventDefault();
    if (deleteUser()) {
      localStorage.removeItem("token");
      setIsAuth(false);
      toast.success("Désinscription réussie.");
    }
  }

  return (
    <div className="fond">
      <Header
        tailleOrdi={tailleOrdi}
        tailleInt1={tailleInt1}
        tailleInt2={tailleInt2}
        tailleTel={tailleTel}
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        pseudo={myPseudo}
        isDeckPage={false}
        posBoardAdd={posBoardAdd}
        setPosBoardAdd={setPosBoardAdd}
      />
      <div className="board elm_ct">
        <form
          className="form_site elm_ct colonne non_slt"
          onSubmit={(e) => onSubmitForm(e)}
        >
          <label className="label_site txt_nr gras elm_ct">Pseudo</label>
          <input
            className={tailleTel ? "input_site_tel" : "input_site"}
            onChange={myOnChange}
            type="text"
            name="pseudo"
            placeholder="Pseudo..."
            value={myInfo.pseudo}
          ></input>

          <label className="label_site txt_nr gras elm_ct">Adresse Mail</label>
          <input
            className={tailleTel ? "input_site_tel" : "input_site"}
            onChange={myOnChange}
            type="mail"
            name="mail"
            placeholder="Adresse mail..."
            value={myInfo.mail}
          ></input>

          <label className="label_site txt_nr gras elm_ct">Mot de passe</label>
          <input
            className={tailleTel ? "input_site_tel" : "input_site"}
            onChange={myOnChange}
            type="password"
            name="password1"
            placeholder="Mot de passe..."
          ></input>

          <label className="label_site txt_nr gras elm_ct">
            Mot de passe, seconde saisie
          </label>
          <input
            className={tailleTel ? "input_site_tel" : "input_site"}
            onChange={myOnChange}
            type="password"
            name="password2"
            placeholder="Mot de passe, seconde saisie..."
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
              onClick={(e) => unsubscribe(e)}
            >
              Désinscription
            </div>
          </div>
          <button
            onClick={(e) => onSubmitForm(e)}
            style={{ visibility: "hidden" }}
          ></button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default UserInfo;
