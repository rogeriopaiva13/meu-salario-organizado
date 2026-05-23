import React, { useState, useEffect } from "react";

import {
FaHome,
FaWallet,
FaBullseye,
FaTrophy,
FaUser,
FaMoneyBillWave,
FaFileInvoiceDollar,
FaHistory,
} from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, provider } from "./firebase";
import Header from "./components/Header";
export default function App() {
const [loading, setLoading] = useState(true);
const [tela, setTela] = useState("inicio");
const [ocultarValores, setOcultarValores] = useState(false);
const [usuario, setUsuario] = useState(null);

const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("fotoPerfil") || "");
const [nome, setNome] = useState(localStorage.getItem("nome") || "");
const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
const [extra, setExtra] = useState(localStorage.getItem("extra") || "");

const [tipoMeta, setTipoMeta] = useState(localStorage.getItem("tipoMeta") || "Carro");
const [nomeMeta, setNomeMeta] = useState(localStorage.getItem("nomeMeta") || "Meu objetivo");
const [valorMetaTotal, setValorMetaTotal] = useState(localStorage.getItem("valorMetaTotal") || "30000");
const [valorGuardado, setValorGuardado] = useState(localStorage.getItem("valorGuardado") || "0");
const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");
const [xp, setXp] = useState(Number(localStorage.getItem("xp")) || 0);

const [nomeGasto, setNomeGasto] = useState("");
const [valorGasto, setValorGasto] = useState("");
const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

const [nomeConta, setNomeConta] = useState("");
const [valorConta, setValorConta] = useState("");
const [categoriaConta, setCategoriaConta] = useState("Luz");
const [vencimentoConta, setVencimentoConta] = useState("");

const [gastos, setGastos] = useState(JSON.parse(localStorage.getItem("gastos")) || []);
const [contas, setContas] = useState(JSON.parse(localStorage.getItem("contasLista")) || []);
const [historico, setHistorico] = useState(JSON.parse(localStorage.getItem("historicoFinanceiro")) || []);

const categorias = {
Alimentação: { icone: "🍔", cor: "#fff3e0", texto: "#e65100" },
Transporte: { icone: "🚗", cor: "#e3f2fd", texto: "#0D47A1" },
Casa: { icone: "🏠", cor: "#fff8e1", texto: "#8a6d00" },
Saúde: { icone: "💊", cor: "#e8f5e9", texto: "#1b5e20" },
Lazer: { icone: "🎮", cor: "#f3e5f5", texto: "#6a1b9a" },
Outros: { icone: "🛒", cor: "#e0f2f1", texto: "#00695c" },
};

const categoriasContas = {
Luz: "💡",
Água: "💧",
Internet: "🌐",
Aluguel: "🏠",
Telefone: "📱",
Cartão: "💳",
Outros: "📄",
};

const metasOpcoes = {
Casa: { icone: "🏠", cor: "#e8f1ff", texto: "#0D47A1" },
Viagem: { icone: "✈️", cor: "#fff8e1", texto: "#b7791f" },
Carro: { icone: "🚗", cor: "#e8f5e9", texto: "#1b5e20" },
Outros: { icone: "🎯", cor: "#f3e5f5", texto: "#6a1b9a" },
};

useEffect(() => {
const timer = setTimeout(() => setLoading(false), 900);
return () => clearTimeout(timer);
}, []);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
setUsuario(user ? { nome: user.displayName, email: user.email, foto: user.photoURL } : null);
});
return () => unsubscribe();
}, []);

useEffect(() => localStorage.setItem("fotoPerfil", fotoPerfil), [fotoPerfil]);
useEffect(() => localStorage.setItem("nome", nome), [nome]);
useEffect(() => localStorage.setItem("salario", salario), [salario]);
useEffect(() => localStorage.setItem("extra", extra), [extra]);
useEffect(() => localStorage.setItem("tipoMeta", tipoMeta), [tipoMeta]);
useEffect(() => localStorage.setItem("nomeMeta", nomeMeta), [nomeMeta]);
useEffect(() => localStorage.setItem("valorMetaTotal", valorMetaTotal), [valorMetaTotal]);
useEffect(() => localStorage.setItem("valorGuardado", valorGuardado), [valorGuardado]);
useEffect(() => localStorage.setItem("meta", meta), [meta]);
useEffect(() => localStorage.setItem("xp", String(xp)), [xp]);
useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
useEffect(() => localStorage.setItem("contasLista", JSON.stringify(contas)), [contas]);
useEffect(() => localStorage.setItem("historicoFinanceiro", JSON.stringify(historico)), [historico]);

const fotoAtual = fotoPerfil || usuario?.foto || "";

function escolherFoto(event) {
const arquivo = event.target.files[0];
if (!arquivo) return;
const leitor = new FileReader();
leitor.onload = () => setFotoPerfil(leitor.result);
leitor.readAsDataURL(arquivo);
}

