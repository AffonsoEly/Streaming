// Função de login
async function login(event) {
  event.preventDefault();
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;
  const db = new PouchDB('streaming_filmes');
  try {
    await db.createIndex({ index: { fields: ['tipo', 'nome', 'senha'] } });
    const result = await db.find({ selector: { tipo: 'usuario', nome: user, senha: pass } });
    if (result.docs.length > 0) {
      localStorage.setItem('usuarioLogado', user);
      alert("Login bem-sucedido!");
      window.location.href = "Index.html";
    } else {
      alert("Usuário ou senha incorretos.");
    }
  } catch (err) {
    console.error("Erro ao autenticar:", err);
    alert("Erro no login.");
  }
  return false;
}

// Função de cadastro
async function register(event) {
  event.preventDefault();
  const nome = document.getElementById("novoUsuario").value;
  const senha = document.getElementById("novaSenha").value;
  const db = new PouchDB('streaming_filmes');
  try {
    await db.createIndex({ index: { fields: ['tipo', 'nome'] } });
    const result = await db.find({ selector: { tipo: 'usuario', nome } });
    if (result.docs.length > 0) {
      alert("Usuário já existe.");
      return false;
    }
    await db.put({
      _id: 'usuario_' + nome,
      tipo: 'usuario',
      nome,
      senha
    });
    alert("Cadastro realizado com sucesso!");
    localStorage.setItem('usuarioLogado', nome);
    window.location.href = "Index.html";
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    alert("Erro ao cadastrar usuário.");
  }
  return false;
}