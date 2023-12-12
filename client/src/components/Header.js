// CSS
import "../styles/CSSGeneral.css";
import "../styles/Header.css";

// Images
import home_icon from "../datas/icones/Logo.png";

// Autre
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import {
  faChevronDown,
  faUser,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function Header({
  isAuth,
  setIsAuth,
  pseudo,
  setPseudo,
  tailleOrdi,
  tailleInt1,
  tailleInt2,
  tailleTel,
  isDeckPage,
  posBoardAdd,
  setPosBoardAdd,
  setToShow,
  setMenuRch,
  setByType,
  setByCmc,
  setByCat,
  typeList,
  cmcList,
  catList,
  setChsnList,
}) {
  const [shkFlt, setShkFlt] = useState(false);
  const [shkUser, setShkUser] = useState(false);
  const [menuFlt, setMenuFlt] = useState(false);
  const [menuUser, setMenuUser] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
    setPseudo("");
    toast.info("Déconnecté(e).");
  };

  function affichageMenuClsm(e) {
    if (menuFlt) {
      setMenuFlt(false);
    } else {
      setMenuFlt(true);
    }
  }

  function affichageMenuUser(e) {
    if (menuUser) {
      setMenuUser(false);
    } else {
      setMenuUser(true);
    }
  }

  function searchWants(e) {
    setToShow(true);
    setMenuRch(true);
  }

  function addWants(e) {
    setPosBoardAdd("0px");
  }

  return (
    <header
      className="elm_ct non_slt gras"
      style={{ paddingRight: tailleTel ? "83px" : "143px" }}
    >
      <Link id="btn_home" to="/">
        <img alt="home" className="lmt_img" src={home_icon}></img>
      </Link>
      {isAuth ? (
        tailleTel ? (
          <div
            className="crs_ptr hd_icon"
            onClick={(e) => {
              addWants(e);
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "var(--main-color-blc)" }}
              size="lg"
            />
          </div>
        ) : (
          <div
            className="btn_hd elm_ct tst05 crs_ptr"
            onClick={(e) => {
              addWants(e);
            }}
          >
            Ajouter Deck
          </div>
        )
      ) : null}
      {isDeckPage ? (
        <div className="ligne elm_ct" style={{ height: "100%" }}>
          {tailleTel ? (
            <div className="crs_ptr hd_icon">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "var(--main-color-blc)" }}
                size="lg"
                onClick={(e) => {
                  searchWants(e);
                }}
              />
            </div>
          ) : (
            <div
              className="btn_hd elm_ct tst05 crs_ptr"
              onClick={(e) => {
                searchWants(e);
              }}
            >
              Recherche
            </div>
          )}
          <div
            id="pqt_btn_cls"
            className="btn_hd elm_ct tst05 ligne crs_ptr"
            onMouseEnter={() => setShkFlt(true)}
            onMouseLeave={() => setShkFlt(false)}
            onClick={(e) => {
              affichageMenuClsm(e);
            }}
          >
            <div className="">Classer par</div>
            <FontAwesomeIcon
              icon={faChevronDown}
              bounce={shkFlt}
              size="lg"
              style={{
                color: "var(--main-color-blc)",
                marginLeft: "7px",
              }}
            />
            <div
              className="elm_ct colonne tst05"
              id="id_menu_clsm"
              style={{
                top: menuFlt ? "55px" : "-180px",
                opacity: menuFlt ? "1" : "0",
              }}
              onBlur={(e) => {
                setMenuFlt(false);
              }}
            >
              <div
                onClick={(e) => {
                  setByType(true);
                  setByCmc(false);
                  setByCat(false);
                  setChsnList(typeList);
                }}
                className="btn_menu_drl elm_ct tst05"
                to="/"
              >
                Type
              </div>
              <div
                onClick={(e) => {
                  setByType(false);
                  setByCmc(false);
                  setByCat(true);
                  setChsnList(catList);
                }}
                className="btn_menu_drl elm_ct tst05"
              >
                Catégorie
              </div>
              <div
                onClick={(e) => {
                  setByType(false);
                  setByCmc(true);
                  setByCat(false);
                  setChsnList(cmcList);
                }}
                className="btn_menu_drl elm_ct tst05"
              >
                CMC
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div id="pqt_btn_ins" className="elm_ct ligne">
        {isAuth ? (
          <div
            className="ligne elm_ct crs_ptr"
            onMouseEnter={() => setShkUser(true)}
            onMouseLeave={() => setShkUser(false)}
            onClick={(e) => {
              affichageMenuUser(e);
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "var(--main-color-blc)", margin: "8px" }}
              size="lg"
            />

            {tailleTel ? null : <div className="txt_blc">{pseudo}</div>}

            <FontAwesomeIcon
              icon={faChevronDown}
              bounce={shkUser}
              size="lg"
              style={{ color: "var(--main-color-blc)", marginLeft: "7px" }}
            />
          </div>
        ) : (
          <div className="ligne elm_ct" style={{ height: "100%" }}>
            <Link className="btn_hd elm_ct tst05 crs_ptr no_udl" to="/LogIn">
              Connexion
            </Link>
            <Link className="btn_hd elm_ct tst05 crs_ptr no_udl" to="/SignIn">
              Inscription
            </Link>
          </div>
        )}

        <div
          className="elm_ct colonne tst05"
          id="id_menu_user"
          style={{
            top: menuUser ? "55px" : "-80px",
            opacity: menuUser ? "1" : "0",
          }}
          onBlur={(e) => {
            setMenuUser(false);
          }}
        >
          <Link className="btn_menu_drl elm_ct tst05 no_udl" to="/UserInfo">
            Mes informations
          </Link>
          <Link
            onClick={(e) => logout(e)}
            className="btn_menu_drl elm_ct tst05 no_udl"
            to="/"
          >
            Déconnexion
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