function removerFotoPerfil() {
const confirmar = window.confirm("Deseja remover a foto do perfil?");
if (!confirmar) return;
setFotoPerfil("");
localStorage.removeItem("fotoPerfil");
}

const moeda = (valor) => {
if (ocultarValores) return "••••••";
return Number(valor || 0).toLocaleString("pt-BR", {
style: "currency",
currency: "BRL",
});
};

const receitas = (Number(salario) || 0) + (Number(extra) || 0);
const totalGastos = gastos.reduce((acc, item) => acc + Number(item.valor || 0), 0);
const totalContas = contas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
const saidas = totalGastos + totalContas;
const saldo = receitas - saidas - (Number(meta) || 0);
const progresso = receitas > 0 ? Math.min((saidas / receitas) * 100, 100) : 0;

const valorTotalMeta = Number(valorMetaTotal) || 0;
const totalGuardado = Number(valorGuardado) || 0;
const faltaMeta = Math.max(valorTotalMeta - totalGuardado, 0);
const progressoMeta = valorTotalMeta > 0 ? Math.min((totalGuardado / valorTotalMeta) * 100, 100) : 0;
const mesesRestantes = Number(meta) > 0 ? Math.ceil(faltaMeta / Number(meta)) : 0;
const metaVisual = metasOpcoes[tipoMeta] || metasOpcoes.Outros;

let nivel = "🪙 Estagiário Financeiro";
let proximoNivel = 500;

if (xp >= 3000) {
nivel = "💎 Lenda Financeira";
proximoNivel = 3000;
} else if (xp >= 2000) {
nivel = "🚀 Magnata";
proximoNivel = 3000;
} else if (xp >= 1000) {
nivel = "👑 CEO das Finanças";
proximoNivel = 2000;
} else if (xp >= 500) {
nivel = "📈 Analista Financeiro";
proximoNivel = 1000;
}

const progressoXp = Math.min((xp / proximoNivel) * 100, 100);

const statusLimpo =
saldo < 0 ? "Mês no vermelho" : saldo <= 300 ? "Mês apertado" : "Salário sob controle";

const mensagensRuins = [
"🚨 Calma lá, milionário... o cartão não é patrocinador oficial.",
"💳 O banco pediu notícias suas.",
"🍔 Esse delivery tava valendo tudo isso mesmo?",
"📉 Seu saldo entrou em modo sobrevivência.",
"🫠 Seu dinheiro saiu para comprar pão e não voltou.",
];

const mensagensBoas = [
"🧠 Você está assustadoramente organizado.",
"🏆 O Serasa começa a te respeitar.",
"💎 Isso aqui já virou arte financeira.",
"📈 Seu futuro agradece pelas decisões de hoje.",
"😎 Hoje você está no modo adulto premium.",
];

const mensagensNeutras = [
"👀 Bora atualizar esse app antes que o dinheiro fuja?",
"💸 As contas não descansam, mas você também não precisa sofrer.",
"📊 Um lançamento por dia mantém o caos longe.",
"🧾 O app está de olho... com carinho, mas está.",
];

const mensagensMeta = [
"🎯 Meta concluída! O capitalismo perdeu.",
"🚗 Seu futuro carro acabou de sorrir.",
"🏡 Sua futura casa mandou um abraço.",
"💰 Você oficialmente entrou no modo crescimento.",
];

function mensagemAleatoria(lista) {
return lista[Math.floor(Math.random() * lista.length)];
}

const mensagemPrincipal =
progresso >= 80
? mensagemAleatoria(mensagensRuins)
: saldo > 0
? mensagemAleatoria(mensagensBoas)
: mensagemAleatoria(mensagensNeutras);

const mensagemMetaEspecial =
progressoMeta >= 100
? mensagemAleatoria(mensagensMeta)
: "Faltam cerca de " + mesesRestantes + " meses para concluir sua meta.";

const gastosPorCategoria = Object.keys(categorias)
.map((categoria) => {
const total = gastos
.filter((item) => item.categoria === categoria)
.reduce((acc, item) => acc + Number(item.valor || 0), 0);

return { categoria, total, ...categorias[categoria] };
})
.filter((item) => item.total > 0);

const maiorGastoCategoria = Math.max(...gastosPorCategoria.map((item) => item.total), 1);

const maiorCategoria =
gastosPorCategoria.length > 0
? gastosPorCategoria.reduce((maior, item) => (item.total > maior.total ? item : maior))
: null;

const ultimoMes = historico[0];
const saldoUltimoMes = ultimoMes ? Number(ultimoMes.saldo || 0) : 0;

const maiorValorHistorico = Math.max(
...historico.map((item) =>
Math.max(Number(item.entradas || 0), Number(item.gastos || 0) + Number(item.contas || 0))
),
1
);

