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

  const [modoFamilia, setModoFamilia] = useState(
    JSON.parse(localStorage.getItem("modoFamilia")) || false
  );

  const [gastoLorena, setGastoLorena] = useState(
    localStorage.getItem("gastoLorena") || "0"
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] =
    useState("Alimentação");

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] =
    useState("Luz");

  const [vencimentoConta, setVencimentoConta] =
    useState("");

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
    Cartão: "💳",
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
    localStorage.setItem(
      "valorMetaTotal",
      valorMetaTotal
    );
  }, [valorMetaTotal]);

  useEffect(() => {
    localStorage.setItem(
      "valorGuardado",
      valorGuardado
    );
  }, [valorGuardado]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

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

  useEffect(() => {
    localStorage.setItem(
      "modoFamilia",
      JSON.stringify(modoFamilia)
    );
  }, [modoFamilia]);

  useEffect(() => {
    localStorage.setItem(
      "gastoLorena",
      gastoLorena
    );
  }, [gastoLorena]);

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

    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

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

  const saidas =
    totalGastos + totalContas;

  const totalFamilia = modoFamilia
    ? Number(gastoLorena || 0)
    : 0;

  const saldo =
    receitas -
    saidas -
    (Number(meta) || 0) -
    totalFamilia;

  const progresso =
    receitas > 0
      ? Math.min(
          (saidas / receitas) * 100,
          100
        )
      : 0;

  const valorTotalMeta =
    Number(valorMetaTotal) || 0;

  const totalGuardado =
    Number(valorGuardado) || 0;

  const faltaMeta = Math.max(
    valorTotalMeta - totalGuardado,
    0
  );

  const progressoMeta =
    valorTotalMeta > 0
      ? Math.min(
          (totalGuardado /
            valorTotalMeta) *
            100,
          100
        )
      : 0;

  const mesesRestantes =
    Number(meta) > 0
      ? Math.ceil(
          faltaMeta / Number(meta)
        )
      : 0;

  const metaVisual =
    metasOpcoes[tipoMeta] ||
    metasOpcoes.Outros;

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f9fbff",
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "30px",
    marginBottom: "18px",
    boxShadow:
      "0 16px 40px rgba(13,71,161,0.10)",
    border:
      "1px solid rgba(13,71,161,0.06)",
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
        <h1>Carregando...</h1>
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
      <div
        style={{
          background:
            "linear-gradient(160deg,#003c96 0%,#0057c8 48%,#0D47A1 100%)",
          color: "white",
          padding: "26px 22px 36px",
          borderBottomLeftRadius: "42px",
          borderBottomRightRadius: "42px",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            margin: 0,
            fontWeight: "900",
          }}
        >
          👋 Olá
          {usuario?.nome
            ? ", " + usuario.nome
            : nome
            ? ", " + nome
            : ""}
          !
        </h1>

        <p
          style={{
            fontSize: "17px",
            marginTop: "8px",
          }}
        >
          Vamos organizar seu mês?
        </p>

        <div
          style={{
            marginTop: "20px",
            background:
              "rgba(255,255,255,0.12)",
            padding: "20px",
            borderRadius: "28px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
            }}
          >
            Saldo livre
          </p>

          <h1
            style={{
              color: "#FDD835",
              fontSize: "32px",
            }}
          >
            {moeda(saldo)}
          </h1>

          {modoFamilia && (
            <p>
              👨‍👩‍👧 Família:
              {" "}
              <strong>
                {moeda(totalFamilia)}
              </strong>
            </p>
          )}
        </div>
      </div>

      {tela === "inicio" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>
              {metaVisual.icone}
              {" "}
              {nomeMeta}
            </h2>

            <p>
              Objetivo:
              {" "}
              <strong>
                {moeda(valorMetaTotal)}
              </strong>
            </p>

            <p>
              Guardado:
              {" "}
              <strong>
                {moeda(valorGuardado)}
              </strong>
            </p>

            <p>
              Falta:
              {" "}
              <strong>
                {moeda(faltaMeta)}
              </strong>
            </p>

            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  width:
                    progressoMeta + "%",
                  height: "20px",
                  background:
                    "linear-gradient(90deg,#0D47A1,#42a5f5)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {tela === "familia" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>👨‍👩‍👧 Modo Família</h2>

            <button
              onClick={() =>
                setModoFamilia(
                  !modoFamilia
                )
              }
              style={{
                ...primaryButton,
                marginBottom: "20px",
                background: modoFamilia
                  ? "linear-gradient(135deg,#16a34a,#22c55e)"
                  : "linear-gradient(135deg,#6b7280,#9ca3af)",
              }}
            >
              {modoFamilia
                ? "✅ Ativado"
                : "❌ Desativado"}
            </button>

            {modoFamilia && (
              <>
                <p>
                  Gasto mensal da Lorena
                </p>

                <input
                  style={inputStyle}
                  value={gastoLorena}
                  onChange={(e) =>
                    setGastoLorena(
                      e.target.value
                    )
                  }
                  type="number"
                  placeholder="Ex: 800"
                />

                <div
                  style={{
                    marginTop: "20px",
                    background:
                      "#eef4ff",
                    padding: "18px",
                    borderRadius: "20px",
                  }}
                >
                  <strong>
                    👧 Lorena
                  </strong>

                  <h2
                    style={{
                      color: "#0D47A1",
                    }}
                  >
                    {moeda(gastoLorena)}
                  </h2>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tela === "perfil" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>👤 Perfil</h2>

            <input
              style={inputStyle}
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              placeholder="Digite seu nome"
            />
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "8px",
          right: "8px",
          background:
            "rgba(255,255,255,0.98)",
          display: "flex",
          justifyContent:
            "space-between",
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
          "familia",
          "👨‍👩‍👧",
          "Família"
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
