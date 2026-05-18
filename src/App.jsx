import React, { useState } from "react";

export default function App() {
  const [salario, setSalario] = useState("");
  const [extra, setExtra] = useState("");
  const [contas, setContas] = useState("");
  const [meta, setMeta] = useState("500");

  const receitas =
    (Number(salario)||0) +
    (Number(extra)||0);

  const saldo =
    receitas -
    (Number(contas)||0);

  return (
    <div style={{
      minHeight:"100vh",
      background:"#f5f7fb",
      fontFamily:"Arial"
    }}>

      <div style={{
        background:"#0D47A1",
        color:"white",
        padding:"30px",
        borderBottomLeftRadius:"30px",
        borderBottomRightRadius:"30px"
      }}>

        <img
          src="/logo-horizontal.png"
          style={{
            width:"220px",
            display:"block",
            margin:"0 auto 20px"
          }}
        />

        <h2>👋 Olá Rogério</h2>

        <p>
          Organize hoje, realize amanhã
        </p>

      </div>

      <div style={{
        padding:"15px"
      }}>

        <div style={{
          background:"white",
          padding:"20px",
          borderRadius:"20px",
          marginBottom:"15px"
        }}>
          <h3>🎯 Meta do mês</h3>

          <input
            value={meta}
            onChange={(e)=>
            setMeta(e.target.value)}
            style={{
              width:"100%",
              padding:"12px"
            }}
          />

          <p>
            Guardar:
            R$ {meta}
          </p>
        </div>

        <div style={{
          background:"white",
          padding:"20px",
          borderRadius:"20px",
          marginBottom:"15px"
        }}>
          <h3>💵 Receitas</h3>

          <input
            placeholder="Salário"
            value={salario}
            onChange={(e)=>
            setSalario(
            e.target.value
            )}
          />

          <br/><br/>

          <input
            placeholder="Extra"
            value={extra}
            onChange={(e)=>
            setExtra(
            e.target.value
            )}
          />
        </div>

        <div style={{
          background:"white",
          padding:"20px",
          borderRadius:"20px"
        }}>
          <h3>💳 Contas</h3>

          <input
            placeholder="Contas"
            value={contas}
            onChange={(e)=>
            setContas(
            e.target.value
            )}
          />

          <h2>
            Saldo:
            R$ {saldo}
          </h2>

        </div>

      </div>

    </div>
  );
              }
