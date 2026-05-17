import React, { useState, useEffect } from 'react';

export default function App() {
const [loading,setLoading]=useState(true)

const [salario,setSalario]=useState(localStorage.getItem('salario')||'');
const [extra,setExtra]=useState(localStorage.getItem('extra')||'');
const [contas,setContas]=useState(localStorage.getItem('contas')||'');
const [diaadia,setDiaadia]=useState(localStorage.getItem('diaadia')||'');
const [guardar,setGuardar]=useState(localStorage.getItem('guardar')||'');
const [mes,setMes]=useState(localStorage.getItem('mes')||'Maio');
const [meta,setMeta]=useState(localStorage.getItem('meta')||'500');

const [historico,setHistorico]=useState(
JSON.parse(localStorage.getItem('historico'))||[]
);

useEffect(()=>{
setTimeout(()=>setLoading(false),1500)
},[])

useEffect(()=>{
localStorage.setItem('salario',salario)
localStorage.setItem('extra',extra)
localStorage.setItem('contas',contas)
localStorage.setItem('diaadia',diaadia)
localStorage.setItem('guardar',guardar)
localStorage.setItem('mes',mes)
localStorage.setItem('meta',meta)
localStorage.setItem(
'historico',
JSON.stringify(historico)
)
},[
salario,extra,contas,
diaadia,guardar,
mes,meta,historico
])

if(loading){
return(
<div style={{
background:'#0f172a',
height:'100vh',
display:'flex',
alignItems:'center',
justifyContent:'center',
color:'white'
}}>
<div style={{textAlign:'center'}}>
<div style={{
width:'110px',
height:'110px',
borderRadius:'30px',
background:'#2563eb',
border:'5px solid #facc15',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontSize:'55px',
margin:'auto'
}}>
💰
</div>
<h1>Meu Salário</h1>
<p>Organizado</p>
</div>
</div>
)
}

const entrada=
(Number(salario)||0)+
(Number(extra)||0)

const saida=
(Number(contas)||0)+
(Number(diaadia)||0)+
(Number(guardar)||0)

const saldo=entrada-saida

const limpar=()=>{
setHistorico([
...historico,
{mes,saldo}
])

setSalario('')
setExtra('')
setContas('')
setDiaadia('')
setGuardar('')
}

const barra=(valor)=>(
entrada>0
?`${(valor/entrada)*100}%`
:'0%'
)

return(
<div style={{
background:'#f1f5f9',
minHeight:'100vh',
padding:'20px'
}}>

<div style={{
maxWidth:'450px',
margin:'auto',
background:'white',
padding:'24px',
borderRadius:'25px'
}}>

<div style={{textAlign:'center'}}>
<div style={{fontSize:'60px'}}>💰</div>
<h1>Meu Salário Organizado</h1>
</div>

<div style={{
display:'grid',
gridTemplateColumns:'1fr 1fr 1fr',
gap:'10px',
marginTop:'20px'
}}>

<div style={{
background:'#dcfce7',
padding:'10px',
borderRadius:'12px',
textAlign:'center'
}}>
<div>Entrada</div>
<strong>R$ {entrada}</strong>
</div>

<div style={{
background:'#fee2e2',
padding:'10px',
borderRadius:'12px',
textAlign:'center'
}}>
<div>Saída</div>
<strong>R$ {saida}</strong>
</div>

<div style={{
background:'#dbeafe',
padding:'10px',
borderRadius:'12px',
textAlign:'center'
}}>
<div>Saldo</div>
<strong>R$ {saldo}</strong>
</div>

</div>

<select
value={mes}
onChange={(e)=>setMes(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'15px'}}
>
<option>Abril</option>
<option>Maio</option>
<option>Junho</option>
<option>Julho</option>
</select>

<input
placeholder='Meta'
value={meta}
onChange={(e)=>setMeta(e.target.value)}
style={{
width:'100%',
padding:'12px',
marginTop:'10px'
}}
/>

<input placeholder='Salário'
value={salario}
onChange={(e)=>setSalario(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'10px'}}
/>

<input placeholder='Extra/Bico'
value={extra}
onChange={(e)=>setExtra(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'10px'}}
/>

<input placeholder='Contas'
value={contas}
onChange={(e)=>setContas(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'10px'}}
/>

<input placeholder='Dia a dia'
value={diaadia}
onChange={(e)=>setDiaadia(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'10px'}}
/>

<input placeholder='Guardar'
value={guardar}
onChange={(e)=>setGuardar(e.target.value)}
style={{width:'100%',padding:'12px',marginTop:'10px'}}
/>

<div style={{marginTop:'20px'}}>
<h3>📊 Pra onde foi meu dinheiro</h3>

<div>Contas</div>
<div style={{background:'#ddd',borderRadius:'999px'}}>
<div style={{
width:barra(contas),
height:'14px',
background:'black'
}}/>
</div>

<div>Dia a dia</div>
<div style={{background:'#ddd',borderRadius:'999px'}}>
<div style={{
width:barra(diaadia),
height:'14px',
background:'black'
}}/>
</div>

<div>Guardar</div>
<div style={{background:'#ddd',borderRadius:'999px'}}>
<div style={{
width:barra(guardar),
height:'14px',
background:'black'
}}/>
</div>
</div>

<div style={{
marginTop:'20px',
border:'1px solid #eee',
padding:'15px',
borderRadius:'15px'
}}>
<h3>📅 Histórico</h3>

{
historico.length===0
?<p>Sem histórico</p>
:
historico.map((h,i)=>(
<div
key={i}
style={{
marginBottom:'10px',
padding:'10px',
borderRadius:'10px',
background:
h.saldo>=0
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
onClick={limpar}
style={{
width:'100%',
padding:'16px',
marginTop:'20px',
background:'black',
color:'white',
border:'none',
borderRadius:'15px'
}}
>
Salvar mês
</button>

</div>
</div>
)
  }
