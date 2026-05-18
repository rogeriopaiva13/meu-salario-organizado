import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  const [salario, setSalario] = useState("");
  const [extra, setExtra] = useState("");
  const [contas, setContas] = useState("");
  const [meta, setMeta] = useState("500");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const saldo =
    receitas -
    (Number(contas) || 0);

  if (loading) {
    return (
      <div
        style={{
          background:"#0D47A1",
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          color:"white"
        }}
      >
        <div style={{textAlign:"center"}}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width:"120px",
              marginBottom:"20px"
            }}
          />

          <h1>Meu Salário Organizado</h1>

          <p>Organize hoje, realize amanhã</p>

          <div style={{marginTop:"20px"}}>
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:"#f5f7fb",
        minHeight:"100vh",
        paddingBottom:"90px",
        fontFamily:"Arial"
      }}
    >
      <div
        style={{
          background:"#0D47A1",
          color:"white",
          padding:"25px",
          borderBottomLeftRadius:"30px",
          borderBottomRightRadius:"30px"
        }}
      >
        <img
          src="/logo-horizontal.png"
          alt="Logo"
          style={{
            width:"220px",
            display:"block",
            margin:"0 auto 20px"
          }}
        />

        <h2>👋 Olá Rogério</h2>

        <p>Vamos organizar seu mês?</p>
      </div>

      <div style={{padding:"15px"}}>

        <div
          style={{
            background:"white",
            borderRadius:"20px",
            padding:"20px",
            marginBottom:"15px"
          }}
        >
          <h3>🎯 Meta do mês</h3>

          <input
            value={meta}
            onChange={(e)=>setMeta(e.target.value)}
            style={{
              width:"100%",
              padding:"12px"
            }}
          />

          <p>Guardar: R$ {meta}</p>
        </div>

        <div
          style={{
            background:"white",
            borderRadius:"20px",
            padding:"20px",
            marginBottom:"15px"
          }}
        >
          <h3>💵 Receitas</h3>

          <input
            type="number"
            placeholder="Salário"
            value={salario}
            onChange={(e)=>setSalario(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"10px"
            }}
          />

          <input
            type="number"
            placeholder="Extra / Bico"
            value={extra}
            onChange={(e)=>setExtra(e.target.value)}
            style={{
              width:"100%",
              padding:"12px"
            }}
          />
        </div>

        <div
          style={{
            background:"white",
            borderRadius:"20px",
            padding:"20px"
          }}
        >
          <h3>💳 Contas</h3>

          <input
            type="number"
            placeholder="Contas"
            value={contas}
            onChange={(e)=>setContas(e.target.value)}
            style={{
              width:"100%",
              padding:"12px"
            }}
          />

          <h2 style={{marginTop:"20px"}}>
            💰 Saldo: R$ {saldo.toFixed(2)}
          </h2>
        </div>

      </div>

      <div
        style={{
          position:"fixed",
          bottom:0,
          left:0,
          width:"100%",
          background:"white",
          borderTop:"1px solid #ddd",
          display:"flex",
          justifyContent:"space-around",
          padding:"12px 0"
        }}
      >
        <div style={{textAlign:"center"}}>
          🏠
          <div style={{fontSize:"12px"}}>Início</div>
        </div>

        <div style={{textAlign:"center"}}>
          💸
          <div style={{fontSize:"12px"}}>Gastos</div>
        </div>

        <div style={{textAlign:"center"}}>
          🎯
          <div style={{fontSize:"12px"}}>Metas</div>
        </div>

        <div style={{textAlign:"center"}}>
          📅
          <div style={{fontSize:"12px"}}>Histórico</div>
        </div>

        <div style={{textAlign:"center"}}>
          ⚙️
          <div style={{fontSize:"12px"}}>Perfil</div>
        </div>
      </div>

    </div>
  );
}
