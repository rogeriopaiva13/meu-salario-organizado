import React, { useState } from "react";

export default function App() {
  const [mes, setMes] = useState("Maio");
  const [meta, setMeta] = useState("500");
  const [salario, setSalario] = useState("");
  const [extra, setExtra] = useState("");
  const [contas, setContas] = useState("");

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const saldo =
    receitas -
    (Number(contas) || 0);

  return (
    <div
      style={{
        background:"#f3f4f6",
        minHeight:"100vh",
        fontFamily:"Arial",
        paddingBottom:"30px"
      }}
    >
      <div
        style={{
          background:"#0D47A1",
          color:"white",
          padding:"25px",
          borderBottomLeftRadius:"25px",
          borderBottomRightRadius:"25px"
        }}
      >
        <h2>👋 Olá, Rogério!</h2>
        <p>Vamos organizar seu mês?</p>
      </div>

      <div
        style={{
          margin:"15px",
          background:"white",
          borderRadius:"20px",
          padding:"20px",
          boxShadow:"0 2px 10px rgba(0,0,0,.1)"
        }}
      >
        <h3>Mês atual</h3>

        <select
          value={mes}
          onChange={(e)=>setMes(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            borderRadius:"10px",
            marginBottom:"15px"
          }}
        >
          <option>Janeiro</option>
          <option>Fevereiro</option>
          <option>Março</option>
          <option>Abril</option>
          <option>Maio</option>
          <option>Junho</option>
          <option>Julho</option>
          <option>Agosto</option>
          <option>Setembro</option>
          <option>Outubro</option>
          <option>Novembro</option>
          <option>Dezembro</option>
        </select>

        <input
          placeholder="🎯 Meta do mês"
          value={meta}
          onChange={(e)=>setMeta(e.target.value)}
          style={{
            width:"100%",
            padding:"12px",
            marginBottom:"15px"
          }}
        />

        <div
          style={{
            background:"#e8f0fe",
            padding:"15px",
            borderRadius:"15px",
            textAlign:"center",
            marginBottom:"15px"
          }}
        >
          🎯 Meta: guardar R$ {meta}
        </div>

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
            padding:"12px",
            marginBottom:"10px"
          }}
        />

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

        <div
          style={{
            background:"#0D47A1",
            color:"white",
            borderRadius:"15px",
            marginTop:"20px",
            padding:"20px"
          }}
        >
          <h3>Resumo</h3>

          <p>💵 Receitas: R$ {receitas}</p>

          <p>💰 Saldo: R$ {saldo}</p>
        </div>
      </div>
    </div>
  );
}
