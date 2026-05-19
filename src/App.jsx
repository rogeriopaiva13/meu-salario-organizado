import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);

  const [nome, setNome] = useState(localStorage.getItem("nome") || "");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [extra, setExtra] = useState(localStorage.getItem("extra") || "");
  const [contas, setContas] = useState(localStorage.getItem("contas") || "");
  const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  const [gastos, setGastos] = useState(JSON.parse(localStorage.getItem("gastos")) || []);
  const [historico, setHistorico] = useState(JSON.parse(localStorage.getItem("historico")) || []);

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
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("contas", contas), [contas]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);
  useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
  useEffect(() => localStorage.setItem("historico", JSON.stringify(historico)), [historico]);

  const moeda = (valor) => {
    if (ocultarValores) return "••••••";
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const receitas = (Number(salario) || 0) + (Number(extra) || 0);
  const totalGastos = gastos.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const saidas = (Number(contas) || 0) + totalGastos;
  const saldo = receitas - saidas - (Number(meta) || 0);

  const progresso = receitas > 0 ? Math.min((saidas / receitas) * 100, 100) : 0;

  const status =
    const alerta =
  progresso >= 100
    ? "🚨 Você ultrapassou seu limite do mês."
    : progresso >= 80
    ? "⚠️ Atenção! Você já usou mais de 80%."
    : saldo <= 0
    ? "🔴 Seu saldo livre ficou negativo."
    : "🟢 Continue assim! Seu mês está saudável.";
    saldo < 0 ? "🔴 Mês no vermelho" : saldo <= 300 ? "🟡 Mês apertado" : "🟢 Salário sob controle";

  const gastosPorCategoria = gastos.reduce((acc, item) => {
    const categoria = item.categoria || "Outros";
    acc[categoria] = (acc[categoria] || 0) + Number(item.valor || 0);
    return acc;
  }, {});

  const maiorGastoCategoria = Math.max(...Object.values(gastosPorCategoria), 1);
  const maiorSaldoHistorico = Math.max(...historico.map((h) => Math.abs(Number(h.saldo || 0))), 1);

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
    setGastos(gastos.filter((_, i) => i !== index));
  }

  function compartilharProgresso() {
    const mensagem = `🎯 Meu progresso no Meu Salário Organizado

${status}

💰 Uso do salário:
${progresso.toFixed(0)}%

🚀 Organize hoje, realize amanhã.`;

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

  function resetarMes() {
    const confirmar = window.confirm("Deseja realmente apagar os dados do mês?");
    if (!confirmar) return;

    if (receitas > 0 || saidas > 0) {
      const novoRegistro = {
        mes: new Date().toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        receitas,
        saidas,
        saldo,
      };

      setHistorico([novoRegistro, ...historico]);
    }

    setSalario("");
    setExtra("");
    setContas("");
    setGastos([]);
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
    boxShadow: "0 10px 30px rgba(13,71,161,0.10)",
  };

  const label = {
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: "15px",
  };

  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(180deg,#0D47A1,#06306f)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial",
      }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.png" alt="logo" style={{ width: "120px" }} />
          <h1>Meu Salário Organizado</h1>
          <p style={{ color: "#FDD835" }}>Organize hoje, realize amanhã</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#eef3fb",
      minHeight: "100vh",
      paddingBottom: "120px",
      fontFamily: "Arial",
    }}>
      <div style={{
        background: "linear-gradient(180deg,#0D47A1,#063B88)",
        color: "white",
        padding: "28px 22px 34px",
        borderBottomLeftRadius: "38px",
        borderBottomRightRadius: "38px",
      }}>
        <img
          src="/logo-horizontal.png"
          alt="logo"
          style={{ width: "220px", display: "block", margin: "0 auto 22px" }}
        />

        <h2 style={{ fontSize: "34px" }}>👋 Olá{nome ? `, ${nome}` : ""}!</h2>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>Vamos organizar seu mês?</p>

        <button
          onClick={() => setOcultarValores(!ocultarValores)}
          style={{
            marginTop: "14px",
            padding: "10px 14px",
            borderRadius: "14px",
            border: "none",
            background: "rgba(255,255,255,0.18)",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {ocultarValores ? "👁 Mostrar" : "🙈 Ocultar"}
        </button>

        <div style={{
          background: "rgba(255,255,255,0.14)",
          borderRadius: "24px",
          padding: "18px",
          marginTop: "22px",
        }}>
          <p style={{ fontSize: "15px", margin: 0 }}>Saldo livre após meta</p>
          <p
  style={{
    marginTop: "12px",
    fontSize: "14px",
    opacity: 0.95,
    lineHeight: "20px",
  }}
>
  {alerta}
</p>

          <h1 style={{ color: "#FDD835", fontSize: "42px", margin: "14px 0" }}>
            {moeda(saldo)}
          </h1>

          <p style={{ fontSize: "20px", margin: 0 }}>{status}</p>
        </div>
      </div>

      {tela === "inicio" && (
        <div style={{ padding: "20px", marginTop: "-10px" }}>
          <div style={card}>
            <h2>📊 Resumo do mês</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#e8f1ff", padding: "14px", borderRadius: "18px" }}>
                <small>Entrou</small>
                <h3>{moeda(receitas)}</h3>
              </div>

              <div style={{ background: "#fff8d6", padding: "14px", borderRadius: "18px" }}>
                <small>Saiu</small>
                <h3>{moeda(saidas)}</h3>
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Uso do salário</span>
                <strong>{progresso.toFixed(0)}%</strong>
              </div>

              <div style={{
                background: "#e5e7eb",
                height: "14px",
                borderRadius: "20px",
                overflow: "hidden",
                marginTop: "8px",
              }}>
                <div style={{
                  width: `${progresso}%`,
                  height: "14px",
                  background: progresso > 80 ? "#d32f2f" : "#FDD835",
                }} />
              </div>
            </div>
          </div>

          <div style={card}>
            <p style={label}>💰 Salário</p>
            <input style={inputStyle} type="text" inputMode="decimal" value={ocultarValores ? "•••••" : salario} onChange={(e) => setSalario(e.target.value)} />

            <div style={{ height: "16px" }} />

            <p style={label}>✨ Extra</p>
            <input style={inputStyle} type="text" inputMode="decimal" value={ocultarValores ? "•••••" : extra} onChange={(e) => setExtra(e.target.value)} />

            <div style={{ height: "16px" }} />

            <p style={label}>📄 Contas Fixas</p>
            <input style={inputStyle} type="text" inputMode="decimal" value={ocultarValores ? "•••••" : contas} onChange={(e) => setContas(e.target.value)} />
          </div>

          <div style={card}>
            <p style={label}>🎯 Meta do mês</p>
            <input style={inputStyle} type="text" value={ocultarValores ? "•••••" : meta} onChange={(e) => setMeta(e.target.value)} />
          </div>

          <button
            onClick={compartilharProgresso}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "18px",
              border: "none",
              background: "#0D47A1",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          >
            📤 Compartilhar progresso
          </button>

          <button
            onClick={resetarMes}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "18px",
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            🔄 Resetar mês
          </button>
        </div>
      )}

      {tela === "gastos" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>💸 Gastos</h2>

            <input style={inputStyle} value={nomeGasto} onChange={(e) => setNomeGasto(e.target.value)} placeholder="Nome do gasto" />

            <div style={{ height: "12px" }} />

            <input style={inputStyle} type="number" value={valorGasto} onChange={(e) => setValorGasto(e.target.value)} placeholder="Valor" />

            <div style={{ height: "12px" }} />

            <select style={inputStyle} value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)}>
              {Object.keys(categorias).map((cat) => (
                <option key={cat} value={cat}>
                  {categorias[cat].icone} {cat}
                </option>
              ))}
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
              }}
            >
              ➕ Adicionar gasto
            </button>
          </div>

          <div style={card}>
            <h2>📊 Gastos por categoria</h2>

            {Object.keys(gastosPorCategoria).length === 0 && (
              <p>Adicione gastos para visualizar o gráfico.</p>
            )}

            {Object.entries(gastosPorCategoria).map(([categoria, valor]) => {
              const cat = categorias[categoria];
              const largura = (valor / maiorGastoCategoria) * 100;

              return (
                <div key={categoria} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{cat.icone} {categoria}</strong>
                    <strong>{moeda(valor)}</strong>
                  </div>

                  <div style={{
                    width: "100%",
                    height: "16px",
                    background: "#eceff1",
                    borderRadius: "20px",
                    overflow: "hidden",
                    marginTop: "6px",
                  }}>
                    <div style={{
                      width: `${largura}%`,
                      height: "16px",
                      background: cat.texto,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tela === "historico" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>📅 Evolução mensal</h2>

            {historico.length === 0 && <p>Nenhum mês salvo ainda.</p>}

            {historico.map((item, index) => {
              const saldoMes = Number(item.saldo || 0);
              const largura = Math.min((Math.abs(saldoMes) / maiorSaldoHistorico) * 100, 100);
              const positivo = saldoMes >= 0;

              return (
                <div key={index} style={{
                  borderBottom: "1px solid #eee",
                  padding: "14px 0",
                }}>
                  <strong>📆 {item.mes}</strong>

                  <div style={{ marginTop: "8px", fontSize: "14px" }}>
                    <p>Receitas: {moeda(item.receitas)}</p>
                    <p>Saídas: {moeda(item.saidas)}</p>
                    <p>
                      Saldo final:{" "}
                      <strong style={{ color: positivo ? "#1b5e20" : "#c62828" }}>
                        {moeda(item.saldo)}
                      </strong>
                    </p>
                  </div>

                  <div style={{
                    width: "100%",
                    height: "16px",
                    background: "#eceff1",
                    borderRadius: "20px",
                    overflow: "hidden",
                    marginTop: "8px",
                  }}>
                    <div style={{
                      width: `${largura}%`,
                      height: "16px",
                      background: positivo ? "#43a047" : "#d32f2f",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tela === "perfil" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>👤 Perfil</h2>

            <p style={label}>Nome</p>
            <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
        </div>
      )}

      <div style={{
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
        boxShadow: "0 -5px 20px rgba(0,0,0,0.06)",
        zIndex: 999,
      }}>
        <button onClick={() => setTela("inicio")} style={{ background: "transparent", border: "none", color: tela === "inicio" ? "#0D47A1" : "#7b8794", fontWeight: "bold" }}>
          🏠<br />Início
        </button>

        <button onClick={() => setTela("gastos")} style={{ background: "transparent", border: "none", color: tela === "gastos" ? "#0D47A1" : "#7b8794", fontWeight: "bold" }}>
          💸<br />Gastos
        </button>

        <button onClick={() => setTela("historico")} style={{ background: "transparent", border: "none", color: tela === "historico" ? "#0D47A1" : "#7b8794", fontWeight: "bold" }}>
          📅<br />Histórico
        </button>

        <button onClick={() => setTela("perfil")} style={{ background: "transparent", border: "none", color: tela === "perfil" ? "#0D47A1" : "#7b8794", fontWeight: "bold" }}>
          👤<br />Perfil
        </button>
      </div>
    </div>
  );
}
