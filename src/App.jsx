import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaWallet,
  FaChartPie,
  FaBullseye,
  FaTrophy,
  FaUser,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHistory,
} from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
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
      setUsuario(
        user
          ? { nome: user.displayName, email: user.email, foto: user.photoURL }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error(error);
    });
  }, []);

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
  const progressoMeta =
    valorTotalMeta > 0 ? Math.min((totalGuardado / valorTotalMeta) * 100, 100) : 0;
  const mesesRestantes = Number(meta) > 0 ? Math.ceil(faltaMeta / Number(meta)) : 0;
  const metaVisual = metasOpcoes[tipoMeta] || metasOpcoes.Outros;

  let nivel = "🥉 Bronze";
  let proximoNivel = 500;

  if (xp >= 2000) {
    nivel = "💎 Diamante";
    proximoNivel = 2000;
  } else if (xp >= 1000) {
    nivel = "🥇 Ouro";
    proximoNivel = 2000;
  } else if (xp >= 500) {
    nivel = "🥈 Prata";
    proximoNivel = 1000;
  }

  const progressoXp = Math.min((xp / proximoNivel) * 100, 100);

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

  const gastosPorCategoria = Object.keys(categorias)
    .map((categoria) => {
      const total = gastos
        .filter((item) => item.categoria === categoria)
        .reduce((acc, item) => acc + Number(item.valor || 0), 0);

      return { categoria, total, ...categorias[categoria] };
    })
    .filter((item) => item.total > 0);

  const maiorGastoCategoria = Math.max(
    ...gastosPorCategoria.map((item) => item.total),
    1
  );

  const maiorCategoria =
    gastosPorCategoria.length > 0
      ? gastosPorCategoria.reduce((maior, item) =>
          item.total > maior.total ? item : maior
        )
      : null;

  const maiorSaldoHistorico = Math.max(
    ...historico.map((item) => Math.abs(Number(item.saldo || 0))),
    1
  );

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
      titulo: progresso >= 80 ? "Atenção ao uso do salário" : "Uso do salário saudável",
      texto:
        progresso >= 80
          ? "Você já comprometeu boa parte da renda do mês."
          : "Seu mês está saudável até agora.",
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
      titulo: "Previsão da meta",
      texto:
        faltaMeta <= 0
          ? "Meta concluída! 🎉"
          : `Faltam cerca de ${mesesRestantes} meses para concluir sua meta.`,
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
      await signInWithRedirect(auth, provider);
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
    setXp((prev) => prev + 50);
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

    if (saldo > 0) setXp((prev) => prev + 150);
    if (progresso < 70) setXp((prev) => prev + 100);
    if (progressoMeta >= 100) setXp((prev) => prev + 500);

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
    background: "rgba(255,255,255,0.96)",
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
        color: tela === id ? "white" : "#7b8794",
        borderRadius: "18px",
        padding: "9px 10px",
        minWidth: "58px",
        fontWeight: "bold",
        fontSize: "10px",
        boxShadow: tela === id ? "0 8px 18px rgba(13,71,161,0.22)" : "none",
      }}
    >
      <div style={{ fontSize: "18px", lineHeight: "18px" }}>{icon}</div>
      <div>{label}</div>
    </button>
  );

  const MiniCard = ({ titulo, valor, icone, cor }) => (
    <motion.div
      whileTap={{ scale: 0.98 }}
      style={{
        background: "white",
        borderRadius: "26px",
        padding: "18px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
        border: "1px solid #edf2ff",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "16px",
          background: cor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0D47A1",
          marginBottom: "12px",
          fontSize: "18px",
        }}
      >
        {icone}
      </div>

      <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{titulo}</p>
      <h3 style={{ margin: "8px 0 0", color: "#111827", fontSize: "20px" }}>
        {valor}
      </h3>
    </motion.div>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center" }}
        >
          <img src="/logo.png" alt="logo" style={{ width: "120px" }} />
          <h1>Meu Salário Organizado</h1>
          <p style={{ color: "#FDD835" }}>Organize hoje, realize amanhã</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(180deg,#eef3fb 0%,#f8fbff 100%)",
        minHeight: "100vh",
        paddingBottom: "125px",
        fontFamily: "Arial",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: "linear-gradient(135deg,#0D47A1 0%,#1565C0 48%,#42A5F5 100%)",
          color: "white",
          padding: "30px 22px 38px",
          borderBottomLeftRadius: "42px",
          borderBottomRightRadius: "42px",
          boxShadow: "0 18px 45px rgba(13,71,161,0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "230px",
            height: "230px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            top: "-90px",
            right: "-65px",
          }}
        />

        <img
          src="/logo-horizontal.png"
          alt="logo"
          style={{
            width: "220px",
            display: "block",
            margin: "0 auto 22px",
            position: "relative",
            zIndex: 2,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "31px", margin: 0, fontWeight: "800" }}>
            👋 Olá{usuario?.nome ? `, ${usuario.nome}` : nome ? `, ${nome}` : ""}!
          </h2>

          <p style={{ fontSize: "16px", opacity: 0.92, marginTop: "6px" }}>
            Seu painel financeiro inteligente ✨
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "18px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <button
            onClick={() => setOcultarValores(!ocultarValores)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "18px",
              border: "none",
              background: "rgba(255,255,255,0.18)",
              color: "white",
              fontWeight: "bold",
              backdropFilter: "blur(10px)",
            }}
          >
            {ocultarValores ? "👁 Mostrar" : "🙈 Ocultar"}
          </button>

          {!usuario ? (
            <button
              onClick={loginGoogle}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "18px",
                border: "none",
                background: "white",
                color: "#0D47A1",
                fontWeight: "bold",
              }}
            >
              Google
            </button>
          ) : (
            <button
              onClick={logoutGoogle}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "18px",
                border: "none",
                background: "#d32f2f",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Sair
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
            borderRadius: "30px",
            padding: "22px",
            marginTop: "24px",
            border: "1px solid rgba(255,255,255,0.16)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "18px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
                Saldo livre após meta
              </p>

              <h1 style={{ color: "#FDD835", fontSize: "40px", margin: "12px 0", fontWeight: "800" }}>
                {moeda(saldo)}
              </h1>

              <p style={{ margin: 0, fontWeight: "bold", opacity: 0.95 }}>{status}</p>
            </div>

            <div
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#FDD835 0% " +
                  progresso +
                  "%, rgba(255,255,255,0.18) " +
                  progresso +
                  "%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "#0D47A1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {progresso.toFixed(0)}%
              </div>
            </div>
          </div>

          <p style={{ marginTop: "16px", fontSize: "14px", opacity: 0.95 }}>
            {alerta}
          </p>

          <div
            style={{
              marginTop: "18px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "22px",
              padding: "15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong>🏆 {nivel}</strong>
              <strong>⭐ {xp} XP</strong>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",
                background: "rgba(255,255,255,0.16)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressoXp}%`,
                  height: "12px",
                  background: "#FDD835",
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {tela === "inicio" && (
        <div style={{ padding: "20px", marginTop: "-18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
            <MiniCard titulo="Entradas" valor={moeda(receitas)} icone={<FaMoneyBillWave />} cor="#e8f5e9" />
            <MiniCard titulo="Saídas" valor={moeda(saidas)} icone={<FaWallet />} cor="#fff1f2" />
            <MiniCard titulo="Meta mensal" valor={moeda(meta)} icone={<FaPiggyBank />} cor="#eef4ff" />
            <MiniCard titulo="Conquistas" valor={`${conquistasDesbloqueadas}/${totalConquistas}`} icone={<FaTrophy />} cor="#fff8e1" />
          </div>

          <motion.div whileTap={{ scale: 0.99 }} style={card}>
            <h2>🚦 Alertas Inteligentes</h2>

            {alertasInteligentes.map((item, index) => (
              <div
                key={index}
                style={{
                  background: item.cor,
                  borderRadius: "22px",
                  padding: "16px",
                  marginBottom: "12px",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <strong style={{ color: item.textoCor }}>
                  {item.icone} {item.titulo}
                </strong>

                <p style={{ margin: "8px 0 0", color: "#374151", lineHeight: "20px" }}>
                  {item.texto}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div style={card}>
            <h2>{metaVisual.icone} {nomeMeta}</h2>
            <p>Objetivo: <strong>{moeda(valorMetaTotal)}</strong></p>
            <p>Guardado: <strong>{moeda(valorGuardado)}</strong></p>
            <p>Falta: <strong>{moeda(faltaMeta)}</strong></p>

            <div style={{ width: "100%", height: "20px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden", marginTop: "12px" }}>
              <div
                style={{
                  width: `${progressoMeta}%`,
                  height: "20px",
                  background: "linear-gradient(90deg,#0D47A1,#42a5f5)",
                  borderRadius: "999px",
                }}
              />
            </div>

            <p style={{ textAlign: "center", fontWeight: "bold", color: "#0D47A1" }}>
              {progressoMeta.toFixed(1)}% concluído
            </p>
          </motion.div>
        </div>
      )}

      {tela === "entradas" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>💰 Entradas</h2>

            <p>Salário</p>
            <input
              style={inputStyle}
              value={ocultarValores ? "•••••" : salario}
              onChange={(e) => setSalario(e.target.value)}
              inputMode="decimal"
            />

            <div style={{ height: "14px" }} />

            <p>Extra</p>
            <input
              style={inputStyle}
              value={ocultarValores ? "•••••" : extra}
              onChange={(e) => setExtra(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
      )}

      {tela === "gastos" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>💸 Gastos</h2>

            <input
              style={inputStyle}
              placeholder="Nome do gasto"
              value={nomeGasto}
              onChange={(e) => setNomeGasto(e.target.value)}
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              type="number"
              placeholder="Valor"
              value={valorGasto}
              onChange={(e) => setValorGasto(e.target.value)}
            />

            <div style={{ height: "12px" }} />

            <select
              style={inputStyle}
              value={categoriaGasto}
              onChange={(e) => setCategoriaGasto(e.target.value)}
            >
              {Object.keys(categorias).map((cat) => (
                <option key={cat} value={cat}>
                  {categorias[cat].icone} {cat}
                </option>
              ))}
            </select>

            <div style={{ height: "16px" }} />

            <button onClick={adicionarGasto} style={primaryButton}>
              ➕ Adicionar gasto
            </button>
          </div>

          <div style={card}>
            <h2>📊 Gastos por categoria</h2>

            {gastosPorCategoria.length === 0 ? (
              <p>Nenhum gasto lançado ainda.</p>
            ) : (
              gastosPorCategoria.map((item) => {
                const largura = (item.total / maiorGastoCategoria) * 100;

                return (
                  <div key={item.categoria} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong>{item.icone} {item.categoria}</strong>
                      <strong>{moeda(item.total)}</strong>
                    </div>

                    <div style={{ width: "100%", height: "18px", background: "#eceff1", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${largura}%`,
                          height: "18px",
                          background: item.texto,
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {gastos.map((item, index) => {
            const cat = categorias[item.categoria] || categorias.Outros;

            return (
              <div key={index} style={card}>
                <span
                  style={{
                    background: cat.cor,
                    color: cat.texto,
                    padding: "7px 13px",
                    borderRadius: "999px",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
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

            <input
              style={inputStyle}
              placeholder="Nome da conta"
              value={nomeConta}
              onChange={(e) => setNomeConta(e.target.value)}
            />

            <div style={{ height: "12px" }} />

            <input
              style={inputStyle}
              type="number"
              placeholder="Valor"
              value={valorConta}
              onChange={(e) => setValorConta(e.target.value)}
            />

            <div style={{ height: "12px" }} />

            <select
              style={inputStyle}
              value={categoriaConta}
              onChange={(e) => setCategoriaConta(e.target.value)}
            >
              {Object.keys(categoriasContas).map((cat) => (
                <option key={cat} value={cat}>
                  {categoriasContas[cat]} {cat}
                </option>
              ))}
            </select>

            <div style={{ height: "16px" }} />

            <button onClick={adicionarConta} style={primaryButton}>
              ➕ Adicionar conta
            </button>
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

              <h2 style={{ margin: "8px 0", color: metaVisual.texto }}>
                {metaVisual.icone} {nomeMeta}
              </h2>

              <p style={{ margin: 0, fontWeight: "bold", color: metaVisual.texto }}>
                {progressoMeta.toFixed(1)}% concluído
              </p>
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

            <div style={{ background: "#f8fafc", borderRadius: "24px", padding: "18px", border: "1px solid #e5eaf3" }}>
              <p>Objetivo: <strong>{moeda(valorMetaTotal)}</strong></p>
              <p>Guardado: <strong>{moeda(valorGuardado)}</strong></p>
              <p>Falta: <strong>{moeda(faltaMeta)}</strong></p>
              <p>Previsão: <strong>{mesesRestantes} meses</strong></p>

              <div style={{ width: "100%", height: "20px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden", marginTop: "12px" }}>
                <div
                  style={{
                    width: `${progressoMeta}%`,
                    height: "20px",
                    background: "linear-gradient(90deg,#0D47A1,#42a5f5)",
                    borderRadius: "999px",
                    transition: "0.4s",
                  }}
                />
              </div>

              <p style={{ textAlign: "center", marginTop: "12px", color: "#0D47A1", fontWeight: "bold" }}>
                {progressoMeta.toFixed(1)}% da meta concluída
              </p>

              <button onClick={adicionarValorMetaMensal} style={primaryButton}>
                ✅ Adicionar meta mensal ao guardado
              </button>
            </div>
          </div>
        </div>
      )}

      {tela === "historico" && (
        <div style={{ padding: "20px" }}>
          <div style={card}>
            <h2>📈 Histórico Financeiro</h2>

            {historico.length === 0 && <p>Nenhum mês salvo ainda.</p>}

            {historico.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#0D47A1" }}>📊 Evolução do saldo</h3>

                {historico.map((item, index) => {
                  const saldoMes = Number(item.saldo || 0);
                  const largura = Math.min((Math.abs(saldoMes) / maiorSaldoHistorico) * 100, 100);
                  const positivo = saldoMes >= 0;

                  return (
                    <div key={index} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <strong>{item.mes}</strong>
                        <strong style={{ color: positivo ? "#1b5e20" : "#c62828" }}>
                          {moeda(saldoMes)}
                        </strong>
                      </div>

                      <div style={{ width: "100%", height: "16px", background: "#eceff1", borderRadius: "999px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${largura}%`,
                            height: "16px",
                            background: positivo ? "#1b5e20" : "#c62828",
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {historico.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#f7faff",
                  padding: "18px",
                  borderRadius: "22px",
                  marginTop: "14px",
                  border: "1px solid #dde7ff",
                }}
              >
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

            <div
              style={{
                background: "linear-gradient(135deg,#0D47A1,#1565C0)",
                color: "white",
                padding: "18px",
                borderRadius: "24px",
                marginBottom: "18px",
              }}
            >
              <p style={{ margin: 0, opacity: 0.9 }}>Seu progresso</p>

              <h2 style={{ margin: "8px 0 0", color: "#FDD835" }}>
                {conquistasDesbloqueadas}/{totalConquistas} desbloqueadas
              </h2>
            </div>

            {conquistas.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "18px",
                  borderRadius: "22px",
                  marginBottom: "14px",
                  background: item.desbloqueada ? "#ecfdf5" : "#f3f4f6",
                  border: item.desbloqueada
                    ? "2px solid #10b981"
                    : "2px solid #d1d5db",
                  opacity: item.desbloqueada ? 1 : 0.6,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {item.icone} {item.titulo}
                </h3>

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

            <input
              style={inputStyle}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />

            <div style={{ height: "16px" }} />

            <button
              onClick={iniciarNovoMes}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "20px",
                border: "none",
                background: "#d32f2f",
                color: "white",
                fontWeight: "bold",
              }}
            >
              🔄 Iniciar novo mês
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: "8px",
          right: "8px",
          background: "rgba(255,255,255,0.96)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
          borderRadius: "28px",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
          border: "1px solid #e5eaf3",
          zIndex: 999,
          backdropFilter: "blur(12px)",
          overflowX: "auto",
        }}
      >
        {navItem("inicio", <FaHome />, "Início")}
        {navItem("entradas", <FaMoneyBillWave />, "Entrada")}
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