const contasPendentes = contas.filter((item) => !item.pago);

const contasVencendo = contas.filter((item) => {
if (!item.vencimento || item.pago) return false;
const hoje = new Date().getDate();
const dias = Number(item.vencimento) - hoje;
return dias >= 0 && dias <= 3;
});

const contasAtrasadas = contas.filter((item) => {
if (!item.vencimento || item.pago) return false;
const hoje = new Date().getDate();
return hoje > Number(item.vencimento);
});

const conquistas = [
{
titulo: "Primeiro passo",
descricao: "Guardou os primeiros R$500.",
desbloqueada: totalGuardado >= 500,
icone: "🥉",
},
{
titulo: "Investidor iniciante",
descricao: "Alcançou 1000 pontos.",
desbloqueada: xp >= 1000,
icone: "🥈",
},
{
titulo: "Meta pela metade",
descricao: "Atingiu 50% da meta financeira.",
desbloqueada: progressoMeta >= 50,
icone: "🎯",
},
{
titulo: "Meta concluída",
descricao: "Concluiu sua meta financeira.",
desbloqueada: progressoMeta >= 100,
icone: "💎",
},
{
titulo: "Mestre do controle",
descricao: "Fechou 3 meses positivos.",
desbloqueada: historico.filter((item) => Number(item.saldo) > 0).length >= 3,
icone: "🏆",
},
];

const conquistasDesbloqueadas = conquistas.filter((item) => item.desbloqueada).length;
const totalConquistas = conquistas.length;

const alertasInteligentes = [
{
icone: contasAtrasadas.length > 0 ? "🚨" : contasVencendo.length > 0 ? "⚠️" : "🟢",
titulo:
contasAtrasadas.length > 0
? "Contas atrasadas"
: contasVencendo.length > 0
? "Contas vencendo"
: "Contas em dia",
texto:
contasAtrasadas.length > 0
? "Você tem " + contasAtrasadas.length + " conta(s) atrasada(s)."
: contasVencendo.length > 0
? "Você tem " + contasVencendo.length + " conta(s) vencendo em até 3 dias."
: "Nenhuma conta crítica no momento.",
cor: contasAtrasadas.length > 0 ? "#fff1f2" : contasVencendo.length > 0 ? "#fff7ed" : "#ecfdf5",
textoCor: contasAtrasadas.length > 0 ? "#be123c" : contasVencendo.length > 0 ? "#c2410c" : "#047857",
},
{
icone: progresso >= 80 ? "🚨" : "🟢",
titulo: progresso >= 80 ? "Atenção ao mês" : "Frase do app",
texto: mensagemPrincipal,
cor: progresso >= 80 ? "#fff1f2" : "#ecfdf5",
textoCor: progresso >= 80 ? "#be123c" : "#047857",
},
{
icone: maiorCategoria ? maiorCategoria.icone : "📊",
titulo: maiorCategoria ? "Maior gasto: " + maiorCategoria.categoria : "Sem gastos ainda",
texto: maiorCategoria
? "Você gastou " + moeda(maiorCategoria.total) + " nessa categoria."
: "Adicione gastos para gerar análises.",
cor: maiorCategoria ? maiorCategoria.cor : "#f3f4f6",
textoCor: maiorCategoria ? maiorCategoria.texto : "#374151",
},
{
icone: "🎯",
titulo: "Meta financeira",
texto: mensagemMetaEspecial,
cor: "#eef4ff",
textoCor: "#0D47A1",
},
{
icone: saldoUltimoMes > 0 ? "📈" : "📅",
titulo: historico.length > 0 ? "Comparativo mensal" : "Histórico em construção",
texto:
historico.length > 0
? saldoUltimoMes > 0
? "Último mês fechou positivo em " + moeda(saldoUltimoMes)
: "Último mês fechou em " + moeda(saldoUltimoMes)
: "Feche o primeiro mês para gerar histórico.",
cor: saldoUltimoMes > 0 ? "#ecfdf5" : "#f8fafc",
textoCor: saldoUltimoMes > 0 ? "#047857" : "#374151",
},
];

async function loginGoogle() {
try {
await signInWithPopup(auth, provider);
} catch (error) {
console.error(error);
alert("Não foi possível entrar com Google.");
}
}

async function logoutGoogle() {
try {
await signOut(auth);
} catch (error) {
console.error(error);
alert("Erro ao sair da conta.");
}
}

function ganharXp(valor) {
setXp((prev) => prev + valor);
}

async function adicionarGasto() {
if (!nomeGasto || !valorGasto) return;

const novo = {
nome: nomeGasto,
valor: Number(valorGasto),
categoria: categoriaGasto,
};

setGastos([...gastos, novo]);
ganharXp(5);

try {
await addDoc(collection(db, "gastos"), {
...novo,
usuario: usuario?.nome || nome || "Usuário",
email: usuario?.email || "",
criadoEm: serverTimestamp(),
});
} catch (error) {
console.error(error);
alert("Gasto salvo no celular, mas não foi para a nuvem.");
}

setNomeGasto("");
setValorGasto("");

}

