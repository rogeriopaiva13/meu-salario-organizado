import React, { useState, useEffect } from "react";

import {
  FaHome,
  FaWallet,
  FaBullseye,
  FaTrophy,
  FaUser,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHistory,
} from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth, provider } from "./firebase";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const cores = {
    fundo: darkMode ? "#0f172a" : "#f3f7ff",
    card: darkMode ? "#111827" : "#ffffff",
    cardSuave: darkMode ? "#1f2937" : "#f7faff",
    texto: darkMode ? "#f9fafb" : "#111827",
    subtexto: darkMode ? "#cbd5e1" : "#6b7280",
    borda: darkMode ? "#334155" : "#dde7ff",
    input: darkMode ? "#0b1220" : "#f9fbff",
    inputBorder: darkMode ? "#334155" : "#d9e2f3",
  };

  const [fotoPerfil, setFotoPerfil] = useState(
    localStorage.getItem("fotoPerfil") || ""
  );

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || ""
  );

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(
        user
          ? {
              nome: user.displayName,
              email: user.email,
              foto: user.photoURL,
            }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("fotoPerfil", fotoPerfil);
  }, [fotoPerfil]);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("salario", salario);
  }, [salario]);

  useEffect(() => {
    localStorage.setItem("extra", extra);
  }, [extra]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

  useEffect(() => {
    localStorage.setItem("xp", String(xp));
  }, [xp]);

  const fotoAtual = fotoPerfil || usuario?.foto || "";

  function escolherFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => setFotoPerfil(leitor.result);

    leitor.readAsDataURL(arquivo);
  }

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const receitas =
    (Number(salario) || 0) + (Number(extra) || 0);

  const saidas = 2400;

  const saldo =
    receitas - saidas - (Number(meta) || 0);

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;

  const statusLimpo =
    saldo < 0
      ? "Mês no vermelho"
      : saldo <= 300
      ? "Mês apertado"
      : "Salário sob controle";

  async function loginGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Não foi possível entrar com Google.");
    }
  }

  async function logoutGoogle() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      alert("Erro ao sair da conta.");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: `1px solid ${cores.inputBorder}`,
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: cores.input,
    color: cores.texto,
  };

  const card = {
    background: cores.card,
    color: cores.texto,
    padding: "22px",
    borderRadius: "30px",
    marginBottom: "18px",
    boxShadow: darkMode
      ? "0 16px 40px rgba(0,0,0,0.25)"
      : "0 16px 40px rgba(13,71,161,0.10)",
    border: `1px solid ${cores.borda}`,
  };

  const navItem = (id, icon, label) => (
    <button
      onClick={() => setTela(id)}
      style={{
        border: "none",
        background:
          tela === id ? "#0D47A1" : "transparent",
        color:
          tela === id ? "white" : cores.subtexto,
        borderRadius: "22px",
        padding: "10px 12px",
        minWidth: "64px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          lineHeight: "20px",
        }}
      >
        {icon}
      </div>

      <div style={{ marginTop: "4px" }}>
        {label}
      </div>
    </button>
  );

  const AppLogo = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "end",
          gap: "4px",
          height: "48px",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "22px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "34px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "46px",
            background: "white",
            borderRadius: "5px",
          }}
        />

        <div
          style={{
            width: "10px",
            height: "28px",
            background: "#FDD835",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ lineHeight: "32px" }}>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "900",
            color: "white",
          }}
        >
          Meu Salário
        </div>

        <div
          style={{
            fontSize: "27px",
            fontWeight: "900",
            color: "#FDD835",
          }}
        >
          Organizado
        </div>
      </div>
    </div>
  );
  const AvatarPerfil = () => (
    <label style={{ cursor: "pointer" }}>
      <input
        type="file"
        accept="image/*"
        onChange={escolherFoto}
        style={{ display: "none" }}
      />

      {fotoAtual ? (
        <img
          src={fotoAtual}
          alt="foto"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "3px solid white",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "3px solid white",
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          👤
        </div>
      )}
    </label>
  );

  if (loading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(135deg,#0D47A1,#42A5F5)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <AppLogo />

          <p
            style={{
              color: "#FDD835",
              marginTop: "18px",
            }}
          >
            Organize hoje, realize amanhã
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: cores.fundo,
        minHeight: "100vh",
        paddingBottom: "125px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(160deg,#003c96 0%,#0057c8 48%,#0D47A1 100%)",
          color: "white",
          padding: "26px 22px 36px",
          borderBottomLeftRadius: "42px",
          borderBottomRightRadius: "42px",
          boxShadow:
            "0 18px 45px rgba(13,71,161,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "26px",
          }}
        >
          <AppLogo />
          <AvatarPerfil />
        </div>

        <h1
          style={{
            fontSize: "34px",
            margin: 0,
            fontWeight: "900",
          }}
        >
          👋 Olá
          {usuario?.nome
            ? `, ${usuario.nome}`
            : nome
            ? `, ${nome}`
            : ""}
          !
        </h1>

        <p
          style={{
            fontSize: "17px",
            opacity: 0.95,
            marginTop: "8px",
          }}
        >
          Vamos organizar seu mês?
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "18px",
            maxWidth: "430px",
          }}
        >
          <button
            onClick={() =>
              setOcultarValores(!ocultarValores)
            }
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {ocultarValores
              ? "👁 Mostrar"
              : "🙈 Ocultar"}
          </button>

          {!usuario ? (
            <button
              onClick={loginGoogle}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "16px",
                border: "none",
                background: "white",
                color: "#0D47A1",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              🔐 Google
            </button>
          ) : (
            <button
              onClick={logoutGoogle}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "16px",
                border: "none",
                background: "#d32f2f",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              Sair
            </button>
          )}

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "16px",
              border: "none",
              background: darkMode
                ? "#FDD835"
                : "#111827",
              color: darkMode
                ? "#111827"
                : "white",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {darkMode
              ? "☀️ Light"
              : "🌙 Dark"}
          </button>
        </div>
        <div
          style={{
            marginTop: "26px",
            background: "rgba(0,42,120,0.32)",
            borderRadius: "28px",
            padding: "18px",
            border:
              "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Saldo livre após meta ⓘ
              </p>

              <h1
                style={{
                  color: "#FDD835",
                  fontSize: "30px",
                  margin: "10px 0 10px",
                  fontWeight: "900",
                }}
              >
                {moeda(saldo)}
              </h1>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background:
                    "rgba(255,255,255,0.12)",
                  padding: "8px 13px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  color: "#d9ff7a",
                  fontSize: "13px",
                }}
              >
                ✅ {statusLimpo}
              </div>
            </div>

            <div
              style={{
                width: "92px",
                height: "92px",
                minWidth: "92px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#8cff4f 0% 12%, #60a5fa 12% " +
                  progresso +
                  "%, rgba(255,255,255,0.15) " +
                  progresso +
                  "% 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "#0D47A1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    fontSize: "23px",
                  }}
                >
                  {progresso.toFixed(0)}%
                </span>

                <span
                  style={{
                    fontSize: "9px",
                  }}
                >
                  usado
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px" }}>
                ⬇️
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#86efac",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                Entradas
              </div>

              <div
                style={{
                  fontSize: "15px",
                  color: "white",
                  fontWeight: "900",
                  marginTop: "6px",
                }}
              >
                {moeda(receitas)}
              </div>
            </div>

            <div
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px" }}>
                ⬆️
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#fca5a5",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                Saídas
              </div>

              <div
                style={{
                  fontSize: "15px",
                  color: "white",
                  fontWeight: "900",
                  marginTop: "6px",
                }}
              >
                {moeda(saidas)}
              </div>
            </div>

            <div
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px" }}>
                ⭐
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#FDD835",
                  fontWeight: "bold",
                  marginTop: "4px",
                }}
              >
                Iniciante
              </div>

              <div
                style={{
                  fontSize: "15px",
                  color: "white",
                  fontWeight: "900",
                  marginTop: "6px",
                }}
              >
                {xp} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={card}>
          <h2>💰 Entradas</h2>

          <input
            style={inputStyle}
            value={salario}
            onChange={(e) =>
              setSalario(e.target.value)
            }
            placeholder="Salário"
          />

          <div style={{ height: "12px" }} />

          <input
            style={inputStyle}
            value={extra}
            onChange={(e) =>
              setExtra(e.target.value)
            }
            placeholder="Renda extra"
          />
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "8px",
          right: "8px",
          background: darkMode
            ? "rgba(17,24,39,0.98)"
            : "rgba(255,255,255,0.98)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "28px",
          boxShadow:
            "0 -8px 30px rgba(0,0,0,0.12)",
          border: `1px solid ${cores.borda}`,
          zIndex: 999,
          overflowX: "auto",
        }}
      >
        {navItem("inicio", <FaHome />, "Início")}
        {navItem(
          "entradas",
          <FaMoneyBillWave />,
          "Entradas"
        )}
        {navItem("gastos", <FaWallet />, "Gastos")}
        {navItem(
          "contas",
          <FaFileInvoiceDollar />,
          "Contas"
        )}
        {navItem("metas", <FaBullseye />, "Metas")}
        {navItem(
          "historico",
          <FaHistory />,
          "Hist."
        )}
        {navItem(
          "conquistas",
          <FaTrophy />,
          "Conq."
        )}
        {navItem("perfil", <FaUser />, "Perfil")}
      </div>
    </div>
  );
}
