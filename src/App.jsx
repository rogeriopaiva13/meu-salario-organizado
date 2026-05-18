import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);

  const [salario, setSalario] = useState("");
  const [contas, setContas] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2200);
  }, []);

  const saldo =
    (Number(salario) || 0) -
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
        <div
          style={{
            textAlign:"center"
          }}
        >
          <img
            src="/logo.png"
            style={{
              width:"140px",
              marginBottom:"25px"
            }}
          />

          <h1>
            Meu Salário Organizado
          </h1>

          <p>
            Organize hoje, realize amanhã
          </p>

          <div
            style={{
              marginTop:"30px"
            }}
          >
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding:"20px"
    }}>
      <img
        src="/logo-horizontal.png"
        style={{
          width:"250px",
          display:"block",
          margin:"20px auto"
        }}
      />

      <h2>💰 Meu App</h2>

      <input
        placeholder="Salário"
        value={salario}
        onChange={(e)=>
        setSalario(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Contas"
        value={contas}
        onChange={(e)=>
        setContas(e.target.value)}
      />

      <h2>
        Saldo:
        R$ {saldo}
      </h2>
    </div>
  );
}
