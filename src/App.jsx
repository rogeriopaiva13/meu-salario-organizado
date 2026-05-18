import React, { useState, useEffect } from "react";

export default function App() {
  const mesAgora = () => new Date().toISOString().slice(0, 7);

  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);

  const [nome, setNome] = useState(localStorage.getItem("nome") || "Rogério");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [extra, setExtra] = useState(localStorage.getItem("extra") || "");
  const [contas, setContas] = useState(localStorage.getItem("contas") || "");
  const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historico")) || []
  );

  const categorias = {
    Alimentação: { icone: "🍔", cor: "#fff3e0", texto: "#e65100" },
    Transporte: { icone: "🚗", cor: "#e3f2fd", texto: "#0D47A1" },
    Casa: { icone: "🏠", cor: "#fff8e1", texto: "#8a6d00" },
    Saúde: { icone: "💊", cor: "#e8f5e9", texto: "#1b5e20" },
    Lazer: { icone: "🎮", cor: "#f3e5f5", texto: "#6a1b9a" },
    Contas: { icone: "📄", cor: "#eeeeee", texto: "#333333" },
    Outros: { icone: "🛒", cor: "#e0f2f1", texto: "#00695c" },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mesSalvo = localStorage.getItem("mesReferencia");
    const mesAtual = mesAgora();

    if (!mesSalvo) {
      localStorage.setItem("mesReferencia", mesAtual);
      return;
    }

    if (mesSalvo !== mesAtual) {
      const salarioAntigo = Number(localStorage.getItem("salario") || 0);
      const extraAntigo = Number(localStorage.getItem("extra") || 0);
      const contasAntigas = Number(localStorage.getItem("contas") || 0);
      const gastosAntigos =
        JSON.parse(localStorage.getItem("gastos")) || [];

      const receitasAntigas = salarioAntigo + extraAntigo;

      const totalGastosAntigos = gastosAntigos.reduce(
        (acc, item) => acc + Number(item.valor || 0),
        0
      );

      const saidasAntigas =
        contasAntigas + totalGastosAntigos;

      const saldoAntigo =
        receitasAntigas - saidasAntigas;

      if (receitasAntigas > 0 || saidasAntigas > 0) {
        const novoRegistro = {
          mes: mesSalvo,
          receitas: receitasAntigas,
          saidas: saidasAntigas,
          saldo: saldoAntigo,
        };

        const historicoAtual =
          JSON.parse(localStorage.getItem("historico")) || [];

        const atualizado = [
          novoRegistro,
          ...historicoAtual,
        ];

        localStorage.setItem(
          "historico",
          JSON.stringify(atualizado)
        );

        setHistorico(atualizado);
      }

      localStorage.setItem("salario", "");
      localStorage.setItem("extra", "");
      localStorage.setItem("contas", "");
      localStorage.setItem("gastos", JSON.stringify([]));
      localStorage.setItem("mesReferencia", mesAtual);

      setSalario("");
      setExtra("");
      setContas("");
      setGastos([]);
    }
  }, []);

  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("contas", contas), [contas]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem(
      "historico",
      JSON.stringify(historico)
    );
  }, [historico]);

  const moeda = (valor) => {
    if (ocultarValores) {
      return "R$ •••••";
    }

    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalGastos = gastos.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const saidas =
    (Number(contas) || 0) + totalGastos;

  const saldo = receitas - saidas;

  const progresso =
    receitas > 0
      ? Math.min((saidas / receitas) * 100, 100)
      : 0;

  const status =
    saldo < 0
      ? "🔴 Mês no vermelho"
      : saldo <= 300
      ? "🟡 Mês apertado"
      : "🟢 Salário sob controle";

  const gastosPorCategoria = gastos.reduce(
    (acc, item) => {
      const categoria = item.categoria || "Outros";

      acc[categoria] =
        (acc[categoria] || 0) +
        Number(item.valor || 0);

      return acc;
    },
    {}
  );

  const maiorGastoCategoria = Math.max(
    ...Object.values(gastosPorCategoria),
    1
  );

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

  function compartilharProgresso() {
    const percentualMeta =
      Number(meta) > 0
        ? Math.min((saldo / Number(meta)) * 100, 100)
        : 0;

    const mensagem = `🎯 Meu progresso no Meu Salário Organizado

${status}

🏆 Meta do mês:
${percentualMeta.toFixed(0)}% concluída

🚀 Organize hoje, realize amanhã.

https://meu-salario-organizado.vercel.app/`;

    if (navigator.share) {
      navigator.share({
        title: "Meu Salário Organizado",
        text: mensagem,
      });
    } else {
      navigator.clipboard.writeText(mensagem);

      alert("Mensagem copiada para compartilhar!");
    }
  }

  function limparMes() {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar os dados do mês?"
    );

    if (!confirmar) return;

    setSalario("");
    setExtra("");
    setContas("");
    setGastos([]);
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
            style={{ width: "125px" }}
          />

          <h1 style={{ marginBottom: "5px" }}>
            Meu Salário Organizado
          </h1>

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
        paddingBottom: "95px",
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
          style={{
            width: "225px",
            display: "block",
            margin: "0 auto 22px",
          }}
        />

        <h2 style={{ margin: "0 0 6px" }}>
          👋 Olá, {nome}
        </h2>

        <p style={{ opacity: 0.9, margin: 0 }}>
          Vamos organizar seu mês?
        </p>

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
            border:
              "1px solid rgba(255,255,255,0.20)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              opacity: 0.85,
            }}
          >
            Saldo disponível
          </p>

          <h1
            style={{
              margin: "6px 0",
              color: "#FDD835",
            }}
          >
            {moeda(saldo)}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
            }}
          >
            {status}
          </p>
        </div>
      </div>
<div style={{ padding: "20px", marginTop: "-10px" }}>
        <div style={card}>
          <p style={label}>👤 Seu nome</p>

          <input
            style={inputStyle}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div style={card}>
          <p style={label}>💰 Salário</p>

          <input
            style={inputStyle}
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            placeholder="0,00"
          />

          <div style={{ height: "14px" }} />

          <p style={label}>✨ Extra</p>

          <input
            style={inputStyle}
            type="number"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="0,00"
          />

          <div style={{ height: "14px" }} />

          <p style={label}>📄 Contas Fixas</p>

          <input
            style={inputStyle}
            type="number"
            value={contas}
            onChange={(e) => setContas(e.target.value)}
            placeholder="0,00"
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
            {Object.keys(categorias).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
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
                    categorias[item.categoria]?.cor,
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

                    <p
                      style={{
                        margin: "5px 0 0",
                        color:
                          categorias[item.categoria]
                            ?.texto,
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
                      background: "transparent",
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

        <div style={card}>
          <h3>📈 Resumo</h3>

          <p>Receitas: {moeda(receitas)}</p>

          <p>Saídas: {moeda(saidas)}</p>

          <p>
            Meta: {moeda(meta)}
          </p>

          <div
            style={{
              background: "#dbeafe",
              height: "14px",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                width: `${progresso}%`,
                background: "#0D47A1",
                height: "100%",
              }}
            />
          </div>
        </div>

        <button
          onClick={compartilharProgresso}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            border: "none",
            background: "#FDD835",
            color: "#0D47A1",
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          📤 Compartilhar progresso
        </button>

        <button
          onClick={limparMes}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            border: "none",
            background: "#ef4444",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          🗑 Limpar mês
        </button>
      </div>
    </div>
  );
            }
