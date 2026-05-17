import React, { useState } from 'react';

export default function App() {
  const [salario, setSalario] = useState('');
  const [contas, setContas] = useState('');

  const saldo =
    (Number(salario) || 0) -
    (Number(contas) || 0);

  return (
    <div
      style={{
        padding:'20px',
        maxWidth:'400px',
        margin:'40px auto',
        fontFamily:'Arial',
        textAlign:'center'
      }}
    >
      <img
        src="/logo.png"
        alt="Meu Salário Organizado"
        style={{
          width:'100%',
          maxWidth:'280px',
          margin:'0 auto 20px',
          display:'block'
        }}
      />

      <p style={{fontSize:'20px'}}>
        Organize seu dinheiro de forma simples
      </p>

      <input
        type="number"
        placeholder="Salário"
        value={salario}
        onChange={(e)=>setSalario(e.target.value)}
        style={{
          width:'100%',
          padding:'12px',
          marginBottom:'10px',
          fontSize:'18px'
        }}
      />

      <input
        type="number"
        placeholder="Contas"
        value={contas}
        onChange={(e)=>setContas(e.target.value)}
        style={{
          width:'100%',
          padding:'12px',
          fontSize:'18px'
        }}
      />

      <h2 style={{marginTop:'30px'}}>
        Saldo: R$ {saldo}
      </h2>
    </div>
  );
            }
