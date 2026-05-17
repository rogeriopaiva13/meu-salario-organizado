       import React, { useState, useEffect } from 'react';

export default function App() {
  const [salario, setSalario] = useState(
    localStorage.getItem('salario') || ''
  );

  const [extra, setExtra] = useState(
    localStorage.getItem('extra') || ''
  );

  const [contas, setContas] = useState(
    localStorage.getItem('contas') || ''
  );

  const [diaadia, setDiaadia] = useState(
    localStorage.getItem('diaadia') || ''
  );

  const [guardar, setGuardar] = useState(
    localStorage.getItem('guardar') || ''
  );

  useEffect(() => {
    localStorage.setItem('salario', salario);
    localStorage.setItem('extra', extra);
    localStorage.setItem('contas', contas);
    localStorage.setItem('diaadia', diaadia);
    localStorage.setItem('guardar', guardar);
  }, [salario, extra, contas, diaadia, guardar]);

  const entrada =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const saida =
    (Number(contas) || 0) +
    (Number(diaadia) || 0) +
    (Number(guardar) || 0);

  const saldo = entrada - saida;

  const progresso =
    entrada > 0
      ? Math.min((saida / entrada) * 100, 100)
      : 0;

  let status = "🟢 Sobrou dinheiro";
  let mensagem = "Boa! Você organizou seu mês";

  if (saldo < 0) {
    status = "🔴 Gastou mais do que recebeu";
    mensagem = "Atenção: mês no vermelho";
  } else if (saldo <= 300) {
    status = "🟡 Mês apertado";
    mensagem = "Cuidado com os gastos";
  }

  const limpar = () => {
    localStorage.clear();

    setSalario('');
    setExtra('');
    setContas('');
    setDiaadia('');
    setGuardar('');
  };

  const campo = (titulo, valor, funcao) => (
    <input
      type="number"
      placeholder={titulo}
      value={valor}
      onChange={(e) => funcao(e.target.value)}
      style={{
        width:'100%',
        padding:'14px',
        marginBottom:'10px',
        fontSize:'18px',
        borderRadius:'10px',
        border:'1px solid #ccc'
      }}
    />
  );

  return (
    <div
      style={{
        padding:'20px',
        maxWidth:'420px',
        margin:'20px auto',
        fontFamily:'Arial',
        textAlign:'center'
      }}
    >

      <img
        src="/logo.png"
        alt="Meu Salário Organizado"
        style={{
          width:'100%',
          maxWidth:'260px',
          margin:'0 auto 20px',
          display:'block'
        }}
      />

      <p style={{
        fontSize:'18px',
        marginBottom:'20px'
      }}>
        Organize seu dinheiro de forma simples
      </p>

      {campo("Salário", salario, setSalario)}
      {campo("Extra / Bico", extra, setExtra)}
      {campo("Contas", contas, setContas)}
      {campo("Dia a dia", diaadia, setDiaadia)}
      {campo("Guardar", guardar, setGuardar)}

      <div
        style={{
          background:"#eee",
          height:"20px",
          borderRadius:"20px",
          overflow:"hidden",
          marginTop:"20px"
        }}
      >
        <div
          style={{
            width:`${progresso}%`,
            background:"green",
            height:"100%"
          }}
        />
      </div>

      <p>{progresso.toFixed(0)}% usado</p>

      <h2 style={{
        marginTop:'25px'
      }}>
        Saldo: R$ {saldo.toFixed(2)}
      </h2>

      <div
        style={{
          marginTop:'20px',
          padding:'15px',
          borderRadius:'15px',
          background:'#f3f3f3'
        }}
      >
        <b>{status}</b>

        <p>{mensagem}</p>
      </div>

      <button
        onClick={limpar}
        style={{
          marginTop:'20px',
          width:'100%',
          padding:'14px',
          border:'none',
          borderRadius:'12px',
          background:'black',
          color:'white',
          fontSize:'16px'
        }}
      >
        Novo mês
      </button>

    </div>
  );
} 
