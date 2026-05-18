import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || "Rogério"
  );

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  const [contas, setContas] = useState(
    localStorage.getItem("contas") || ""
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] =
    useState("Alimentação");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
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

    Contas: {
      icone: "📄",
      cor: "#eeeeee",
      texto: "#333333",
    },

    Outros: {
      icone: "🛒",
      cor: "#e0f2f1",
      texto: "#00695c",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
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
    localStorage.setItem("contas", contas);
  }, [contas]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

  useEffect(() => {
    localStorage.setItem(
      "gastos",
      JSON.stringify(gastos)
    );
  }, [gastos]);

  const moeda = (valor) => {
    if (ocultarValores) {
      return "R$ •••••";
    }

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

  const saidas =
    (Number(contas) || 0) + totalGastos;

  const saldo = receitas - saidas;

  const status =
    saldo < 0
      ? "🔴 Mês no vermelho"
      : saldo <= 300
      ? "🟡 Mês apertado"
      : "🟢 Salário sob controle";

  function adicionarGasto() {
    if (!nomeGasto || !valorGasto) return;

    setGastos([
      ...gastos,
      {
        nome: nomeGasto,
        valor: Number(valorGasto),
        categoria: categoriaGasto,
      },
    ]);

    setNomeGasto("");
    setValorGasto("");
    setCategoriaGasto("Alimentação");
  }

  function removerGasto(index) {
    setGastos(
      gastos.filter((_, i) => i !== index)
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f9fbff",
  };

  const card = {
    background: "white",
    padding: "20px",
    borderRadius: "24px",
    marginBottom: "16px",
    boxShadow:
      "0 10px 25px rgba(13,71,161,0.10)",
  };

  const label = {
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#1f2937",
  };

  if (loading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(180deg, #0D47A1, #06306f)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "125px" }}
          />

          <h1>Meu Salário Organizado</h1>

          <p style={{ color: "#FDD835" }}>
            Organize hoje, realize amanhã
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#eef3fb",
        minHeight: "100vh",
        paddingBottom: "120px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, #0D47A1, #063B88)",
          color: "white",
          padding: "28px 22px 34px",
          borderBottomLeftRadius: "34px",
          borderBottomRightRadius: "34px",
        }}
      >
        <img
          src="/logo-horizontal.png"
          alt="logo"
          style={{
            width: "225px",
            display: "block",
            margin: "0 auto 22px",
          }}
        />

        <h2>👋 Olá, {nome}</h2>

        <p>Vamos organizar seu mês?</p>

        <button
          onClick={() =>
            setOcultarValores(!ocultarValores)
          }
          style={{
            marginTop: "14px",
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
            ? "👁 Mostrar valores"
            : "🙈 Ocultar valores"}
        </button>

        <div
          style={{
            background:
              "rgba(255,255,255,0.14)",
            borderRadius: "22px",
            padding: "16px",
            marginTop: "22px",
          }}
        >
          <p>Saldo disponível</p>

          <h1 style={{ color: "#FDD835" }}>
            {moeda(saldo)}
          </h1>

          <p>{status}</p>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          marginTop: "-10px",
        }}
      >
        <div style={card}>
          <p style={label}>👤 Seu nome</p>

          <input
            style={inputStyle}
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            placeholder="Digite seu nome"
          />
        </div>

        <div style={card}>
          <p style={label}>💰 Salário</p>

          <input
            style={inputStyle}
            type="text"
            inputMode="decimal"
            value={
              ocultarValores
                ? "•••••"
                : salario
            }
            onChange={(e) =>
              setSalario(e.target.value)
            }
            placeholder="0,00"
          />

          <div style={{ height: "14px" }} />

          <p style={label}>✨ Extra</p>

          <input
            style={inputStyle}
            type="text"
            inputMode="decimal"
            value={
              ocultarValores
                ? "•••••"
                : extra
            }
            onChange={(e) =>
              setExtra(e.target.value)
            }
            placeholder="0,00"
          />

          <div style={{ height: "14px" }} />

          <p style={label}>📄 Contas Fixas</p>

          <input
            style={inputStyle}
            type="text"
            inputMode="decimal"
            value={
              ocultarValores
                ? "•••••"
                : contas
            }
            onChange={(e) =>
              setContas(e.target.value)
            }
            placeholder="0,00"
          />
        </div>

        <div style={card}>
          <p style={label}>🎯 Meta do mês</p>

          <input
            style={inputStyle}
            type="text"
            value={
              ocultarValores
                ? "•••••"
                : meta
            }
            onChange={(e) =>
              setMeta(e.target.value)
            }
            placeholder="500"
          />
        </div>

        <div style={card}>
          <h3>🛒 Adicionar gasto</h3>

          <input
            style={inputStyle}
            value={nomeGasto}
            onChange={(e) =>
              setNomeGasto(e.target.value)
            }
            placeholder="Nome do gasto"
          />

          <div style={{ height: "12px" }} />

          <input
            style={inputStyle}
            type="number"
            inputMode="decimal"
            value={valorGasto}
            onChange={(e) =>
              setValorGasto(e.target.value)
            }
            placeholder="Valor"
          />

          <div style={{ height: "12px" }} />

          <select
            style={inputStyle}
            value={categoriaGasto}
            onChange={(e) =>
              setCategoriaGasto(e.target.value)
            }
          >
            {Object.keys(categorias).map(
              (cat) => (
                <option key={cat}>
                  {cat}
                </option>
              )
            )}
          </select>

          <div style={{ height: "14px" }} />

          <button
            onClick={adicionarGasto}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "18px",
              border: "none",
              background: "#0D47A1",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            ➕ Adicionar gasto
          </button>
        </div>

        <div style={card}>
          <h3>📊 Gastos do mês</h3>

          {gastos.length === 0 ? (
            <p>Nenhum gasto cadastrado.</p>
          ) : (
            gastos.map((item, index) => (
              <div
                key={index}
                style={{
                  background:
                    categorias[item.categoria]
                      ?.cor,
                  padding: "14px",
                  borderRadius: "18px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>
                      {
                        categorias[item.categoria]
                          ?.icone
                      }{" "}
                      {item.nome}
                    </strong>

                    <p>
                      {moeda(item.valor)}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removerGasto(index)
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      fontSize: "20px",
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "12px 0",
          borderTop: "1px solid #dbe3f1",
          boxShadow:
            "0 -5px 20px rgba(0,0,0,0.06)",
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setTela("inicio")}
          style={{
            background: "transparent",
            border: "none",
            color:
              tela === "inicio"
                ? "#0D47A1"
                : "#7b8794",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          🏠
          <br />
          Início
        </button>

        <button
          onClick={() => setTela("gastos")}
          style={{
            background: "transparent",
            border: "none",
            color:
              tela === "gastos"
                ? "#0D47A1"
                : "#7b8794",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          💸
          <br />
          Gastos
        </button>

        <button
          onClick={() => setTela("metas")}
          style={{
            background: "transparent",
            border: "none",
            color:
              tela === "metas"
                ? "#0D47A1"
                : "#7b8794",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          🎯
          <br />
          Metas
        </button>

        <button
          onClick={() => setTela("perfil")}
          style={{
            background: "transparent",
            border: "none",
            color:
              tela === "perfil"
                ? "#0D47A1"
                : "#7b8794",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          👤
          <br />
          Perfil
        </button>
      </div>
    </div>
  );
      }
