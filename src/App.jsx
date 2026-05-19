import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, provider } from "./firebase";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [nome, setNome] = useState(localStorage.getItem("nome") || "");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [extra, setExtra] = useState(localStorage.getItem("extra") || "");

  const [tipoMeta, setTipoMeta] = useState(localStorage.getItem("tipoMeta") || "Carro");
  const [nomeMeta, setNomeMeta] = useState(localStorage.getItem("nomeMeta") || "Meu objetivo");
  const [valorMetaTotal, setValorMetaTotal] = useState(localStorage.getItem("valorMetaTotal") || "30000");
  const [valorGuardado, setValorGuardado] = useState(localStorage.getItem("valorGuardado") || "0");
  const [meta, setMeta] = useState(localStorage.getItem("meta") || "500");

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] = useState("Luz");

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
    Outros: "📄",
  };

  const metasOpcoes = {
    Casa: { icone: "🏠", cor: "#e8f1ff", texto: "#0D47A1" },
    Viagem: { icone: "✈️", cor: "#fff8e1", texto: "#b7791f" },
    Carro: { icone: "🚗", cor: "#e8f5e9", texto: "#1b5e20" },
    Outros: { icone: "🎯", cor: "#f3e5f5", texto: "#6a1b9a" },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(
        user
          ? { nome: user.displayName, email: user.email, foto: user.photoURL }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => localStorage.setItem("nome", nome), [nome]);
  useEffect(() => localStorage.setItem("salario", salario), [salario]);
  useEffect(() => localStorage.setItem("extra", extra), [extra]);
  useEffect(() => localStorage.setItem("tipoMeta", tipoMeta), [tipoMeta]);
  useEffect(() => localStorage.setItem("nomeMeta", nomeMeta), [nomeMeta]);
  useEffect(() => localStorage.setItem("valorMetaTotal", valorMetaTotal), [valorMetaTotal]);
  useEffect(() => localStorage.setItem("valorGuardado", valorGuardado), [valorGuardado]);
  useEffect(() => localStorage.setItem("meta", meta), [meta]);
  useEffect(() => localStorage.setItem("gastos", JSON.stringify(gastos)), [gastos]);
  useEffect(() => localStorage.setItem("contasLista", JSON.stringify(contas)), [contas]);
  useEffect(() => localStorage.setItem("historicoFinanceiro", JSON.stringify(historico)), [historico]);

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

  const pontos = Math.max(
    0,
    Math.floor(
      Number(valorGuardado || 0) / 100 +
        historico.length * 50 -
        totalGastos / 500
    )
  );

  const nivel =
    pontos >= 1000
      ? "👑 Mestre Financeiro"
      : pontos >= 600
      ? "💎 Investidor"
      : pontos >= 300
      ? "🚀 Organizado"
      : pontos >= 100
      ? "🔥 Iniciante"
      : "🌱 Começando";

  const status =
    saldo < 0
      ? "🔴 Mês no vermelho"
      : saldo <= 300
      ? "🟡 Mês apertado"
      : "🟢 Salário sob controle";

  const alerta =
    progresso >= 100
      ? "🚨 Você ultrapassou seu limite do mês."
      : progresso >= 80
      ? "⚠️ Atenção! Você já usou mais de 80%."
      : saldo <= 0
      ? "🔴 Seu saldo livre ficou negativo."
      : "🟢 Continue assim! Seu mês está saudável.";
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

  async function adicionarGasto() {
    if (!nomeGasto || !valorGasto) return;

    const novo = {
      nome: nomeGasto,
      valor: Number(valorGasto),
      categoria: categoriaGasto,
    };

    setGastos([...gastos, novo]);

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
    if (!nomeConta || !valorConta) return;

    setContas([
      ...contas,
      {
        nome: nomeConta,
        valor: Number(valorConta),
        categoria: categoriaConta,
      },
    ]);

    setNomeConta("");
    setValorConta("");
  }

  function removerGasto(index) {
    setGastos(gastos.filter((_, i) => i !== index));
  }

  function removerConta(index) {
    setContas(contas.filter((_, i) => i !== index));
  }

  function adicionarValorMetaMensal() {
    const confirmar = window.confirm(`Adicionar ${moeda(meta)} ao valor guardado da meta?`);
    if (!confirmar) return;

    setValorGuardado(String(totalGuardado + Number(meta || 0)));
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

    setGastos([]);
    setContas([]);
    setSalario("");
    setExtra("");

    localStorage.removeItem("gastos");
    localStorage.removeItem("contasLista");
    localStorage.removeItem("salario");
    localStorage.removeItem("extra");
  }

  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "18px",
    border: "1px solid #d9e2f3",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f9fbff",
  };

  const card = {
    background: "white",
    padding: "22px",
    borderRadius: "28px",
    marginBottom: "18px",
    boxShadow: "0 10px 30px rgba(13,71,161,0.10)",
  };

  const navItem = (id, icon, label) => (
    <button
      onClick={() => setTela(id)}
      style={{
        border: "none",
        background: tela === id ? "#e8f1ff" : "transparent",
        color: tela === id ? "#0D47A1" : "#7b8794",
        borderRadius: "18px",
        padding: "8px 9px",
        minWidth: "56px",
        fontWeight: "bold",
        fontSize: "11px",
        boxShadow: tela === id ? "0 6px 14px rgba(13,71,161,0.12)" : "none",
      }}
    >
      <div style={{ fontSize: "20px", lineHeight: "20px" }}>{icon}</div>
      <div>{label}</div>
    </button>
  );

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(180deg,#0D47A1,#06306f)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src="/logo.png" alt="logo" style={{ width: "120px" }} />
          <h1>Meu Salário Organizado</h1>
          <p style={{ color: "#FDD835" }}>
            Organize hoje, realize amanhã
          </p>
        </div>
      </div>
    );
  }
