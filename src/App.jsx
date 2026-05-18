import React, { useState, useEffect } from "react";

export default function App() {
  const mesAgora = () => new Date().toISOString().slice(0, 7);

  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");

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
      const gastosAntigos = JSON.parse(localStorage.getItem("gastos")) || [];

      const receitasAntigas = salarioAntigo + extraAntigo;
      const totalGastosAntigos = gastosAntigos.reduce(
        (acc, item) => acc + Number(item.valor || 0),
        0
      );
      const saidasAntigas = contasAntigas + totalGastosAntigos;
      const saldoAntigo = receitasAntigas - saidasAntigas;

      if (receitasAntigas > 0 || saidasAntigas > 0) {
        const novoRegistro = {
          mes: mesSalvo,
          receitas: receitasAntigas,
          saidas: saidasAntigas,
          saldo: saldoAntigo,
        };

        const historicoAtual = JSON.parse(localStorage.getItem("historico")) || [];
        const atualizado = [novoRegistro, ...historicoAtual];

        localStorage.setItem("historico", JSON.stringify(atualizado));
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
  useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
  useEffect(() => localStorage.setItem("historico", JSON.stringify(historico)), [historico]);

  const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const receitas = (Number(salario) || 0) + (Number(extra) || 0);
  const totalGastos = gastos.reduce((acc, item) => acc + item.valor, 0);
  const saidas = (Number(contas) || 0) + totalGastos;
  const saldo = receitas - saidas;
  const progresso = receitas > 0 ? Math.min((saidas / receitas) * 100, 100) : 0;

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
    setGastos(gastos.filter((_, i) => i !== index));
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
    boxShadow: "0 10px 25px rgba(13,71,161,0.10)",
  };

  const label = {
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#1f2937",
  };

  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(180deg, #0D47A1, #06306f)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial",
      }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.png" style={{ width: "125px" }} />
          <h1 style={{ marginBottom: "5px" }}>Meu Salário Organizado</h1>
          <p style={{ color: "#FDD835" }}>Organize hoje, realize amanhã</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#eef3fb",
      minHeight: "100vh",
      paddingBottom: "95px",
      fontFamily: "Arial",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #0D47A1, #063B88)",
        color: "white",
        padding: "28px 22px 34px",
        borderBottomLeftRadius: "34px",
        borderBottomRightRadius: "34px",
      }}>
        <img
          src="/logo-horizontal.png"
          style={{
            width: "225px",
            display: "block",
            margin: "0 auto 22px",
          }}
        />

        <h2 style={{ margin: "0 0 6px" }}>👋 Olá, {nome}</h2>
        <p style={{ opacity: 0.9, margin: 0 }}>Vamos organizar seu mês?</p>

        <div style={{
          background: "rgba(255,255,255,0.14)",
          borderRadius: "22px",
          padding: "16px",
          marginTop: "22px",
          border: "1px solid rgba(255,255,255,0.20)",
        }}>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.85 }}>
            Saldo disponível
          </p>
          <h1 style={{ margin: "6px 0", color: "#FDD835" }}>
            {moeda(saldo)}
          </h1>
          <p style={{ margin: 0, fontSize: "14px" }}>{status}</p>
        </div>
      </div>

      <div style={{ padding: "16px", marginTop: "-10px" }}>
        {tela === "inicio" && (
          <>
            <div style={card}>
              <h3>💰 Resumo do mês</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#e8f1ff", padding: "14px", borderRadius: "18px" }}>
                  <small>Entrou</small>
                  <strong style={{ display: "block", color: "#0D47A1" }}>
                    {moeda(receitas)}
                  </strong>
                </div>

                <div style={{ background: "#fff8d6", padding: "14px", borderRadius: "18px" }}>
                  <small>Saiu</small>
                  <strong style={{ display: "block", color: "#8a6d00" }}>
                    {moeda(saidas)}
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span>Uso do salário</span>
                  <strong>{progresso.toFixed(0)}%</strong>
                </div>

                <div style={{ background: "#e5e7eb", height: "15px", borderRadius: "20px", overflow: "hidden", marginTop: "8px" }}>
                  <div style={{
                    width: `${progresso}%`,
                    height: "15px",
                    background: progresso > 80 ? "#d32f2f" : "#FDD835",
                  }} />
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#555" }}>
                Você já usou {progresso.toFixed(0)}% do dinheiro do mês.
              </p>
            </div>

            <div style={card}>
              <h3>📥 Entradas e contas</h3>

              <p style={label}>💰 Salário</p>
              <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} style={inputStyle} />

              <br /><br />

              <p style={label}>💵 Extra / Bico</p>
              <input type="number" value={extra} onChange={(e) => setExtra(e.target.value)} style={inputStyle} />

              <br /><br />

              <p style={label}>📄 Contas Fixas</p>
              <input type="number" value={contas} onChange={(e) => setContas(e.target.value)} style={inputStyle} />
            </div>

            <div style={card}>
              <h3>🎯 Meta do mês</h3>

              <p style={label}>Quanto deseja guardar?</p>
              <input type="number" value={meta} onChange={(e) => setMeta(e.target.value)} style={inputStyle} />

              <div style={{ marginTop: "14px", background: "#e8f5e9", padding: "14px", borderRadius: "16px", color: "#1b5e20" }}>
                Guardar: <strong>{moeda(meta)}</strong>
              </div>
            </div>

            <button
              onClick={limparMes}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "20px",
                border: "none",
                background: "#111827",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              🔄 Resetar mês
            </button>
          </>
        )}

        {tela === "gastos" && (
          <div style={card}>
            <h3>💸 Gastos do mês</h3>

            <p style={label}>Nome do gasto</p>
            <input value={nomeGasto} onChange={(e) => setNomeGasto(e.target.value)} style={inputStyle} />

            <br /><br />

            <p style={label}>Categoria</p>
            <select value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)} style={inputStyle}>
              {Object.keys(categorias).map((cat) => (
                <option key={cat} value={cat}>
                  {categorias[cat].icone} {cat}
                </option>
              ))}
            </select>

            <br /><br />

            <p style={label}>Valor</p>
            <input type="number" value={valorGasto} onChange={(e) => setValorGasto(e.target.value)} style={inputStyle} />

            <br /><br />

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
              }}
            >
              Adicionar gasto
            </button>

            <hr />

            {gastos.length === 0 && <p>Nenhum gasto cadastrado ainda.</p>}

            {gastos.map((item, index) => {
              const cat = categorias[item.categoria] || categorias.Outros;

              return (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                }}>
                  <div>
                    <span style={{
                      display: "inline-block",
                      background: cat.cor,
                      color: cat.texto,
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "6px",
                    }}>
                      {cat.icone} {item.categoria || "Outros"}
                    </span>

                    <br />
                    <span>{item.nome}</span>
                    <br />
                    <strong>{moeda(item.valor)}</strong>
                  </div>

                  <button
                    onClick={() => removerGasto(index)}
                    style={{
                      border: "none",
                      background: "#ffebee",
                      color: "#c62828",
                      borderRadius: "12px",
                      padding: "9px",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tela === "metas" && (
          <div style={card}>
            <h3>🎯 Metas</h3>
            <p>Sua meta atual é guardar:</p>
            <h2 style={{ color: "#0D47A1" }}>{moeda(meta)}</h2>
          </div>
        )}

        {tela === "historico" && (
          <div style={card}>
            <h3>📅 Histórico</h3>

            {historico.length === 0 && (
              <p>Nenhum mês fechado ainda.</p>
            )}

            {historico.map((item, index) => (
              <div key={index} style={{
                borderBottom: "1px solid #eee",
                padding: "12px 0",
              }}>
                <strong>📆 {item.mes}</strong>
                <p>Receitas: {moeda(item.receitas)}</p>
                <p>Saídas: {moeda(item.saidas)}</p>
                <p>
                  Saldo final: <strong>{moeda(item.saldo)}</strong>
                </p>
              </div>
            ))}
          </div>
        )}

        {tela === "perfil" && (
          <div style={card}>
            <h3>⚙️ Perfil</h3>

            <p style={label}>Seu nome</p>
            <input value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
          </div>
        )}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        borderTop: "1px solid #ddd",
        boxShadow: "0 -6px 18px rgba(0,0,0,0.06)",
      }}>
        <div onClick={() => setTela("inicio")}>🏠<br /><small>Início</small></div>
        <div onClick={() => setTela("gastos")}>💸<br /><small>Gastos</small></div>
        <div onClick={() => setTela("metas")}>🎯<br /><small>Metas</small></div>
        <div onClick={() => setTela("historico")}>📅<br /><small>Histórico</small></div>
        <div onClick={() => setTela("perfil")}>⚙️<br /><small>Perfil</small></div>
      </div>
    </div>
  );
                                   }