function adicionarConta() {
if (!nomeConta || !valorConta || !vencimentoConta) return;

setContas([
...contas,
{
nome: nomeConta,
valor: Number(valorConta),
categoria: categoriaConta,
vencimento: Number(vencimentoConta),
pago: false,
},
]);

ganharXp(5);
setNomeConta("");
setValorConta("");
setVencimentoConta("");

}

function removerGasto(index) {
setGastos(gastos.filter((_, i) => i !== index));
}

function removerConta(index) {
setContas(contas.filter((_, i) => i !== index));
}

function alternarPagamentoConta(index) {
setContas(
contas.map((item, i) =>
i === index
? {
...item,
pago: !item.pago,
}
: item
)
);
}

function adicionarValorMetaMensal() {
const confirmar = window.confirm("Adicionar " + moeda(meta) + " ao valor guardado da meta?");
if (!confirmar) return;

setValorGuardado(String(totalGuardado + Number(meta || 0)));
ganharXp(20);

}

function iniciarNovoMes() {
const confirmar = window.confirm("Deseja fechar o mês atual e iniciar um novo?");
if (!confirmar) return;

const agora = new Date();

const novoHistorico = {
mes: agora.toLocaleDateString("pt-BR", {
month: "long",
year: "numeric",
}),
entradas: receitas,
gastos: totalGastos,
contas: totalContas,
metaMensal: Number(meta) || 0,
saldo,
criadoEm: agora.toISOString(),
};

setHistorico([novoHistorico, ...historico]);

if (saldo > 0) ganharXp(100);
if (progresso < 70) ganharXp(80);
if (progressoMeta >= 100) ganharXp(300);

setGastos([]);
setContas([]);
setSalario("");
setExtra("");

localStorage.removeItem("gastos");
localStorage.removeItem("contasLista");
localStorage.removeItem("salario");
localStorage.removeItem("extra");

}

function statusConta(vencimento, pago) {
const hoje = new Date().getDate();
const dia = Number(vencimento);

if (pago) {
return {
texto: "✅ Pago",
cor: "#ecfdf5",
textoCor: "#047857",
borda: "2px solid #10b981",
};
}

if (!dia) {
return {
texto: "🟡 Pendente",
cor: "#fefce8",
textoCor: "#a16207",
borda: "2px solid #facc15",
};
}

if (hoje > dia) {
return {
texto: "🚨 Atrasada",
cor: "#fff1f2",
textoCor: "#be123c",
borda: "2px solid #ef4444",
};
}

if (hoje === dia) {
return {
texto: "🔴 Vence hoje",
cor: "#fff1f2",
textoCor: "#be123c",
borda: "2px solid #ef4444",
};
}

if (dia - hoje <= 3) {
return {
texto: "⚠️ Vence em breve",
cor: "#fff7ed",
textoCor: "#c2410c",
borda: "2px solid #f59e0b",
};
}

return {
texto: "🟡 Pendente",
cor: "#fefce8",
textoCor: "#a16207",
borda: "2px solid #dbeafe",
};

}

const inputStyle = {
width: "100%",
padding: "16px",
borderRadius: "20px",
border: "1px solid #d9e2f3",
fontSize: "16px",
boxSizing: "border-box",
outline: "none",
background: "#f9fbff",
};

const card = {
background: "white",
padding: "22px",
borderRadius: "30px",
marginBottom: "18px",
boxShadow: "0 16px 40px rgba(13,71,161,0.10)",
border: "1px solid rgba(13,71,161,0.06)",
};

const primaryButton = {
width: "100%",
padding: "16px",
borderRadius: "20px",
border: "none",
background: "linear-gradient(135deg,#0D47A1,#1976D2)",
color: "white",
fontWeight: "bold",
fontSize: "15px",
boxShadow: "0 10px 24px rgba(13,71,161,0.22)",
};

