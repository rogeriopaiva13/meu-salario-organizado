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
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, provider } from "./firebase";
import Header from "./components/Header";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

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

  const [nomeMeta, setNomeMeta] = useState(
    localStorage.getItem("nomeMeta") || "Meu objetivo"
  );

  const [valorMetaTotal, setValorMetaTotal] = useState(
    localStorage.getItem("valorMetaTotal") || "30000"
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historicoFinanceiro")) || []
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

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
    localStorage.setItem("nomeMeta", nomeMeta);
  }, [nomeMeta]);

  useEffect(() => {
    localStorage.setItem(
      "valorMetaTotal",
      valorMetaTotal
    );
  }, [valorMetaTotal]);

  useEffect(() => {
    localStorage.setItem("xp", String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "gastos",
      JSON.stringify(gastos)
    );
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem(
      "contasLista",
      JSON.stringify(contas)
    );
  }, [contas]);

  useEffect(() => {
    localStorage.setItem(
      "historicoFinanceiro",
      JSON.stringify(historico)
    );
  }, [historico]);

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalGastos = gastos.reduce(
    (acc, item) =>
      acc + Number(item.valor || 0),
    0
  );

  const totalContas = contas.reduce(
    (acc, item) =>
      acc + Number(item.valor || 0),
    0
  );

  const saidas = totalGastos + totalContas;

  const saldo =
    receitas -
    saidas -
    (Number(meta) || 0);

  let nivel = "🪙 Estagiário Financeiro";

  if (xp >= 3000) {
    nivel = "💎 Lenda Financeira";
  } else if (xp >= 2000) {
    nivel = "🚀 Magnata";
  } else if (xp >= 1000) {
    nivel = "👑 CEO das Finanças";
  } else if (xp >= 500) {
    nivel = "📈 Analista Financeiro";
  }

  const progressoXp = Math.min(
    (xp / 3000) * 100,
    100
  );

  async function loginGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Erro ao entrar com Google.");
    }
  }

  async function logoutGoogle() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      alert("Erro ao sair.");
    }
  }

  function ganharXp(valor) {
    setXp((prev) => prev + valor);
  }

  async function adicionarGasto() {
    if (!nomeGasto || !valorGasto) return;

    const novo = {
      nome: nomeGasto,
      valor: Number(valorGasto),
    };

    setGastos([...gastos, novo]);

    ganharXp(5);

    try {
      await addDoc(collection(db, "gastos"), {
        ...novo,
        usuario:
          usuario?.nome || nome || "Usuário",
        email: usuario?.email || "",
        criadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }

    setNomeGasto("");
    setValorGasto("");
  }

  function iniciarNovoMes() {
    const novoHistorico = {
      mes: new Date().toLocaleDateString(
        "pt-BR",
        {
          month: "long",
          year: "numeric",
        }
      ),

      entradas: receitas,
      gastos: totalGastos,
      contas: totalContas,
      saldo,
    };

    setHistorico([
      novoHistorico,
      ...historico,
    ]);

    setGastos([]);
    setContas([]);
    setSalario("");
    setExtra("");

    localStorage.removeItem("gastos");
    localStorage.removeItem("contasLista");
  }

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";

    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "30px",
    marginBottom: "18px",
    boxShadow:
      "0 16px 40px rgba(13,71,161,0.10)",
  };

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const primaryButton = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: "none",
    background:
      "linear-gradient(135deg,#0D47A1,#1976D2)",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
  };

  const navItem = (id, icon, label) => (
    <button
      onClick={() => setTela(id)}
      style={{
        border: "none",
        background:
          tela === id
            ? "#0D47A1"
            : "transparent",
        color:
          tela === id
            ? "white"
            : "#6b7280",
        borderRadius: "22px",
        padding: "10px 12px",
        minWidth: "64px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        {icon}
      </div>

      <div style={{ marginTop: "4px" }}>
        {label}
      </div>
    </button>
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
        }}
      >
        <h1>Meu Salário Organizado</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f7ff",
        minHeight: "100vh",
        paddingBottom: "125px",
        fontFamily: "Arial",
      }}
    >
      <Header
        usuario={usuario}
        nome={nome}
        saldo={saldo}
        receitas={receitas}
        saidas={saidas}
        xp={xp}
        nivel={nivel}
        progressoXp={progressoXp}
        ocultarValores={ocultarValores}
        setOcultarValores={
          setOcultarValores
        }
        loginGoogle={loginGoogle}
        logoutGoogle={logoutGoogle}
      />

      <div style={{ padding: "20px" }}>
        {tela === "inicio" && (
          <div style={card}>
            <h2>🏠 Início</h2>

            <p>Saldo atual:</p>

            <h1>{moeda(saldo)}</h1>
          </div>
        )}

        {tela === "entradas" && (
          <div style={card}>
            <h2>💰 Entradas</h2>

            <input
              style={inputStyle}
              placeholder="Salário"
              value={salario}
              onChange={(e) =>
                setSalario(e.target.value)
              }
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              placeholder="Extra"
              value={extra}
              onChange={(e) =>
                setExtra(e.target.value)
              }
            />
          </div>
        )}

        {tela === "gastos" && (
          <div style={card}>
            <h2>💸 Gastos</h2>

            <input
              style={inputStyle}
              placeholder="Nome do gasto"
              value={nomeGasto}
              onChange={(e) =>
                setNomeGasto(
                  e.target.value
                )
              }
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              placeholder="Valor"
              value={valorGasto}
              onChange={(e) =>
                setValorGasto(
                  e.target.value
                )
              }
            />

            <div style={{ height: "16px" }} />

            <button
              onClick={adicionarGasto}
              style={primaryButton}
            >
              ➕ Adicionar gasto
            </button>

            <div
              style={{ marginTop: "20px" }}
            >
              {gastos.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      background:
                        "#f8fbff",
                      borderRadius:
                        "16px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    <strong>
                      {item.nome}
                    </strong>

                    <p>
                      {moeda(
                        item.valor
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {tela === "metas" && (
          <div style={card}>
            <h2>🎯 Metas</h2>

            <input
              style={inputStyle}
              placeholder="Nome da meta"
              value={nomeMeta}
              onChange={(e) =>
                setNomeMeta(
                  e.target.value
                )
              }
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              placeholder="Valor total"
              value={valorMetaTotal}
              onChange={(e) =>
                setValorMetaTotal(
                  e.target.value
                )
              }
            />
          </div>
        )}

        {tela === "historico" && (
          <div style={card}>
            <h2>📈 Histórico</h2>

            {historico.length === 0 ? (
              <p>
                Nenhum histórico ainda.
              </p>
            ) : (
              historico.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        "#f8fbff",
                      padding: "12px",
                      borderRadius:
                        "16px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    <strong>
                      {item.mes}
                    </strong>

                    <p>
                      Saldo:{" "}
                      {moeda(
                        item.saldo
                      )}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        )}

        {tela === "perfil" && (
          <div style={card}>
            <h2>👤 Perfil</h2>

            <input
              style={inputStyle}
              placeholder="Seu nome"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
            />

            <div style={{ height: "16px" }} />

            <button
              onClick={iniciarNovoMes}
              style={{
                ...primaryButton,
                background: "#d32f2f",
              }}
            >
              🔄 Iniciar novo mês
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "8px",
          right: "8px",
          background:
            "rgba(255,255,255,0.98)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "28px",
          overflowX: "auto",
        }}
      >
        {navItem(
          "inicio",
          <FaHome />,
          "Início"
        )}

        {navItem(
          "entradas",
          <FaMoneyBillWave />,
          "Entradas"
        )}

        {navItem(
          "gastos",
          <FaWallet />,
          "Gastos"
        )}

        {navItem(
          "contas",
          <FaFileInvoiceDollar />,
          "Contas"
        )}

        {navItem(
          "metas",
          <FaBullseye />,
          "Metas"
        )}

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

        {navItem(
          "perfil",
          <FaUser />,
          "Perfil"
        )}
      </div>
    </div>
  );
}
