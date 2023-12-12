// Component
import Header from "../components/Header";
import Footer from "../components/Footer";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/LogIn.css";

// Autre
import React, { useState } from "react";
import { toast } from "react-toastify";

function SignIn({
  isAuth,
  setIsAuth,
  setPseudo,
  tailleOrdi,
  tailleInt1,
  tailleInt2,
  tailleTel,
}) {
  const [myInfo, setMyInfo] = useState({
    mail: "",
    pseudo: "",
    password1: "",
    password2: "",
  });

  const { mail, pseudo, password1, password2 } = myInfo;

  async function onSubmitForm(e) {
    e.preventDefault();
    try {
      let response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo: pseudo,
          mail: mail,
          password1: password1,
          password2: password2,
        }),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setIsAuth(true);
        setPseudo(parseRes.user.pseudo);
        toast.success("Inscription réussie.");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  function myOnChange(e) {
    setMyInfo({ ...myInfo, [e.target.name]: e.target.value });
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
        isDeckPage={false}
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
          ></input>

          <label className="label_site txt_nr gras elm_ct">Adresse Mail</label>
          <input
            className={tailleTel ? "input_site_tel" : "input_site"}
            onChange={myOnChange}
            type="mail"
            name="mail"
            placeholder="Adresse mail..."
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
          <div
            className={tailleTel ? "btn_brd_tel" : "btn_brd"}
            onClick={(e) => onSubmitForm(e)}
          >
            Inscription
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

export default SignIn;