const navItem = (id, icon, label) => (
<button
onClick={() => {
setTela(id);
setTimeout(() => {
document.getElementById("conteudo-principal")?.scrollIntoView({
behavior: "smooth",
block: "start",
});
}, 100);
}}
style={{
border: "none",
background: tela === id ? "#0D47A1" : "transparent",
color: tela === id ? "white" : "#6b7280",
borderRadius: "22px",
padding: "10px 12px",
minWidth: "64px",
fontWeight: "bold",
fontSize: "11px",
boxShadow: tela === id ? "0 10px 24px rgba(13,71,161,0.25)" : "none",
}}

> 

<div style={{ fontSize: "20px", lineHeight: "20px" }}>{icon}</div>  
<div style={{ marginTop: "4px" }}>{label}</div>  
</button>  
);  const AppLogo = () => (

<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>  
<div style={{ display: "flex", alignItems: "end", gap: "4px", height: "48px" }}>  
<div style={{ width: "10px", height: "22px", background: "white", borderRadius: "5px" }} />  
<div style={{ width: "10px", height: "34px", background: "white", borderRadius: "5px" }} />  
<div style={{ width: "10px", height: "46px", background: "white", borderRadius: "5px" }} />  
<div style={{ width: "10px", height: "28px", background: "#FDD835", borderRadius: "5px" }} />  
</div>  <div style={{ lineHeight: "32px" }}>    
    <div style={{ fontSize: "30px", fontWeight: "900", color: "white" }}>    
      Meu Salário    
    </div>    
    <div style={{ fontSize: "27px", fontWeight: "900", color: "#FDD835" }}>    
      Organizado    
    </div>    
  </div>    
</div>  );

const AvatarPerfil = () => (
<label style={{ cursor: "pointer" }}>
<input type="file" accept="image/*" onChange={escolherFoto} style={{ display: "none" }} />

{fotoAtual ? (
<img
src={fotoAtual}
alt="foto"
style={{
width: "52px",
height: "52px",
borderRadius: "50%",
border: "3px solid white",
objectFit: "cover",
}}
/>
) : (
<div
style={{
width: "52px",
height: "52px",
borderRadius: "50%",
border: "3px solid white",
background: "rgba(255,255,255,0.16)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "bold",
}}
>
👤
</div>
)}
</label>

);

if (loading) {
return (

<div  
style={{  
background: "linear-gradient(135deg,#0D47A1,#42A5F5)",  
minHeight: "100vh",  
display: "flex",  
justifyContent: "center",  
alignItems: "center",  
color: "white",  
fontFamily: "Arial",  
}}  
>  
<div style={{ textAlign: "center" }}>  
<AppLogo />  
<p style={{ color: "#FDD835", marginTop: "18px" }}>  
Organize hoje, realize amanhã  
</p>  
</div>  
</div>  
);  
}  return (

<div style={{ background: "#f3f7ff", minHeight: "100vh", paddingBottom: "125px", fontFamily: "Arial" }}>  
<Header
  usuario={usuario}
  nome={nome}
  saldo={saldo}
  progresso={progresso}
  receitas={receitas}
  saidas={saidas}
  xp={xp}
  nivel={nivel}
  progressoXp={progressoXp}
  ocultarValores={ocultarValores}
  setOcultarValores={setOcultarValores}
  loginGoogle={loginGoogle}
  logoutGoogle={logoutGoogle}
  fotoAtual={fotoAtual}
/>

<div id="conteudo-principal" />
 {tela === "inicio" && (
<div style={{ padding: "20px", marginTop: "-18px" }}>
<div style={card}>
<h2 style={{ marginTop: 0 }}>
{metaVisual.icone} {nomeMeta}
</h2>

<p>Objetivo: <strong>{moeda(valorMetaTotal)}</strong></p>    
    <p>Guardado: <strong>{moeda(valorGuardado)}</strong></p>    
    <p>Falta: <strong>{moeda(faltaMeta)}</strong></p>    
    <p><strong>{mensagemMetaEspecial}</strong></p>    

    <div style={{ width: "100%", height: "20px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden", marginTop: "12px" }}>    
      <div style={{ width: progressoMeta + "%", height: "20px", background: "linear-gradient(90deg,#0D47A1,#42a5f5)", borderRadius: "999px" }} />    
    </div>    
  </div>    

  <div style={card}>    
    <h2 style={{ marginTop: 0 }}>🚦 Alertas inteligentes</h2>    

    {alertasInteligentes.map((item, index) => (    
      <div key={index} style={{ background: item.cor, borderRadius: "18px", padding: "14px", marginBottom: "10px" }}>    
        <strong style={{ color: item.textoCor }}>    
          {item.icone} {item.titulo}    
        </strong>    

        <p style={{ margin: "6px 0 0", color: "#374151", lineHeight: "20px" }}>    
          {item.texto}    
        </p>    
      </div>    
    ))}    
  </div>    
</div>

)}

{tela === "entradas" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>💰 Entradas</h2>
<p>Salário</p>
<input style={inputStyle} value={ocultarValores ? "•••••" : salario} onChange={(e) => setSalario(e.target.value)} inputMode="decimal" />
<div style={{ height: "14px" }} />
<p>Extra</p>
<input style={inputStyle} value={ocultarValores ? "•••••" : extra} onChange={(e) => setExtra(e.target.value)} inputMode="decimal" />
</div>
</div>
)}

