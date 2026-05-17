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

const [installPrompt,setInstallPrompt]=useState(null)

useEffect(()=>{
setTimeout(()=>{
setLoading(false)
},1800)
},[])

useEffect(()=>{
const handler=(e)=>{
e.preventDefault()
setInstallPrompt(e)
}

window.addEventListener(
'beforeinstallprompt',
handler
)

return()=>{
window.removeEventListener(
'beforeinstallprompt',
handler
)
}
},[])

useEffect(()=>{
localStorage.setItem('salario',salario);
localStorage.setItem('extra',extra);
localStorage.setItem('contas',contas);
localStorage.setItem('diaadia',diaadia);
localStorage.setItem('guardar',guardar);
localStorage.setItem('mes',mes);
localStorage.setItem('meta',meta);

localStorage.setItem(
'historico',
JSON.stringify(historico)
)

},[
salario,
extra,
contas,
diaadia,
guardar,
mes,
meta,
historico
])

if(loading){
return(
<div style={{
background:'#111827',
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
background:'#1d4ed8',
borderRadius:'30px',
border:'5px solid #facc15',
fontSize:'55px',
display:'flex',
alignItems:'center',
justifyContent:'center',
margin:'auto'
}}>
💰
</div>

<h1>Meu Salário</h1>
<p style={{opacity:.7}}>
Organizado
</p>
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

const progresso=
entrada>0
?Math.min((saida/entrada)*100,100)
:0

let status='🟢 Sobrou dinheiro'
let cor='#dcfce7'

if(saldo<0){
status='🔴 Gastou mais que recebeu'
cor='#fee2e2'
}else if(saldo<=300){
status='🟡 Mês apertado'
cor='#fef3c7'
}

const limpar=()=>{
setHistorico([
...historico,
{
mes,
saldo
}
])

setSalario('')
setExtra('')
setContas('')
setDiaadia('')
setGuardar('')
}

const instalar=async()=>{
if(installPrompt){
await installPrompt.prompt()
}
}

const campo={
width:'100%',
padding:'14px',
marginBottom:'12px',
borderRadius:'12px',
border:'1px solid #ddd'
}

return(
<div style={{
background:'#f3f4f6',
minHeight:'100vh',
padding:'20px'
}}>

<div style={{
maxWidth:'430px',
margin:'auto',
background:'white',
padding:'24px',
borderRadius:'24px'
}}>

<div style={{textAlign:'center'}}>

<div style={{
fontSize:'55px'
}}>
💰
</div>

<h1>
Meu Salário Organizado
</h1>

</div>

<select
value={mes}
onChange={(e)=>setMes(e.target.value)}
style={campo}
>
<option>Abril</option>
<option>Maio</option>
<option>Junho</option>
<option>Julho</option>
</select>

<input
type='number'
value={meta}
onChange={(e)=>setMeta(e.target.value)}
placeholder='Meta'
style={campo}
/>

<div style={{
background:'#dcfce7',
padding:'10px',
borderRadius:'12px',
marginBottom:'10px',
textAlign:'center'
}}>
🎯 Meta: R$ {meta}
</div>

<input placeholder='Salário' value={salario}
onChange={(e)=>setSalario(e.target.value)}
style={campo}/>

<input placeholder='Extra/Bico'
value={extra}
onChange={(e)=>setExtra(e.target.value)}
style={campo}/>

<input placeholder='Contas'
value={contas}
onChange={(e)=>setContas(e.target.value)}
style={campo}/>

<input placeholder='Dia a dia'
value={diaadia}
onChange={(e)=>setDiaadia(e.target.value)}
style={campo}/>

<input placeholder='Guardar'
value={guardar}
onChange={(e)=>setGuardar(e.target.value)}
style={campo}/>

<div>
Uso salário {progresso.toFixed(0)}%
<div style={{
height:'15px',
background:'#ddd',
borderRadius:'999px'
}}>
<div style={{
width:`${progresso}%`,
height:'100%',
background:'black',
borderRadius:'999px'
}}/>
</div>
</div>

<div style={{
background:cor,
padding:'18px',
marginTop:'20px',
borderRadius:'20px',
textAlign:'center'
}}>
<h2>{status}</h2>
<h1>R$ {saldo.toFixed(2)}</h1>
</div>

<div style={{
marginTop:'15px',
padding:'15px',
border:'1px solid #eee',
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
color:
h.saldo>=0
?'green'
:'red'
}}
>
{h.mes}:
R$ {h.saldo}
</div>
))
}
</div>

<div style={{
background:'#ede9fe',
padding:'15px',
marginTop:'15px',
borderRadius:'15px',
textAlign:'center'
}}>
👨‍👩‍👧 Modo Família em breve
</div>

<button
onClick={instalar}
style={{
width:'100%',
padding:'16px',
marginTop:'15px',
background:'#16a34a',
color:'white',
border:'none',
borderRadius:'15px'
}}
>
📲 Instalar App
</button>

<button
onClick={limpar}
style={{
width:'100%',
padding:'16px',
marginTop:'10px',
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
