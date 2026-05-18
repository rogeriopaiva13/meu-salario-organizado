import React, { useState, useEffect } from 'react';

export default function App() {
  const [salario, setSalario] = useState(localStorage.getItem('salario') || '');
  const [extra, setExtra] = useState(localStorage.getItem('extra') || '');
  const [contas, setContas] = useState(localStorage.getItem('contas') || '');
  const [diaadia, setDiaadia] = useState(localStorage.getItem('diaadia') || '');
  const [guardar, setGuardar] = useState(localStorage.getItem('guardar') || '');

  const [mes, setMes] = useState(
    localStorage.getItem('mes') || 'Maio'
  );

  const [meta, setMeta] = useState(
    localStorage.getItem('meta') || '500'
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem('historico')) || []
  );

  useEffect(() => {
    localStorage.setItem('salario', salario);
    localStorage.setItem('extra', extra);
    localStorage.setItem('contas', contas);
    localStorage.setItem('diaadia', diaadia);
    localStorage.setItem('guardar', guardar);
    localStorage.setItem('mes', mes);
    localStorage.setItem('meta', meta);

    localStorage.setItem(
      'historico',
      JSON.stringify(historico)
    );
  }, [
    salario,
    extra,
    contas,
    diaadia,
    guardar,
    mes,
    meta,
    historico
  ]);

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

  const alerta =
    progresso >= 80
      ? '⚠ Atenção: você já usou mais de 80%'
      : '✅ Salário sob controle';

  let status = '🟢 Sobrou dinheiro';
  let cor = '#dcfce7';

  if (saldo < 0) {
    status = '🔴 Gastou mais que recebeu';
    cor = '#fee2e2';
  } else if (saldo <= 300) {
    status = '🟡 Mês apertado';
    cor = '#fef3c7';
  }

  const salvarMes = () => {
    setHistorico([
      ...historico,
      {
        mes,
        saldo: saldo.toFixed(2)
      }
    ]);

    setSalario('');
    setExtra('');
    setContas('');
    setDiaadia('');
    setGuardar('');
  };

  const campo = {
    width:'100%',
    padding:'14px',
    border:'1px solid #ccc',
    borderRadius:'12px',
    marginBottom:'10px',
    fontSize:'16px'
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
          padding:'24px',
          borderRadius:'24px',
          boxShadow:'0 10px 30px rgba(0,0,0,.1)'
        }}
      >

        <img
          src="/logo-horizontal.png"
          alt="Meu Salário Organizado"
          style={{
            width:'100%',
            maxWidth:'280px',
            display:'block',
            margin:'0 auto 20px'
          }}
        />

        <p
          style={{
            textAlign:'center',
            color:'#666',
            marginBottom:'20px'
          }}
        >
          Organize seu dinheiro de forma simples
        </p>

        <select
          value={mes}
          onChange={(e)=>setMes(e.target.value)}
          style={campo}
        >
          <option>Abril</option>
          <option>Maio</option>
          <option>Junho</option>
          <option>Julho</option>
          <option>Agosto</option>
        </select>

        <input
          type="number"
          value={meta}
          onChange={(e)=>setMeta(e.target.value)}
          placeholder="Meta do mês"
          style={campo}
        />

        <div
          style={{
            background:'#dbeafe',
            padding:'10px',
            borderRadius:'12px',
            textAlign:'center',
            marginBottom:'15px'
          }}
        >
          🎯 Meta: guardar R$ {meta}
        </div>

        <input type="number" placeholder="Salário" value={salario} onChange={(e)=>setSalario(e.target.value)} style={campo}/>
        <input type="number" placeholder="Extra / Bico" value={extra} onChange={(e)=>setExtra(e.target.value)} style={campo}/>
        <input type="number" placeholder="Contas" value={contas} onChange={(e)=>setContas(e.target.value)} style={campo}/>
        <input type="number" placeholder="Dia a dia" value={diaadia} onChange={(e)=>setDiaadia(e.target.value)} style={campo}/>
        <input type="number" placeholder="Guardar" value={guardar} onChange={(e)=>setGuardar(e.target.value)} style={campo}/>

        <div style={{marginTop:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>Uso do salário</span>
            <strong>{progresso.toFixed(0)}%</strong>
          </div>

          <div
            style={{
              background:'#ddd',
              height:'16px',
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
            marginTop:'20px',
            padding:'20px',
            borderRadius:'20px',
            textAlign:'center'
          }}
        >
          <div>STATUS DO MÊS</div>
          <h2>{status}</h2>
          <h1>R$ {saldo.toFixed(2)}</h1>
        </div>

        <div
          style={{
            marginTop:'20px',
            padding:'15px',
            border:'1px solid #eee',
            borderRadius:'15px'
          }}
        >
          <h3>📅 Histórico</h3>

          {
            historico.length===0
            ? <p>Sem histórico ainda</p>
            : historico.map((h,i)=>(
              <div
                key={i}
                style={{
                  padding:'10px',
                  borderRadius:'10px',
                  marginBottom:'10px',
                  background:
                  Number(h.saldo)>=0
                  ?'#dcfce7'
                  :'#fee2e2'
                }}
              >
                {h.mes}: R$ {h.saldo}
              </div>
            ))
          }

        </div>

        <button
          onClick={salvarMes}
          style={{
            width:'100%',
            marginTop:'20px',
            padding:'16px',
            background:'black',
            color:'white',
            border:'none',
            borderRadius:'16px',
            fontWeight:'bold'
          }}
        >
          Salvar mês
        </button>

      </div>
    </div>
  );
}
