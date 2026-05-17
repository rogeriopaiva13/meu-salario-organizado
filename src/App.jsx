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

  const [mes, setMes] = useState(
    localStorage.getItem('mes') || 'Maio'
  );

  const [meta, setMeta] = useState(
    localStorage.getItem('meta') || '500'
  );

  useEffect(() => {
    localStorage.setItem('salario', salario);
    localStorage.setItem('extra', extra);
    localStorage.setItem('contas', contas);
    localStorage.setItem('diaadia', diaadia);
    localStorage.setItem('guardar', guardar);
    localStorage.setItem('mes', mes);
    localStorage.setItem('meta', meta);
  }, [
    salario,
    extra,
    contas,
    diaadia,
    guardar,
    mes,
    meta
  ]);

  const entrada =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const saida =
    (Number(contas) || 0) +
    (Number(diaadia) || 0) +
    (Number(guardar) || 0);

  const saldo = entrada - saida;

  let status = '🟢 Sobrou dinheiro';
  let cor = '#d1fae5';

  if (saldo < 0) {
    status = '🔴 Gastando mais do que ganha';
    cor = '#fee2e2';
  } else if (saldo <= 300) {
    status = '🟡 Mês apertado';
    cor = '#fef3c7';
  }

  const progresso =
    entrada > 0
      ? Math.min((saida / entrada) * 100, 100)
      : 0;

  const alerta =
    progresso >= 80
      ? '⚠ Atenção: você já usou mais de 80% do salário'
      : '✅ Salário sob controle';

  const limpar = () => {
    setSalario('');
    setExtra('');
    setContas('');
    setDiaadia('');
    setGuardar('');
    localStorage.clear();
  };

  const campoStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    marginTop: '6px',
    marginBottom: '16px',
    fontSize: '16px'
  };

  return (
    <div
      style={{
        minHeight:'100vh',
        background:'#f3f4f6',
        padding:'20px',
        fontFamily:'Arial'
      }}
    >
      <div
        style={{
          maxWidth:'430px',
          margin:'0 auto',
          background:'white',
          borderRadius:'24px',
          padding:'24px',
          boxShadow:'0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'60px'}}>
            💰
          </div>

          <h1>Meu Salário Organizado</h1>

          <p style={{color:'#666'}}>
            Controle simples do seu dinheiro
          </p>
        </div>

        <div
          style={{
            display:'grid',
            gap:'10px',
            marginTop:'20px'
          }}
        >
          <select
            value={mes}
            onChange={(e)=>setMes(e.target.value)}
            style={campoStyle}
          >
            <option>Abril</option>
            <option>Maio</option>
            <option>Junho</option>
            <option>Julho</option>
          </select>

          <input
            type='number'
            placeholder='Meta do mês'
            value={meta}
            onChange={(e)=>setMeta(e.target.value)}
            style={campoStyle}
          />
        </div>

        <div
          style={{
            background:'#dcfce7',
            padding:'12px',
            borderRadius:'12px',
            textAlign:'center',
            marginBottom:'20px'
          }}
        >
          🎯 Meta: guardar R$ {meta}
        </div>

        <input
          type="number"
          placeholder="Salário"
          value={salario}
          onChange={(e)=>setSalario(e.target.value)}
          style={campoStyle}
        />

        <input
          type="number"
          placeholder="Extra / Bico"
          value={extra}
          onChange={(e)=>setExtra(e.target.value)}
          style={campoStyle}
        />

        <input
          type="number"
          placeholder="Contas"
          value={contas}
          onChange={(e)=>setContas(e.target.value)}
          style={campoStyle}
        />

        <input
          type="number"
          placeholder="Dia a dia"
          value={diaadia}
          onChange={(e)=>setDiaadia(e.target.value)}
          style={campoStyle}
        />

        <input
          type="number"
          placeholder="Guardar"
          value={guardar}
          onChange={(e)=>setGuardar(e.target.value)}
          style={campoStyle}
        />

        <div style={{marginTop:'20px'}}>
          <div
            style={{
              display:'flex',
              justifyContent:'space-between'
            }}
          >
            <span>Uso do salário</span>
            <strong>
              {progresso.toFixed(0)}%
            </strong>
          </div>

          <div
            style={{
              width:'100%',
              height:'18px',
              background:'#ddd',
              borderRadius:'999px',
              overflow:'hidden',
              marginTop:'8px'
            }}
          >
            <div
              style={{
                width:`${progresso}%`,
                height:'100%',
                background:'black'
              }}
            />
          </div>

          <div
            style={{
              textAlign:'center',
              marginTop:'10px'
            }}
          >
            {alerta}
          </div>
        </div>

        <div
          style={{
            background:cor,
            borderRadius:'20px',
            padding:'20px',
            marginTop:'25px',
            textAlign:'center'
          }}
        >
          <div>STATUS DO MÊS</div>

          <h2>{status}</h2>

          <h1>
            R$ {saldo.toFixed(2)}
          </h1>
        </div>

        <button
          onClick={limpar}
          style={{
            width:'100%',
            padding:'16px',
            marginTop:'20px',
            border:'none',
            borderRadius:'16px',
            background:'black',
            color:'white',
            fontWeight:'bold'
          }}
        >
          Novo mês
        </button>
      </div>
    </div>
  );
      }
