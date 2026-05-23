// ===============================
// APP COMPLETO - MEU SALÁRIO ORGANIZADO
// VERSÃO FAMÍLIA + RESTAURADA
// ===============================

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
  FaUsers,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

import { db, auth, provider } from "./firebase";

export default function App() {

  // ===============================
  // ESTADOS
  // ===============================

  const [loading, setLoading] = useState(true);
  const [tela, setTela] = useState("inicio");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [fotoPerfil, setFotoPerfil] = useState(
    localStorage.getItem("fotoPerfil") || ""
  );

  const [nome, setNome] = useState(
    localStorage.getItem("nome") || ""
  );

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  const [extra, setExtra] = useState(
    localStorage.getItem("extra") || ""
  );

  const [tipoMeta, setTipoMeta] = useState(
    localStorage.getItem("tipoMeta") || "Carro"
  );

  const [nomeMeta, setNomeMeta] = useState(
    localStorage.getItem("nomeMeta") || "Meu objetivo"
  );

  const [valorMetaTotal, setValorMetaTotal] = useState(
    localStorage.getItem("valorMetaTotal") || "30000"
  );

  const [valorGuardado, setValorGuardado] = useState(
    localStorage.getItem("valorGuardado") || "0"
  );

  const [meta, setMeta] = useState(
    localStorage.getItem("meta") || "500"
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  // ===============================
  // MODO FAMÍLIA
  // ===============================

  const [membros, setMembros] = useState(
    JSON.parse(localStorage.getItem("membrosFamilia")) || [
      {
        nome: "Shirley",
        salario: 0,
      },
    ]
  );

  const [novoMembro, setNovoMembro] = useState("");
  const [novoSalarioMembro, setNovoSalarioMembro] = useState("");

  // ===============================
  // GASTOS
  // ===============================

  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [categoriaGasto, setCategoriaGasto] = useState("Alimentação");

  // ===============================
  // CONTAS
  // ===============================

  const [nomeConta, setNomeConta] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [categoriaConta, setCategoriaConta] = useState("Luz");
  const [vencimentoConta, setVencimentoConta] = useState("");

  // ===============================
  // LISTAS
  // ===============================

  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem("gastos")) || []
  );

  const [contas, setContas] = useState(
    JSON.parse(localStorage.getItem("contasLista")) || []
  );

  const [historico, setHistorico] = useState(
    JSON.parse(localStorage.getItem("historicoFinanceiro")) || []
  );

  // ===============================
  // CATEGORIAS
  // ===============================

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

  // ===============================
  // EFFECTS
  // ===============================

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(
        user
          ? {
              nome: user.displayName,
              email: user.email,
              foto: user.photoURL,
            }
          : null
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("fotoPerfil", fotoPerfil);
  }, [fotoPerfil]);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("salario", salario);
  }, [salario]);

  useEffect(() => {
    localStorage.setItem("extra", extra);
  }, [extra]);

  useEffect(() => {
    localStorage.setItem("tipoMeta", tipoMeta);
  }, [tipoMeta]);

  useEffect(() => {
    localStorage.setItem("nomeMeta", nomeMeta);
  }, [nomeMeta]);

  useEffect(() => {
    localStorage.setItem("valorMetaTotal", valorMetaTotal);
  }, [valorMetaTotal]);

  useEffect(() => {
    localStorage.setItem("valorGuardado", valorGuardado);
  }, [valorGuardado]);

  useEffect(() => {
    localStorage.setItem("meta", meta);
  }, [meta]);

  useEffect(() => {
    localStorage.setItem("xp", String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("contasLista", JSON.stringify(contas));
  }, [contas]);

  useEffect(() => {
    localStorage.setItem(
      "historicoFinanceiro",
      JSON.stringify(historico)
    );
  }, [historico]);

  useEffect(() => {
    localStorage.setItem(
      "membrosFamilia",
      JSON.stringify(membros)
    );
  }, [membros]);

  // ===============================
  // FOTO
  // ===============================

  const fotoAtual = fotoPerfil || usuario?.foto || "";

  function escolherFoto(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => setFotoPerfil(leitor.result);

    leitor.readAsDataURL(arquivo);
  }

  // ===============================
  // MOEDA
  // ===============================

  const moeda = (valor) => {

    if (ocultarValores) {
      return "••••••";
    }

    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  // ===============================
  // CÁLCULOS
  // ===============================

  const receitas =
    (Number(salario) || 0) +
    (Number(extra) || 0);

  const totalFamilia = membros.reduce(
    (acc, item) => acc + Number(item.salario || 0),
    0
  );

  const totalGastos = gastos.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const totalContas = contas.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const saldo =
    receitas +
    totalFamilia -
    totalGastos -
    totalContas -
    Number(meta || 0);

  // ===============================
  // FUNÇÕES
  // ===============================

  function ganharXp(valor) {
    setXp((prev) => prev + valor);
  }

  function adicionarMembro() {

    if (!novoMembro || !novoSalarioMembro) return;

    setMembros([
      ...membros,
      {
        nome: novoMembro,
        salario: Number(novoSalarioMembro),
      },
    ]);

    setNovoMembro("");
    setNovoSalarioMembro("");

    ganharXp(10);
  }

  function removerMembro(index) {
    setMembros(
      membros.filter((_, i) => i !== index)
    );
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
        criadoEm: serverTimestamp(),
      });

    } catch (error) {

      console.error(error);

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
        vencimento: vencimentoConta,
        pago: false,
      },
    ]);

    setNomeConta("");
    setValorConta("");
    setVencimentoConta("");

    ganharXp(5);
  }

  // ===============================
  // LOADING
  // ===============================

  if (loading) {

    return (
      <div
        style={{
          background:
            "linear-gradient(135deg,#0D47A1,#42A5F5)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <h1>💰 Meu Salário Organizado</h1>
      </div>
    );
  }

  // ===============================
  // APP
  // ===============================

  return (

    <div
      style={{
        background: "#f3f7ff",
        minHeight: "100vh",
        paddingBottom: "120px",
        fontFamily: "Arial",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(160deg,#003c96 0%,#0057c8 48%,#0D47A1 100%)",
          color: "white",
          padding: "24px",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <div>
            <h1 style={{ margin: 0 }}>
              👋 Olá {nome || "Usuário"}
            </h1>

            <p>
              Vamos organizar sua vida financeira?
            </p>
          </div>

          {fotoAtual ? (
            <img
              src={fotoAtual}
              alt="foto"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              👤
            </div>
          )}
        </div>

        {/* SALDO */}

        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "25px",
            padding: "20px",
            marginTop: "20px",
          }}
        >

          <p>Saldo geral</p>

          <h1
            style={{
              color: "#FDD835",
              fontSize: "36px",
            }}
          >
            {moeda(saldo)}
          </h1>

        </div>
      </div>

      {/* CONTEÚDO */}

      <div style={{ padding: "20px" }}>

        {/* FAMÍLIA */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "25px",
            marginBottom: "20px",
          }}
        >

          <h2>
            <FaUsers /> Modo Família
          </h2>

          <input
            placeholder="Nome do membro"
            value={novoMembro}
            onChange={(e) =>
              setNovoMembro(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              marginBottom: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Salário"
            value={novoSalarioMembro}
            onChange={(e) =>
              setNovoSalarioMembro(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              marginBottom: "10px",
            }}
          />

          <button
            onClick={adicionarMembro}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "#0D47A1",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <FaPlus /> Adicionar membro
          </button>

          <div style={{ marginTop: "20px" }}>

            {membros.map((item, index) => (

              <div
                key={index}
                style={{
                  background: "#f8fbff",
                  padding: "14px",
                  borderRadius: "16px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <div>
                  <strong>{item.nome}</strong>

                  <p style={{ margin: 0 }}>
                    {moeda(item.salario)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removerMembro(index)
                  }
                  style={{
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    padding: "10px",
                    borderRadius: "12px",
                  }}
                >
                  <FaTrash />
                </button>

              </div>
            ))}

          </div>
        </div>

        {/* ENTRADAS */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "25px",
            marginBottom: "20px",
          }}
        >

          <h2>💰 Entradas</h2>

          <input
            placeholder="Salário"
            value={salario}
            onChange={(e) =>
              setSalario(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              marginBottom: "10px",
            }}
          />

          <input
            placeholder="Renda extra"
            value={extra}
            onChange={(e) =>
              setExtra(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
            }}
          />
        </div>

        {/* GASTOS */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "25px",
            marginBottom: "20px",
          }}
        >

          <h2>💸 Gastos</h2>

          <input
            placeholder="Nome do gasto"
            value={nomeGasto}
            onChange={(e) =>
              setNomeGasto(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              marginBottom: "10px",
            }}
          />

          <input
            type="number"
            placeholder="Valor"
            value={valorGasto}
            onChange={(e) =>
              setValorGasto(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              marginBottom: "10px",
            }}
          />

          <button
            onClick={adicionarGasto}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "#0D47A1",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Adicionar gasto
          </button>

        </div>

      </div>

      {/* MENU */}

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          right: "10px",
          background: "white",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >

        <FaHome size={22} color="#0D47A1" />
        <FaWallet size={22} color="#6b7280" />
        <FaFileInvoiceDollar size={22} color="#6b7280" />
        <FaBullseye size={22} color="#6b7280" />
        <FaHistory size={22} color="#6b7280" />
        <FaTrophy size={22} color="#6b7280" />
        <FaUser size={22} color="#6b7280" />

      </div>

    </div>
  );
}
