
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

  const [tipoMeta, setTipoMeta] = useState(
    localStorage.getItem("tipoMeta") || "Carro"
  );

  const [nomeMeta, setNomeMeta] = useState(
    localStorage.getItem("nomeMeta") || "Meu objetivo"
  );

  const [valorMetaTotal, setValorMetaTotal] = useState(
    localStorage.getItem("valorMetaTotal") || "30000"
  );

  const [valorGuardado, setValorGuardado] = useState(
    localStorage.getItem("valorGuardado") || "0"
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] = useState("Luz");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historicoFinanceiro")) || []
  );

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

  const metasOpcoes = {
    Casa: {
      icone: "🏠",
      cor: "#e8f1ff",
      texto: "#0D47A1",
    },

    Viagem: {
      icone: "✈️",
      cor: "#fff8e1",
      texto: "#b7791f",
    },

    Carro: {
      icone: "🚗",
      cor: "#e8f5e9",
      texto: "#1b5e20",
    },

    Outros: {
      icone: "🎯",
      cor: "#f3e5f5",
      texto: "#6a1b9a",
    },
  };

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
    localStorage.setItem("tipoMeta", tipoMeta);
  }, [tipoMeta]);

  useEffect(() => {
    localStorage.setItem("nomeMeta", nomeMeta);
  }, [nomeMeta]);

  useEffect(() => {
    localStorage.setItem("valorMetaTotal", valorMetaTotal);
  }, [valorMetaTotal]);

  useEffect(() => {
    localStorage.setItem("valorGuardado", valorGuardado);
  }, [valorGuardado]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

  useEffect(() => {
    localStorage.setItem("xp", String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("contasLista", JSON.stringify(contas));
  }, [contas]);

  useEffect(() => {
    localStorage.setItem(
      "historicoFinanceiro",
      JSON.stringify(historico)
    );
  }, [historico]);

  const fotoAtual = fotoPerfil || usuario?.foto || "";

  function escolherFoto(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
      setFotoPerfil(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  function removerFotoPerfil() {
    const confirmar = window.confirm(
      "Deseja remover a foto do perfil?"
    );

    if (!confirmar) return;

    setFotoPerfil("");
    localStorage.removeItem("fotoPerfil");
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

  const totalGastos = gastos.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const totalContas = contas.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const saidas = totalGastos + totalContas;

  const saldo =
    receitas - saidas - (Number(meta) || 0);

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;

  const valorTotalMeta = Number(valorMetaTotal) || 0;

  const totalGuardado = Number(valorGuardado) || 0;

  const faltaMeta = Math.max(
    valorTotalMeta - totalGuardado,
    0
  );

  const progressoMeta =
    valorTotalMeta > 0
      ? Math.min(
          (totalGuardado / valorTotalMeta) * 100,
          100
        )
      : 0;

  const mesesRestantes =
    Number(meta) > 0
      ? Math.ceil(faltaMeta / Number(meta))
      : 0;

  const metaVisual =
    metasOpcoes[tipoMeta] || metasOpcoes.Outros;

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
      categoria: categoriaGasto,
    };

    setGastos([...gastos, novo]);

    ganharXp(5);

    try {
      await addDoc(collection(db, "gastos"), {
        ...novo,
        usuario: usuario?.nome || nome || "Usuário",
        email: usuario?.email || "",
        criadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }

    setNomeGasto("");
    setValorGasto("");
  }

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

    ganharXp(5);

    setNomeConta("");
    setValorConta("");
  }

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "28px",
    marginBottom: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f9fbff",
  };

  const primaryButton = {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
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
          tela === id ? "#0D47A1" : "transparent",
        color: tela === id ? "white" : "#6b7280",
        borderRadius: "18px",
        padding: "10px 12px",
        minWidth: "64px",
        fontWeight: "bold",
        fontSize: "11px",
      }}
    >
      <div style={{ fontSize: "20px" }}>{icon}</div>
      <div>{label}</div>
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
        paddingBottom: "120px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(160deg,#003c96,#0057c8,#0D47A1)",
          color: "white",
          padding: "26px 22px 32px",
          borderBottomLeftRadius: "42px",
          borderBottomRightRadius: "42px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ margin: 0 }}>
            Meu Salário Organizado
          </h1>

          {fotoAtual ? (
            <img
              src={fotoAtual}
              alt="foto"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid white",
              }}
            />
          ) : (
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              👤
            </div>
          )}
        </div>

        <h2 style={{ marginBottom: "8px" }}>
          👋 Olá {usuario?.nome || nome}
        </h2>

        <p style={{ opacity: 0.9 }}>
          Vamos organizar seu mês?
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <button
            onClick={() =>
              setOcultarValores(!ocultarValores)
            }
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "18px",
              border: "none",
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
                padding: "14px",
                borderRadius: "18px",
                border: "none",
                background: "white",
                color: "#0D47A1",
                fontWeight: "bold",
              }}
            >
              🔐 Google
            </button>
          ) : (
            <button
              onClick={logoutGoogle}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "18px",
                border: "none",
                background: "#ef4444",
                color: "white",
              }}
            >
              Sair
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: "24px",
            background: "rgba(255,255,255,0.12)",
            padding: "22px",
            borderRadius: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0 }}>
                Saldo livre após meta
              </p>

              <h1
                style={{
                  color: "#FDD835",
                  fontSize: "30px",
                  margin: "12px 0",
                }}
              >
                {moeda(saldo)}
              </h1>

              <div
                style={{
                  display: "inline-block",
                  background: "#16a34a",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {statusLimpo}
              </div>
            </div>

            <div
              style={{
                width: "86px",
                height: "86px",
                borderRadius: "50%",
                background: `conic-gradient(#FDD835 ${progresso}%, rgba(255,255,255,0.2) ${progresso}% 100%)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#0D47A1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  {progresso.toFixed(0)}%
                </span>

                <span style={{ fontSize: "9px" }}>
                  usado
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.08)",
              padding: "14px 16px",
              borderRadius: "18px",
              fontSize: "14px",
            }}
          >
            <span>💰 {moeda(receitas)}</span>
            <span>💸 {moeda(saidas)}</span>
            <span>🎯 {moeda(meta)}</span>
            <span>⭐ {xp} XP</span>
          </div>

          <div
            style={{
              marginTop: "12px",
              background: "rgba(255,255,255,0.08)",
              padding: "12px 16px",
              borderRadius: "16px",
              fontSize: "13px",
            }}
          >
            {nivel}
          </div>
        </div>
      </div>
    </div>
  );
}
