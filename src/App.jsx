import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");

  const [nome, setNome] = useState(localStorage.getItem("nome") || "Rogério");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [extra, setExtra] = useState(localStorage.getItem("extra") || "");
  const [contas, setContas] = useState(localStorage.getItem("contas") || "");
  const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("contas", contas), [contas]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);
  useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);

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
      },
    ]);

    setNomeGasto("");
    setValorGasto("");
  }

  function removerGasto(index) {
    setGastos(gastos.filter((_, i) => i !== index));
  }

  function limparMes() {
    setSalario("");
    setExtra("");
    setContas("");
    setGastos([]);
  }

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const card = {
    background: "white",
    padding: "20px",
    borderRadius: "22px",
    marginBottom: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  };

  if (loading) {
    return (
      <div style={{
        background:"#0D47A1",
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        color:"white",
        fontFamily:"Arial"
      }}>
        <div style={{textAlign:"center"}}>
          <img src="/logo.png" style={{width:"120px"}} />
          <h1>Meu Salário Organizado</h1>
          <p>Organize hoje, realize amanhã</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background:"#f5f7fb",
      minHeight:"100vh",
      paddingBottom:"90px",
      fontFamily:"Arial"
    }}>
      <div style={{
        background:"#0D47A1",
        color:"white",
        padding:"25px",
        borderBottomLeftRadius:"30px",
        borderBottomRightRadius:"30px"
      }}>
        <img
          src="/logo-horizontal.png"
          style={{ width:"220px", display:"block", margin:"0 auto 20px" }}
        />
        <h2>👋 Olá, {nome}</h2>
        <p style={{opacity:0.85}}>Vamos organizar seu mês?</p>
      </div>

      <div style={{padding:"15px"}}>
        {tela === "inicio" && (
          <>
            <div style={card}>
              <h3>💰 Resumo do mês</h3>
              <p>Receitas: <strong>{moeda(receitas)}</strong></p>
              <p>Saídas: <strong>{moeda(saidas)}</strong></p>
              <h2>Saldo: {moeda(saldo)}</h2>
              <p>{status}</p>

              <div style={{background:"#ddd", borderRadius:"20px", height:"14px"}}>
                <div style={{
                  width:`${progresso}%`,
                  height:"14px",
                  borderRadius:"20px",
                  background: progresso > 80 ? "#d32f2f" : "#fbc02d"
                }} />
              </div>

              <p style={{fontSize:"13px"}}>
                Você já usou {progresso.toFixed(0)}% do dinheiro do mês.
              </p>
            </div>

            <div style={card}>
              <h3>📥 Entradas e contas</h3>

              <input type="number" placeholder="Salário" value={salario} onChange={(e)=>setSalario(e.target.value)} style={inputStyle}/>
              <br/><br/>

              <input type="number" placeholder="Extra / Bico" value={extra} onChange={(e)=>setExtra(e.target.value)} style={inputStyle}/>
              <br/><br/>

              <input type="number" placeholder="Contas fixas" value={contas} onChange={(e)=>setContas(e.target.value)} style={inputStyle}/>
            </div>

            <div style={card}>
              <h3>🎯 Meta do mês</h3>
              <input type="number" value={meta} onChange={(e)=>setMeta(e.target.value)} style={inputStyle}/>
              <p>Guardar: <strong>{moeda(meta)}</strong></p>
            </div>

            <button onClick={limparMes} style={{
              width:"100%",
              padding:"15px",
              borderRadius:"18px",
              border:"none",
              background:"#111",
              color:"white",
              fontWeight:"bold"
            }}>
              Começar novo mês
            </button>
          </>
        )}

        {tela === "gastos" && (
          <div style={card}>
            <h3>💸 Gastos do mês</h3>

            <input placeholder="Nome do gasto" value={nomeGasto} onChange={(e)=>setNomeGasto(e.target.value)} style={inputStyle}/>
            <br/><br/>

            <input type="number" placeholder="Valor" value={valorGasto} onChange={(e)=>setValorGasto(e.target.value)} style={inputStyle}/>
            <br/><br/>

            <button onClick={adicionarGasto} style={{
              width:"100%",
              padding:"14px",
              borderRadius:"16px",
              border:"none",
              background:"#0D47A1",
              color:"white",
              fontWeight:"bold"
            }}>
              Adicionar gasto
            </button>

            <hr/>

            {gastos.length === 0 && <p>Nenhum gasto cadastrado ainda.</p>}

            {gastos.map((item,index)=>(
              <div key={index} style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                borderBottom:"1px solid #eee",
                padding:"10px 0"
              }}>
                <span>{item.nome}<br/><strong>{moeda(item.valor)}</strong></span>
                <button onClick={()=>removerGasto(index)} style={{
                  border:"none",
                  background:"#ffebee",
                  color:"#c62828",
                  borderRadius:"10px",
                  padding:"8px"
                }}>
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}

        {tela === "metas" && (
          <div style={card}>
            <h3>🎯 Metas</h3>
            <p>Sua meta atual é guardar:</p>
            <h2>{moeda(meta)}</h2>
          </div>
        )}

        {tela === "historico" && (
          <div style={card}>
            <h3>📅 Histórico</h3>
            <p>Em breve vamos salvar o fechamento de cada mês aqui.</p>
          </div>
        )}

        {tela === "perfil" && (
          <div style={card}>
            <h3>⚙️ Perfil</h3>
            <input value={nome} onChange={(e)=>setNome(e.target.value)} style={inputStyle}/>
          </div>
        )}
      </div>

      <div style={{
        position:"fixed",
        bottom:0,
        left:0,
        right:0,
        background:"white",
        display:"flex",
        justifyContent:"space-around",
        padding:"10px",
        borderTop:"1px solid #ddd"
      }}>
        <div onClick={()=>setTela("inicio")}>🏠<br/><small>Início</small></div>
        <div onClick={()=>setTela("gastos")}>💸<br/><small>Gastos</small></div>
        <div onClick={()=>setTela("metas")}>🎯<br/><small>Metas</small></div>
        <div onClick={()=>setTela("historico")}>📅<br/><small>Histórico</small></div>
        <div onClick={()=>setTela("perfil")}>⚙️<br/><small>Perfil</small></div>
      </div>
    </div>
  );
                                       }
