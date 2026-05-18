import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");

  const [salario, setSalario] = useState("");
  const [extra, setExtra] = useState("");
  const [contas, setContas] = useState("");
  const [meta, setMeta] = useState("500");

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalGastos =
    gastos.reduce(
      (acc, item) => acc + item.valor,
      0
    );

  const saldo =
    receitas -
    (Number(contas) || 0) -
    totalGastos;

  function adicionarGasto() {
    if (!nomeGasto || !valorGasto) return;

    setGastos([
      ...gastos,
      {
        nome: nomeGasto,
        valor: Number(valorGasto)
      }
    ]);

    setNomeGasto("");
    setValorGasto("");
  }

  if (loading) {
    return (
      <div style={{
        background:"#0D47A1",
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        color:"white"
      }}>
        <div style={{textAlign:"center"}}>
          <img
            src="/logo.png"
            style={{width:"120px"}}
          />
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
        <h2>👋 Olá Rogério</h2>
      </div>

      <div style={{padding:"15px"}}>

        {tela==="inicio" && (
          <div style={{
            background:"white",
            padding:"20px",
            borderRadius:"20px"
          }}>
            <h3>💰 Saldo</h3>
            <h1>R$ {saldo.toFixed(2)}</h1>

            <p>Receitas: R$ {receitas}</p>
            <p>Gastos: R$ {totalGastos}</p>
          </div>
        )}

        {tela==="gastos" && (
          <div style={{
            background:"white",
            padding:"20px",
            borderRadius:"20px"
          }}>
            <h3>💸 Adicionar gasto</h3>

            <input
              placeholder="Nome"
              value={nomeGasto}
              onChange={(e)=>setNomeGasto(e.target.value)}
            />

            <br/><br/>

            <input
              placeholder="Valor"
              value={valorGasto}
              onChange={(e)=>setValorGasto(e.target.value)}
            />

            <br/><br/>

            <button onClick={adicionarGasto}>
              Adicionar
            </button>

            <hr/>

            {gastos.map((item,index)=>(
              <p key={index}>
                {item.nome} — R$ {item.valor}
              </p>
            ))}
          </div>
        )}

        {tela==="metas" && (
          <div style={{
            background:"white",
            padding:"20px",
            borderRadius:"20px"
          }}>
            <h3>🎯 Meta</h3>

            <input
              value={meta}
              onChange={(e)=>setMeta(e.target.value)}
            />

            <p>
              Guardar: R$ {meta}
            </p>
          </div>
        )}

        {tela==="historico" && (
          <div style={{
            background:"white",
            padding:"20px",
            borderRadius:"20px"
          }}>
            <h3>📅 Histórico</h3>
            <p>Maio em desenvolvimento...</p>
          </div>
        )}

        {tela==="perfil" && (
          <div style={{
            background:"white",
            padding:"20px",
            borderRadius:"20px"
          }}>
            <h3>⚙️ Perfil</h3>
            <p>Rogério</p>
          </div>
        )}

      </div>

      <div style={{
        position:"fixed",
        bottom:0,
        left:0,
        width:"100%",
        background:"white",
        display:"flex",
        justifyContent:"space-around",
        padding:"12px"
      }}>
        <div onClick={()=>setTela("inicio")}>🏠</div>
        <div onClick={()=>setTela("gastos")}>💸</div>
        <div onClick={()=>setTela("metas")}>🎯</div>
        <div onClick={()=>setTela("historico")}>📅</div>
        <div onClick={()=>setTela("perfil")}>⚙️</div>
      </div>

    </div>
  );
              }
