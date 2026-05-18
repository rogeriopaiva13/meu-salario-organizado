import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || ""
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
    }, 1200);

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
    borderRadius: "18px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
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

  const label = {
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: "15px",
  };

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
          fontFamily: "Arial",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "120px" }}
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

        <h2 style={{ fontSize: "38px" }}>
          👋 Olá!
        </h2>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
          }}
        >
          Vamos organizar seu mês?
        </p>

        <button
          onClick={() =>
            setOcultarValores(!ocultarValores)
          }
          style={{
            marginTop: "18px",
            padding: "14px 18px",
            borderRadius: "18px",
            border: "none",
            background:
              "rgba(255,255,255,0.18)",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
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
            borderRadius: "28px",
            padding: "22px",
            marginTop: "24px",
          }}
        >
          <p style={{ fontSize: "16px" }}>
            Saldo disponível
          </p>

          <h1
            style={{
              color: "#FDD835",
              fontSize: "56px",
            }}
          >
            {moeda(saldo)}
          </h1>

          <p
            style={{
              fontSize: "22px",
            }}
          >
            {status}
          </p>
        </div>
      </div>

      {tela === "inicio" && (
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

            <div style={{ height: "16px" }} />

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

            <div style={{ height: "16px" }} />

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
        </div>
      )}

      {tela === "gastos" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>💸 Gastos</h2>

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

            <div style={{ height: "16px" }} />

            <button
              onClick={adicionarGasto}
              style={{
                width: "100%",
                padding: "16px",
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

          {gastos.map((item, index) => (
            <div
              key={index}
              style={{
                ...card,
                background:
                  categorias[item.categoria]
                    ?.cor,
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
                  <h3>
                    {
                      categorias[item.categoria]
                        ?.icone
                    }{" "}
                    {item.nome}
                  </h3>

                  <p
                    style={{
                      color:
                        categorias[item.categoria]
                          ?.texto,
                      fontWeight: "bold",
                    }}
                  >
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
                    fontSize: "22px",
                  }}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tela === "metas" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>🎯 Metas</h2>

            <p
              style={{
                fontSize: "18px",
              }}
            >
              Sua meta atual é:
            </p>

            <h1
              style={{
                color: "#0D47A1",
                fontSize: "42px",
              }}
            >
              {moeda(meta)}
            </h1>
          </div>
        </div>
      )}

      {tela === "perfil" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>👤 Perfil</h2>

            <p>Nome:</p>

            <h3>{nome || "Usuário"}</h3>
          </div>
        </div>
      )}

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
          padding: "14px 0",
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
            fontSize: "14px",
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
            fontSize: "14px",
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
            fontSize: "14px",
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
            fontSize: "14px",
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
