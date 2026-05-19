import React, { useState, useEffect } from "react";
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

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || ""
  );

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  // META NOVA
  const [nomeMeta, setNomeMeta] = useState(
    localStorage.getItem("nomeMeta") || "Meu objetivo"
  );

  const [valorMetaTotal, setValorMetaTotal] = useState(
    localStorage.getItem("valorMetaTotal") || "10000"
  );

  const [metaMensal, setMetaMensal] = useState(
    localStorage.getItem("metaMensal") || "500"
  );

  const [valorGuardado, setValorGuardado] = useState(
    localStorage.getItem("valorGuardado") || "0"
  );

  // GASTOS
  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] =
    useState("Alimentação");

  // CONTAS
  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] =
    useState("Luz");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  // CATEGORIAS
  const categorias = {
    Alimentação: {
      icone: "🍔",
      cor: "#fff3e0",
      texto: "#e65100",
    },
    Transporte: {
      icone: "🚗",
      cor: "#e3f2fd",
      texto: "#0D47A1",
    },
    Casa: {
      icone: "🏠",
      cor: "#fff8e1",
      texto: "#8a6d00",
    },
    Saúde: {
      icone: "💊",
      cor: "#e8f5e9",
      texto: "#1b5e20",
    },
    Lazer: {
      icone: "🎮",
      cor: "#f3e5f5",
      texto: "#6a1b9a",
    },
    Outros: {
      icone: "🛒",
      cor: "#e0f2f1",
      texto: "#00695c",
    },
  };

  const categoriasContas = {
    Luz: "💡",
    Água: "💧",
    Internet: "🌐",
    Aluguel: "🏠",
    Telefone: "📱",
    Outros: "📄",
  };

  // LOADING
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  // LOGIN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({
          nome: user.displayName,
          email: user.email,
          foto: user.photoURL,
        });
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // LOCAL STORAGE
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
    localStorage.setItem("nomeMeta", nomeMeta);
  }, [nomeMeta]);

  useEffect(() => {
    localStorage.setItem(
      "valorMetaTotal",
      valorMetaTotal
    );
  }, [valorMetaTotal]);

  useEffect(() => {
    localStorage.setItem(
      "metaMensal",
      metaMensal
    );
  }, [metaMensal]);

  useEffect(() => {
    localStorage.setItem(
      "valorGuardado",
      valorGuardado
    );
  }, [valorGuardado]);

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

  // MOEDA
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

  // CÁLCULOS
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
    (Number(metaMensal) || 0);

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;

  // META
  const progressoMeta =
    (Number(valorGuardado) /
      Number(valorMetaTotal || 1)) *
    100;

  const faltaMeta =
    Number(valorMetaTotal || 0) -
    Number(valorGuardado || 0);

  // STATUS
  const status =
    saldo < 0
      ? "🔴 Mês no vermelho"
      : saldo <= 300
      ? "🟡 Mês apertado"
      : "🟢 Salário sob controle";

  // LOGIN
  async function loginGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Erro no login Google.");
    }
  }

  async function logoutGoogle() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  // ADICIONAR GASTO
  async function adicionarGasto() {
    if (!nomeGasto || !valorGasto) return;

    const novo = {
      nome: nomeGasto,
      valor: Number(valorGasto),
      categoria: categoriaGasto,
    };

    setGastos([...gastos, novo]);

    try {
      await addDoc(collection(db, "gastos"), {
        ...novo,
        usuario:
          usuario?.nome || nome || "Usuário",
        criadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }

    setNomeGasto("");
    setValorGasto("");
  }

  // ADICIONAR CONTA
  function adicionarConta() {
    if (!nomeConta || !valorConta) return;

    setContas([
      ...contas,
      {
        nome: nomeConta,
        valor: Number(valorConta),
        categoria: categoriaConta,
      },
    ]);

    setNomeConta("");
    setValorConta("");
  }

  // REMOVER
  function removerGasto(index) {
    setGastos(
      gastos.filter((_, i) => i !== index)
    );
  }

  function removerConta(index) {
    setContas(
      contas.filter((_, i) => i !== index)
    );
  }

  // ESTILOS
  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "18px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    background: "#f9fbff",
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "28px",
    marginBottom: "18px",
    boxShadow:
      "0 10px 30px rgba(13,71,161,0.10)",
  };

  // NAV
  const navItem = (
    id,
    icon,
    label
  ) => (
    <button
      onClick={() => setTela(id)}
      style={{
        border: "none",
        background:
          tela === id
            ? "#e8f1ff"
            : "transparent",
        color:
          tela === id
            ? "#0D47A1"
            : "#7b8794",
        borderRadius: "18px",
        padding: "8px 9px",
        minWidth: "56px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        {icon}
      </div>

      <div>{label}</div>
    </button>
  );

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(180deg,#0D47A1,#06306f)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "120px" }}
          />

          <h1>Meu Salário Organizado</h1>

          <p>
            Organize hoje, realize amanhã
          </p>
        </div>
      </div>
    );
  }

  // APP
  return (
    <div
      style={{
        background: "#eef3fb",
        minHeight: "100vh",
        paddingBottom: "120px",
        fontFamily: "Arial",
      }}
    >
      {/* TOPO */}
      <div
        style={{
          background:
            "linear-gradient(180deg,#0D47A1,#063B88)",
          color: "white",
          padding: "28px 22px 34px",
          borderBottomLeftRadius: "38px",
          borderBottomRightRadius: "38px",
        }}
      >
        <img
          src="/logo-horizontal.png"
          alt="logo"
          style={{
            width: "220px",
            display: "block",
            margin: "0 auto 22px",
          }}
        />

        <h2 style={{ fontSize: "30px" }}>
          👋 Olá
          {usuario?.nome
            ? `, ${usuario.nome}`
            : nome
            ? `, ${nome}`
            : ""}
          !
        </h2>

        <button
          onClick={() =>
            setOcultarValores(
              !ocultarValores
            )
          }
          style={{
            padding: "10px 14px",
            borderRadius: "14px",
            border: "none",
            background:
              "rgba(255,255,255,0.18)",
            color: "white",
            fontWeight: "bold",
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
              marginTop: "14px",
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              background: "white",
              color: "#0D47A1",
              fontWeight: "bold",
            }}
          >
            🔐 Entrar com Google
          </button>
        ) : (
          <button
            onClick={logoutGoogle}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              background: "#d32f2f",
              color: "white",
              fontWeight: "bold",
            }}
          >
            🚪 Sair
          </button>
        )}

        <div
          style={{
            background:
              "rgba(255,255,255,0.14)",
            borderRadius: "24px",
            padding: "18px",
            marginTop: "22px",
          }}
        >
          <p>Saldo livre</p>

          <h1
            style={{
              color: "#FDD835",
              fontSize: "42px",
            }}
          >
            {moeda(saldo)}
          </h1>

          <p>{status}</p>
        </div>
      </div>

      {/* INICIO */}
      {tela === "inicio" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>📊 Resumo</h2>

            <p>
              Entradas:
              <strong>
                {" "}
                {moeda(receitas)}
              </strong>
            </p>

            <p>
              Saídas:
              <strong>
                {" "}
                {moeda(saidas)}
              </strong>
            </p>

            <p>
              Meta mensal:
              <strong>
                {" "}
                {moeda(metaMensal)}
              </strong>
            </p>

            <p>
              Uso salário:
              <strong>
                {" "}
                {progresso.toFixed(0)}%
              </strong>
            </p>
          </div>

          {/* META OBJETIVO */}
          <div style={card}>
            <h2>🎯 {nomeMeta}</h2>

            <p>
              Guardado:
              <strong>
                {" "}
                {moeda(valorGuardado)}
              </strong>
            </p>

            <p>
              Falta:
              <strong>
                {" "}
                {moeda(faltaMeta)}
              </strong>
            </p>

            <div
              style={{
                width: "100%",
                height: "18px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: `${Math.min(
                    progressoMeta,
                    100
                  )}%`,
                  height: "18px",
                  background:
                    "linear-gradient(90deg,#0D47A1,#42a5f5)",
                }}
              />
            </div>

            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {progressoMeta.toFixed(1)}%
              concluído
            </p>
          </div>
        </div>
      )}

      {/* METAS */}
      {tela === "metas" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>🎯 Objetivo</h2>

            <p>Nome da meta</p>

            <input
              style={inputStyle}
              value={nomeMeta}
              onChange={(e) =>
                setNomeMeta(e.target.value)
              }
            />

            <div style={{ height: "14px" }} />

            <p>Valor total</p>

            <input
              style={inputStyle}
              value={valorMetaTotal}
              onChange={(e) =>
                setValorMetaTotal(
                  e.target.value
                )
              }
            />

            <div style={{ height: "14px" }} />

            <p>Meta mensal</p>

            <input
              style={inputStyle}
              value={metaMensal}
              onChange={(e) =>
                setMetaMensal(
                  e.target.value
                )
              }
            />

            <div style={{ height: "14px" }} />

            <p>Quanto já guardou</p>

            <input
              style={inputStyle}
              value={valorGuardado}
              onChange={(e) =>
                setValorGuardado(
                  e.target.value
                )
              }
            />
          </div>
        </div>
      )}

      {/* MENU */}
      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "10px",
          right: "10px",
          background:
            "rgba(255,255,255,0.96)",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "26px",
          boxShadow:
            "0 -8px 30px rgba(0,0,0,0.12)",
          border: "1px solid #e5eaf3",
        }}
      >
        {navItem(
          "inicio",
          "🏠",
          "Início"
        )}

        {navItem(
          "gastos",
          "💸",
          "Gastos"
        )}

        {navItem(
          "contas",
          "📄",
          "Contas"
        )}

        {navItem(
          "metas",
          "🎯",
          "Metas"
        )}

        {navItem(
          "perfil",
          "👤",
          "Perfil"
        )}
      </div>
    </div>
  );
           }
