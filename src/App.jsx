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
  FaArrowDown,
  FaArrowUp,
  FaStar,
} from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth, provider } from "./firebase";

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

    leitor.onload = () => {
      setFotoPerfil(leitor.result);
    };

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
    saldo < 0
      ? "Mês no vermelho"
      : saldo <= 300
      ? "Mês apertado"
      : "Salário sob controle";

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
      : `Faltam cerca de ${mesesRestantes} meses para concluir sua meta.`;

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
      icone: progresso >= 80 ? "🚨" : "🟢",
      titulo: progresso >= 80 ? "Atenção ao mês" : "Frase do app",
      texto: mensagemPrincipal,
      cor: progresso >= 80 ? "#fff1f2" : "#ecfdf5",
      textoCor: progresso >= 80 ? "#be123c" : "#047857",
    },
    {
      icone: maiorCategoria ? maiorCategoria.icone : "📊",
      titulo: maiorCategoria ? `Maior gasto: ${maiorCategoria.categoria}` : "Sem gastos ainda",
      texto: maiorCategoria
        ? `Você gastou ${moeda(maiorCategoria.total)} nessa categoria.`
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
            ? `Último mês fechou positivo em ${moeda(saldoUltimoMes)}`
            : `Último mês fechou em ${moeda(saldoUltimoMes)}`
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
    if (!nomeConta || !valorConta) return;

    setContas([
      ...contas,
      {
        nome: nomeConta,
        valor: Number(valorConta),
        categoria: categoriaConta,
      },
    ]);

    ganharXp(5);
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
      onClick={() => setTela(id)}
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
  );

  const AppLogo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "end", gap: "4px", height: "48px" }}>
        <div style={{ width: "10px", height: "22px", background: "white", borderRadius: "5px" }} />
        <div style={{ width: "10px", height: "34px", background: "white", borderRadius: "5px" }} />
        <div style={{ width: "10px", height: "46px", background: "white", borderRadius: "5px" }} />
        <div style={{ width: "10px", height: "28px", background: "#FDD835", borderRadius: "5px" }} />
      </div>

      <div style={{ lineHeight: "32px" }}>
        <div style={{ fontSize: "30px", fontWeight: "900", color: "white" }}>
          Meu Salário
        </div>
        <div style={{ fontSize: "27px", fontWeight: "900", color: "#FDD835" }}>
          Organizado
        </div>
      </div>
    </div>
  );

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
  }

  return (
    <div style={{ background: "#f3f7ff", minHeight: "100vh", paddingBottom: "125px", fontFamily: "Arial" }}>
      <div style={{ background: "linear-gradient(160deg,#003c96 0%,#0057c8 48%,#0D47A1 100%)", color: "white", padding: "26px 22px 58px", borderBottomLeftRadius: "42px", borderBottomRightRadius: "42px", boxShadow: "0 18px 45px rgba(13,71,161,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "26px" }}>
          <AppLogo />
          <AvatarPerfil />
        </div>

        <h1 style={{ fontSize: "34px", margin: 0, fontWeight: "900" }}>
          👋 Olá{usuario?.nome ? `, ${usuario.nome}` : nome ? `, ${nome}` : ""}!
        </h1>

        <p style={{ fontSize: "17px", opacity: 0.95, marginTop: "8px" }}>
          Vamos organizar seu mês?
        </p>

        <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
          <button onClick={() => setOcultarValores(!ocultarValores)} style={{ flex: 1, padding: "14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.16)", color: "white", fontWeight: "bold", fontSize: "15px" }}>
            {ocultarValores ? "👁 Mostrar" : "🙈 Ocultar"}
          </button>

          {!usuario ? (
            <button onClick={loginGoogle} style={{ flex: 1, padding: "14px", borderRadius: "20px", border: "none", background: "white", color: "#0D47A1", fontWeight: "bold", fontSize: "15px" }}>
              🔐 Google
            </button>
          ) : (
            <button onClick={logoutGoogle} style={{ flex: 1, padding: "14px", borderRadius: "20px", border: "none", background: "#d32f2f", color: "white", fontWeight: "bold" }}>
              Sair
            </button>
          )}
        </div>

        <div style={{ marginTop: "26px", padding: "22px", borderRadius: "32px", background: "rgba(0,42,120,0.30)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "inset 0 0 30px rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>Saldo livre após meta ⓘ</p>
              <h1 style={{ color: "#FDD835", fontSize: "32px", margin: "14px 0 10px", fontWeight: "900", lineHeight: "34px" }}>
                {moeda(saldo)}
              </h1>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,150,90,0.55)", padding: "10px 16px", borderRadius: "999px", fontWeight: "bold", color: "#b8ff5c" }}>
                🟢 {statusLimpo}
              </div>

              <p style={{ marginTop: "16px", fontSize: "15px", lineHeight: "22px" }}>
                {mensagemPrincipal}
              </p>
            </div>

            <div style={{ width: "96px", height: "96px", minWidth: "96px", borderRadius: "50%", background: "conic-gradient(#8cff4f 0% 12%, #FDD835 12% " + progresso + "%, rgba(255,255,255,0.22) " + progresso + "% 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#0D47A1", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white", fontWeight: "bold" }}>
                <span style={{ fontSize: "24px" }}>{progresso.toFixed(0)}%</span>
                <span style={{ fontSize: "10px", textAlign: "center" }}>do salário usado</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "22px", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: "18px" }}>
            <strong>🎯 Meu objetivo: </strong>
            <span style={{ color: "#7dd3fc", fontWeight: "bold" }}>{nomeMeta}</span>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "14px", fontWeight: "bold" }}>
              <span>{progressoMeta.toFixed(0)}% concluído</span>
              <span>{moeda(valorGuardado)} / {moeda(valorMetaTotal)}</span>
            </div>

            <div style={{ width: "100%", height: "13px", background: "rgba(0,0,0,0.22)", borderRadius: "999px", overflow: "hidden", marginTop: "10px" }}>
              <div style={{ width: `${progressoMeta}%`, height: "13px", background: "#42A5F5", borderRadius: "999px" }} />
            </div>
          </div>
        </div>
      </div>

      {tela === "inicio" && (
        <div style={{ padding: "20px", marginTop: "-38px" }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>📊 Visão geral do mês</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", textAlign: "center" }}>
              <div>
                <div style={{ color: "#059669", fontWeight: "bold" }}>Entradas</div>
                <div style={{ fontSize: "20px", margin: "8px 0" }}>↓</div>
                <strong>{moeda(receitas)}</strong>
              </div>

              <div>
                <div style={{ color: "#e11d48", fontWeight: "bold" }}>Saídas</div>
                <div style={{ fontSize: "20px", margin: "8px 0" }}>↑</div>
                <strong>{moeda(saidas)}</strong>
              </div>

              <div>
                <div style={{ color: "#0D47A1", fontWeight: "bold" }}>Meta</div>
                <div style={{ fontSize: "20px", margin: "8px 0" }}>◎</div>
                <strong>{moeda(meta)}</strong>
              </div>

              <div>
                <div style={{ color: "#7c3aed", fontWeight: "bold" }}>XP</div>
                <div style={{ fontSize: "20px", margin: "8px 0" }}>⭐</div>
                <strong>{xp} XP</strong>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "22px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px" }}>
                🎓
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px" }}>{nivel}</h3>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  {xp} XP / {proximoNivel} XP para próximo nível
                </p>

                <div style={{ width: "100%", height: "10px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden", marginTop: "10px" }}>
                  <div style={{ width: `${progressoXp}%`, height: "10px", background: "#2563eb", borderRadius: "999px" }} />
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>🚦 Alertas inteligentes</h2>
            {alertasInteligentes.map((item, index) => (
              <div key={index} style={{ background: item.cor, borderRadius: "22px", padding: "16px", marginBottom: "12px" }}>
                <strong style={{ color: item.textoCor }}>{item.icone} {item.titulo}</strong>
                <p style={{ margin: "8px 0 0", color: "#374151", lineHeight: "20px" }}>{item.texto}</p>
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
                    <div style={{ width: `${largura}%`, height: "18px", background: item.texto, borderRadius: "999px" }} />
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
            <input style={inputStyle} placeholder="Nome da conta" value={nomeConta} onChange={(e) => setNomeConta(e.target.value)} />
            <div style={{ height: "12px" }} />
            <input style={inputStyle} type="number" placeholder="Valor" value={valorConta} onChange={(e) => setValorConta(e.target.value)} />
            <div style={{ height: "12px" }} />
            <select style={inputStyle} value={categoriaConta} onChange={(e) => setCategoriaConta(e.target.value)}>
              {Object.keys(categoriasContas).map((cat) => (
                <option key={cat} value={cat}>{categoriasContas[cat]} {cat}</option>
              ))}
            </select>
            <div style={{ height: "16px" }} />
            <button onClick={adicionarConta} style={primaryButton}>➕ Adicionar conta +5 XP</button>
          </div>

          {contas.map((item, index) => (
            <div key={index} style={card}>
              <h3>{categoriasContas[item.categoria]} {item.nome}</h3>
              <p><strong>{moeda(item.valor)}</strong></p>
              <button onClick={() => removerConta(index)}>Excluir</button>
            </div>
          ))}
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
    </div>
  );
}
