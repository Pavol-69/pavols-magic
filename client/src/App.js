// Components
import Accueil from "./pages/Accueil";
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";
import UserInfo from "./pages/UserInfo";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import BoardAdd from "./components/BoardAdd";
import Deck from "./pages/Deck";

// Autre
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";

function App() {
  const tailleOrdi = useMediaQuery({ query: "(min-width: 1475px)" });
  const tailleInt1 = useMediaQuery({
    query: "(min-width: 1275px)",
  });
  const tailleInt2 = useMediaQuery({
    query: "(min-width: 851px)",
  });
  const tailleTel = useMediaQuery({ query: "(max-width: 850px)" });

  const [isAuth, setIsAuth] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [posBoardAdd, setPosBoardAdd] = useState("100vw");

  async function isVerify() {
    try {
      const response = await fetch("/api/auth/is-verified", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      if (parseRes.isAuth === true) {
        setIsAuth(true);

        setPseudo(parseRes.user.pseudo);
      }

      setIsLoaded(true);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isVerify();
  }, []);

  if (isLoaded) {
    return (
      <React.StrictMode>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Accueil
                  tailleOrdi={tailleOrdi}
                  tailleInt1={tailleInt1}
                  tailleInt2={tailleInt2}
                  tailleTel={tailleTel}
                  isAuth={isAuth}
                  setIsAuth={setIsAuth}
                  pseudo={pseudo}
                  setPseudo={setPseudo}
                  posBoardAdd={posBoardAdd}
                  setPosBoardAdd={setPosBoardAdd}
                />
              }
            />
            <Route
              path="/deck/:deckId"
              element={
                <Deck
                  tailleOrdi={tailleOrdi}
                  tailleInt1={tailleInt1}
                  tailleInt2={tailleInt2}
                  tailleTel={tailleTel}
                  isAuth={isAuth}
                  setIsAuth={setIsAuth}
                  pseudo={pseudo}
                  setPseudo={setPseudo}
                  posBoardAdd={posBoardAdd}
                  setPosBoardAdd={setPosBoardAdd}
                />
              }
            />
            <Route path="/UserInfo" element={<PrivateRoute isAuth={isAuth} />}>
              <Route
                path="/UserInfo"
                element={
                  <UserInfo
                    tailleOrdi={tailleOrdi}
                    tailleInt1={tailleInt1}
                    tailleInt2={tailleInt2}
                    tailleTel={tailleTel}
                    isAuth={isAuth}
                    setIsAuth={setIsAuth}
                    setPseudo={setPseudo}
                    myPseudo={pseudo}
                    posBoardAdd={posBoardAdd}
                    setPosBoardAdd={setPosBoardAdd}
                  />
                }
              ></Route>
            </Route>
            <Route path="/LogIn" element={<PublicRoute isAuth={isAuth} />}>
              <Route
                path="/LogIn"
                element={
                  <LogIn
                    tailleOrdi={tailleOrdi}
                    tailleInt1={tailleInt1}
                    tailleInt2={tailleInt2}
                    tailleTel={tailleTel}
                    isAuth={isAuth}
                    setIsAuth={setIsAuth}
                    setPseudo={setPseudo}
                  />
                }
              ></Route>
            </Route>
            <Route path="/SignIn" element={<PublicRoute isAuth={isAuth} />}>
              <Route
                path="/SignIn"
                element={
                  <SignIn
                    tailleOrdi={tailleOrdi}
                    tailleInt1={tailleInt1}
                    tailleInt2={tailleInt2}
                    tailleTel={tailleTel}
                    isAuth={isAuth}
                    setIsAuth={setIsAuth}
                    setPseudo={setPseudo}
                  />
                }
              ></Route>
            </Route>
          </Routes>
          <BoardAdd
            tailleTel={tailleTel}
            pseudo={pseudo}
            posBoardAdd={posBoardAdd}
            setPosBoardAdd={setPosBoardAdd}
          />
        </Router>

        <ToastContainer />
      </React.StrictMode>
    );
  } else {
    return null;
  }
}

export default App;