{tela === "gastos" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>💸 Gastos</h2>
<input style={inputStyle} placeholder="Nome do gasto" value={nomeGasto} onChange={(e) => setNomeGasto(e.target.value)} />
<div style={{ height: "12px" }} />
<input style={inputStyle} type="number" placeholder="Valor" value={valorGasto} onChange={(e) => setValorGasto(e.target.value)} />
<div style={{ height: "12px" }} />
<select style={inputStyle} value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)}>
{Object.keys(categorias).map((cat) => (
<option key={cat} value={cat}>{categorias[cat].icone} {cat}</option>
))}
</select>
<div style={{ height: "16px" }} />
<button onClick={adicionarGasto} style={primaryButton}>➕ Adicionar gasto +5 XP</button>
</div>

<div style={card}>    
    <h2>📊 Gastos por categoria</h2>    
    {gastosPorCategoria.length === 0 ? <p>Nenhum gasto lançado ainda.</p> : gastosPorCategoria.map((item) => {    
      const largura = (item.total / maiorGastoCategoria) * 100;    

      return (    
        <div key={item.categoria} style={{ marginBottom: "16px" }}>    
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>    
            <strong>{item.icone} {item.categoria}</strong>    
            <strong>{moeda(item.total)}</strong>    
          </div>    
          <div style={{ width: "100%", height: "18px", background: "#eceff1", borderRadius: "999px", overflow: "hidden" }}>    
            <div style={{ width: largura + "%", height: "18px", background: item.texto, borderRadius: "999px" }} />    
          </div>    
        </div>    
      );    
    })}    
  </div>    

  {gastos.map((item, index) => {    
    const cat = categorias[item.categoria] || categorias.Outros;    

    return (    
      <div key={index} style={card}>    
        <span style={{ background: cat.cor, color: cat.texto, padding: "7px 13px", borderRadius: "999px", fontWeight: "bold", fontSize: "13px" }}>    
          {cat.icone} {item.categoria}    
        </span>    
        <h3>{item.nome}</h3>    
        <p><strong>{moeda(item.valor)}</strong></p>    
        <button onClick={() => removerGasto(index)}>Excluir</button>    
      </div>    
    );    
  })}    
</div>

)}

{tela === "contas" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>📄 Contas Fixas</h2>
<input style={inputStyle} placeholder="Nome da conta ou cartão" value={nomeConta} onChange={(e) => setNomeConta(e.target.value)} />
<div style={{ height: "12px" }} />
<input style={inputStyle} type="number" placeholder="Valor" value={valorConta} onChange={(e) => setValorConta(e.target.value)} />
<div style={{ height: "12px" }} />
<select style={inputStyle} value={categoriaConta} onChange={(e) => setCategoriaConta(e.target.value)}>
{Object.keys(categoriasContas).map((cat) => (
<option key={cat} value={cat}>{categoriasContas[cat]} {cat}</option>
))}
</select>
<div style={{ height: "12px" }} />
<input
style={inputStyle}
type="number"
min="1"
max="31"
placeholder="Dia do vencimento. Ex: 10"
value={vencimentoConta}
onChange={(e) => setVencimentoConta(e.target.value)}
/>
<div style={{ height: "16px" }} />
<button onClick={adicionarConta} style={primaryButton}>➕ Adicionar conta +5 XP</button>
</div>

{contas.length > 0 && (    
    <div style={card}>    
      <h2 style={{ marginTop: 0 }}>📌 Resumo das contas</h2>    
      <p>Pendentes: <strong>{contasPendentes.length}</strong></p>    
      <p>Vencendo: <strong>{contasVencendo.length}</strong></p>    
      <p>Atrasadas: <strong>{contasAtrasadas.length}</strong></p>    
    </div>    
  )}    

  {contas.map((item, index) => {    
    const status = statusConta(item.vencimento, item.pago);    
    const iconeConta = categoriasContas[item.categoria] || "📄";    

    return (    
      <div    
        key={index}    
        style={{    
          ...card,    
          border: status.borda,    
          opacity: item.pago ? 0.72 : 1,    
        }}    
      >    
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "14px" }}>    
          <div>    
            <h3 style={{ margin: 0, color: "#0D47A1" }}>    
              {iconeConta} {item.nome}    
            </h3>    
            <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>    
              {item.categoria === "Cartão" ? "Cartão de crédito" : "Conta fixa"}    
            </p>    
          </div>    

          <div style={{ background: status.cor, color: status.textoCor, padding: "9px 12px", borderRadius: "999px", fontWeight: "bold", fontSize: "12px", textAlign: "center" }}>    
            {status.texto}    
          </div>    
        </div>    

        <div style={{ background: "#f8fbff", padding: "16px", borderRadius: "20px", border: "1px solid #dbeafe", marginBottom: "16px" }}>    
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>    
            <span style={{ color: "#6b7280", fontWeight: "bold" }}>💰 Valor</span>    
            <strong>{moeda(item.valor)}</strong>    
          </div>    

          <div style={{ display: "flex", justifyContent: "space-between" }}>    
            <span style={{ color: "#6b7280", fontWeight: "bold" }}>📅 Vencimento</span>    
            <strong>Dia {item.vencimento || "-"}</strong>    
          </div>    
        </div>    

        <button    
          onClick={() => alternarPagamentoConta(index)}    
          style={{    
            width: "100%",    
            padding: "12px",    
            borderRadius: "16px",    
            border: "none",    
            background: item.pago ? "#6b7280" : "#16a34a",    
            color: "white",    
            fontWeight: "bold",    
            marginBottom: "10px",    
          }}    
        >    
          {item.pago ? "↩️ Marcar como pendente" : "✅ Marcar como pago"}    
        </button>    

        <button    
          onClick={() => removerConta(index)}    
          style={{    
            width: "100%",    
            padding: "12px",    
            borderRadius: "16px",    
            border: "none",    
            background: "#ef4444",    
            color: "white",    
            fontWeight: "bold",    
          }}    
        >    
          🗑 Excluir conta    
        </button>    
      </div>    
    );    
  })}    
