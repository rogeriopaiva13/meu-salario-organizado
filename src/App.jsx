import { useState, useEffect } from 'react'

export default function App() {
  const [mes,setMes]=useState('Maio')
  const [meta,setMeta]=useState(50)

  const [salario,setSalario]=useState(
    localStorage.getItem('salario') || 0
  )
  const [extra,setExtra]=useState(
    localStorage.getItem('extra') || 0
  )
  const [contas,setContas]=useState(
    localStorage.getItem('contas') || 0
  )
  const [diaadia,setDiaadia]=useState(
    localStorage.getItem('diaadia') || 0
  )
  const [guardar,setGuardar]=useState(
    localStorage.getItem('guardar') || 0
  )

  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false)
    },1800)
  },[])

  useEffect(()=>{
    localStorage.setItem('salario',salario)
    localStorage.setItem('extra',extra)
    localStorage.setItem('contas',contas)
    localStorage.setItem('diaadia',diaadia)
    localStorage.setItem('guardar',guardar)
  },[
    salario,
    extra,
    contas,
    diaadia,
    guardar
  ])

  const entrada=
    Number(salario)+Number(extra)

  const saida=
    Number(contas)+
    Number(diaadia)+
    Number(guardar)

  const total=entrada-saida

  const progresso=
    entrada>0
    ?Math.min((saida/entrada)*100,100)
    :0

  const limpar=()=>{
    setSalario(0)
    setExtra(0)
    setContas(0)
    setDiaadia(0)
    setGuardar(0)
    localStorage.clear()
  }

  if(loading){
    return(
      <div style={{
        minHeight:'100vh',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      }}>
        <h1>💰 Meu Salário Organizado</h1>
      </div>
    )
  }

  return(
    <div style={{
      maxWidth:'400px',
      margin:'20px auto',
      padding:'20px'
    }}>

      <h1>
        Meu Salário Organizado
      </h1>

      <input
      placeholder="Salário"
      value={salario}
      onChange={(e)=>
      setSalario(e.target.value)}
      />

      <input
      placeholder="Extra"
      value={extra}
      onChange={(e)=>
      setExtra(e.target.value)}
      />

      <input
      placeholder="Contas"
      value={contas}
      onChange={(e)=>
      setContas(e.target.value)}
      />

      <input
      placeholder="Dia a dia"
      value={diaadia}
      onChange={(e)=>
      setDiaadia(e.target.value)}
      />

      <input
      placeholder="Guardar"
      value={guardar}
      onChange={(e)=>
      setGuardar(e.target.value)}
      />

      <h3>
      Uso: {progresso.toFixed(0)}%
      </h3>

      <h2>
      Saldo: R$ {total.toFixed(2)}
      </h2>

      <button onClick={limpar}>
      Novo mês
      </button>

    </div>
  )
}