</div>

)}

{tela === "metas" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>🎯 Objetivo financeiro</h2>
<div style={{ background: metaVisual.cor, padding: "18px", borderRadius: "24px", marginBottom: "20px" }}>
<p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Sua meta atual</p>
<h2 style={{ margin: "8px 0", color: metaVisual.texto }}>{metaVisual.icone} {nomeMeta}</h2>
<p style={{ margin: 0, fontWeight: "bold", color: metaVisual.texto }}>{progressoMeta.toFixed(1)}% concluído</p>
</div>

<p>Tipo de meta</p>    
    <select style={inputStyle} value={tipoMeta} onChange={(e) => setTipoMeta(e.target.value)}>    
      <option value="Carro">🚗 Carro</option>    
      <option value="Casa">🏠 Casa</option>    
      <option value="Viagem">✈️ Viagem</option>    
      <option value="Outros">🎯 Outros</option>    
    </select>    

    <div style={{ height: "14px" }} />    
    <p>Nome da meta</p>    
    <input style={inputStyle} value={nomeMeta} onChange={(e) => setNomeMeta(e.target.value)} placeholder="Ex: Comprar meu carro" />    

    <div style={{ height: "14px" }} />    
    <p>Valor total da meta</p>    
    <input style={inputStyle} value={ocultarValores ? "•••••" : valorMetaTotal} onChange={(e) => setValorMetaTotal(e.target.value)} inputMode="decimal" />    

    <div style={{ height: "14px" }} />    
    <p>Quanto deseja guardar por mês?</p>    
    <input style={inputStyle} value={ocultarValores ? "•••••" : meta} onChange={(e) => setMeta(e.target.value)} inputMode="decimal" />    

    <div style={{ height: "14px" }} />    
    <p>Quanto já guardou?</p>    
    <input style={inputStyle} value={ocultarValores ? "•••••" : valorGuardado} onChange={(e) => setValorGuardado(e.target.value)} inputMode="decimal" />    

    <div style={{ height: "24px" }} />    
    <button onClick={adicionarValorMetaMensal} style={primaryButton}>✅ Adicionar meta mensal +20 XP</button>    
  </div>    
</div>

)}

{tela === "historico" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>📈 Histórico Financeiro</h2>

{historico.length === 0 && <p>Nenhum mês salvo ainda.</p>}    

    {historico.length > 0 && (    
      <div style={{ marginBottom: "24px" }}>    
        <h3 style={{ color: "#0D47A1", marginBottom: "16px" }}>    
          📊 Entradas x Saídas    
        </h3>    

        {historico.map((item, index) => {    
          const entradasMes = Number(item.entradas || 0);    
          const saidasMes = Number(item.gastos || 0) + Number(item.contas || 0);    
          const larguraEntradas = Math.min((entradasMes / maiorValorHistorico) * 100, 100);    
          const larguraSaidas = Math.min((saidasMes / maiorValorHistorico) * 100, 100);    

          return (    
            <div key={index} style={{ background: "#f8fbff", padding: "16px", borderRadius: "22px", border: "1px solid #dde7ff", marginBottom: "14px" }}>    
              <strong style={{ color: "#0D47A1" }}>📅 {item.mes}</strong>    

              <div style={{ marginTop: "14px" }}>    
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>    
                  <span style={{ color: "#047857", fontWeight: "bold" }}>💰 Entradas</span>    
                  <strong>{moeda(entradasMes)}</strong>    
                </div>    

                <div style={{ height: "14px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>    
                  <div style={{ width: larguraEntradas + "%", height: "14px", background: "#22c55e", borderRadius: "999px" }} />    
                </div>    
              </div>    

              <div style={{ marginTop: "12px" }}>    
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>    
                  <span style={{ color: "#be123c", fontWeight: "bold" }}>💸 Saídas</span>    
                  <strong>{moeda(saidasMes)}</strong>    
                </div>    

                <div style={{ height: "14px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>    
                  <div style={{ width: larguraSaidas + "%", height: "14px", background: "#ef4444", borderRadius: "999px" }} />    
                </div>    
              </div>    
            </div>    
          );    
        })}    
      </div>    
    )}    

    {historico.map((item, index) => (    
      <div key={index} style={{ background: "#f7faff", padding: "18px", borderRadius: "22px", marginTop: "14px", border: "1px solid #dde7ff" }}>    
        <h3 style={{ color: "#0D47A1" }}>📅 {item.mes}</h3>    
        <p>💰 Entradas: <strong>{moeda(item.entradas)}</strong></p>    
        <p>💸 Gastos: <strong>{moeda(item.gastos)}</strong></p>    
        <p>📄 Contas: <strong>{moeda(item.contas)}</strong></p>    
        <p>🎯 Meta: <strong>{moeda(item.metaMensal)}</strong></p>    
        <p>🏦 Saldo final: <strong>{moeda(item.saldo)}</strong></p>    
      </div>    
    ))}    
  </div>    
</div>

)}

{tela === "conquistas" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>🏅 Conquistas</h2>
<div style={{ background: "linear-gradient(135deg,#0D47A1,#1565C0)", color: "white", padding: "18px", borderRadius: "24px", marginBottom: "18px" }}>
<p style={{ margin: 0, opacity: 0.9 }}>Seu progresso</p>
<h2 style={{ margin: "8px 0 0", color: "#FDD835" }}>{conquistasDesbloqueadas}/{totalConquistas} desbloqueadas</h2>
</div>

{conquistas.map((item, index) => (    
      <div key={index} style={{ padding: "18px", borderRadius: "22px", marginBottom: "14px", background: item.desbloqueada ? "#ecfdf5" : "#f3f4f6", border: item.desbloqueada ? "2px solid #10b981" : "2px solid #d1d5db", opacity: item.desbloqueada ? 1 : 0.6 }}>    
        <h3 style={{ margin: 0 }}>{item.icone} {item.titulo}</h3>    
        <p style={{ marginTop: "8px" }}>{item.descricao}</p>    
        <strong style={{ color: item.desbloqueada ? "#059669" : "#6b7280" }}>    
          {item.desbloqueada ? "✅ Desbloqueada" : "🔒 Bloqueada"}    
        </strong>    
      </div>    
    ))}    
  </div>    
</div>

)}

{tela === "perfil" && (
<div style={{ padding: "20px" }}>
<div style={card}>
<h2>👤 Perfil</h2>

<div style={{ textAlign: "center", marginBottom: "20px" }}>    
      {fotoAtual ? (    
        <img src={fotoAtual} alt="foto perfil" style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "4px solid #0D47A1" }} />    
      ) : (    
        <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#eef4ff", color: "#0D47A1", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", border: "4px solid #0D47A1" }}>    
          👤    
        </div>    
      )}    

      <label style={{ display: "block", marginTop: "14px", padding: "14px", borderRadius: "18px", background: "#0D47A1", color: "white", fontWeight: "bold", cursor: "pointer" }}>    
        📷 Escolher foto    
        <input type="file" accept="image/*" onChange={escolherFoto} style={{ display: "none" }} />    
      </label>    

      {fotoAtual && (    
        <button onClick={removerFotoPerfil} style={{ marginTop: "10px", width: "100%", padding: "12px", borderRadius: "16px", border: "none", background: "#ef4444", color: "white", fontWeight: "bold" }}>    
          Remover foto    
        </button>    
      )}    
    </div>    

    <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" />    
    <div style={{ height: "16px" }} />    
    <button onClick={iniciarNovoMes} style={{ width: "100%", padding: "16px", borderRadius: "20px", border: "none", background: "#d32f2f", color: "white", fontWeight: "bold" }}>    
      🔄 Iniciar novo mês    
    </button>    
  </div>    
</div>

)}

  <div style={{ position: "fixed", bottom: "12px", left: "8px", right: "8px", background: "rgba(255,255,255,0.98)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", borderRadius: "28px", boxShadow: "0 -8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5eaf3", zIndex: 999, overflowX: "auto" }}>    
    {navItem("inicio", <FaHome />, "Início")}    
    {navItem("entradas", <FaMoneyBillWave />, "Entradas")}    
    {navItem("gastos", <FaWallet />, "Gastos")}    
    {navItem("contas", <FaFileInvoiceDollar />, "Contas")}    
    {navItem("metas", <FaBullseye />, "Metas")}    
    {navItem("historico", <FaHistory />, "Hist.")}    
    {navItem("conquistas", <FaTrophy />, "Conq.")}    
    {navItem("perfil", <FaUser />, "Perfil")}    
  </div>    
</div>  );
}
