const db = new PouchDB('streaming_filmes');
const apiKey = 'AIzaSyB_DLu_H3EjQC98-W6Fq3uFvX8PujwSAkA';
// Dados iniciais (apenas para exemplo)

//criando usuários padrões
const usuariosIniciais = [
  { _id: 'admin', usuario: 'admin', senha: 'admin123', tipo: 'admin' },
  { _id: 'user1', usuario: 'user1', senha: 'user123', tipo: 'padrao' }
];
//E alimentando eles no banco de dados.
async function alimentarUsuariosIniciais() {
  const dbUsuarios = new PouchDB('streaming_usuarios');
  for (const user of usuariosIniciais) {
    await dbUsuarios.get(user._id).catch(() => dbUsuarios.put(user));
  }
}

document.addEventListener("DOMContentLoaded", alimentarUsuariosIniciais);
// Função para buscar o título real do YouTube
async function buscarTituloYoutube(idYoutube) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idYoutube}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet.title;
  }
  return "Título não encontrado";
}async function login(event) {
  event.preventDefault();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();
  const dbUsuarios = new PouchDB('streaming_usuarios');
  try {
    const usuarioDoc = await dbUsuarios.get(user);
    if (usuarioDoc.senha === pass) {
      alert("Login bem-sucedido!");
      if (usuarioDoc.tipo === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "Index.html";
      }
    } else {
      alert("Senha incorreta.");
    }
  } catch (err) {
    alert("Usuário não encontrado.");
    console.error("Erro ao autenticar:", err);
  }
}async function login(event) {
  event.preventDefault();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();
  const dbUsuarios = new PouchDB('streaming_usuarios');
  try {
    const usuarioDoc = await dbUsuarios.get(user);
    if (usuarioDoc.senha === pass) {
      alert("Login bem-sucedido!");
      if (usuarioDoc.tipo === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "Index.html";
      }
    } else {
      alert("Senha incorreta.");
    }
  } catch (err) {
    alert("Usuário não encontrado.");
    console.error("Erro ao autenticar:", err);
  }
}

const videosIniciais = [
  {
    _id: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    _id: '3JZ_D3ELwOQ',
    url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ'
  },
  {
    _id: 'L_jWHffIx5E',
    url: 'https://www.youtube.com/embed/L_jWHffIx5E'
  },
  {
    _id: 'tgbNymZ7vqY',
    url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
  },
  {
    _id: 'e-ORhEE9VVg',
    url: 'https://www.youtube.com/embed/e-ORhEE9VVg'
  },
  {
    _id: 'kXYiU_JCYtU',
    url: 'https://www.youtube.com/embed/kXYiU_JCYtU'
  }
];

// Insere vídeos com título real do YouTube
async function alimentarVideosIniciais() {
  for (const video of videosIniciais) {
    const idYoutube = video.url.split('/embed/')[1];
    video.titulo = await buscarTituloYoutube(idYoutube);
    try {
      const existente = await db.get(video._id);
      existente.titulo = video.titulo; // Atualiza o título
      await db.put(existente);
    } catch {
      await db.put(video); // Insere se não existe
    }
  }
}

document.addEventListener("DOMContentLoaded", alimentarVideosIniciais);


async function carregarVideos() {
  const container = document.getElementById('videoList');
  container.innerHTML = '';
  const result = await db.allDocs({ include_docs: true });

  result.rows.forEach(({ doc }) => {
  const idYoutube = doc.url.split('/embed/')[1];
  container.innerHTML += `
    <div class="col-md-4 col-sm-6 mb-4">
      <div class="card h-100 video-card bg-black text-white" onclick="playVideo('${doc._id}')">
        <img src="https://img.youtube.com/vi/${idYoutube}/0.jpg" class="card-img-top" alt="${doc.titulo}">
        <div class="card-body text-center">
          <h5 class="card-title">${doc.titulo}</h5>
        </div>
      </div>
    </div>
  `;
  });
}
//Salva o vídeo atual no localStorage e redireciona para a página do player
// Função para tocar o vídeo selecionado
function playVideo(id) {
  window.location.href = `player.html?video=${id}`;
}
// Função para filtrar vídeos
// Filtra os vídeos com base no título digitado no campo de filtro
function filtrarVideos() {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const cards = document.querySelectorAll(".video-card");
  cards.forEach(card => {
    const titulo = card.querySelector(".card-title").innerText.toLowerCase();
    card.parentElement.style.display = titulo.includes(filtro) ? "block" : "none";
  });
}

function getFilmesDestaque(qtd = 3) {
  const copia = [...videosIniciais];
  const destaque = [];
  while (destaque.length < qtd && copia.length) {
    const idx = Math.floor(Math.random() * copia.length);
    destaque.push(copia.splice(idx, 1)[0]);
  }
  return destaque;
}

function renderizarDestaque() {
  const destaque = getFilmesDestaque();
  const container = document.getElementById('destaqueFilmes');
  container.innerHTML = '';
  destaque.forEach((video, i) => {
    container.innerHTML += `
      <div class="carousel-item${i === 0 ? ' active' : ''}">
        <img src="https://img.youtube.com/vi/${video._id}/0.jpg" class="d-block w-100" alt="${video.titulo}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${video.titulo || 'Título não encontrado'}</h5>
          <p>${video.categoria || ''}</p>
        </div>
      </div>
    `;
  });
}

// Renderiza grid filtrado por categoria

let categoriaAtual = 'Todos';
function filtrarCategoria(cat, el) {
  categoriaAtual = cat;
  // Destaca a categoria ativa
  document.querySelectorAll('#menuCategorias .nav-link').forEach(link => link.classList.remove('active'));
  if (el) el.classList.add('active');
  filtrarVideos();
}

function filtrarVideos() {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const cards = document.querySelectorAll(".video-card");
  cards.forEach(card => {
    const titulo = card.querySelector(".card-title").innerText.toLowerCase();
    const categoria = card.querySelector(".card-text") ? card.querySelector(".card-text").innerText : '';
    const matchTitulo = titulo.includes(filtro);
    const matchCategoria = (categoriaAtual === 'Todos') || (categoria === categoriaAtual);
    card.parentElement.style.display = (matchTitulo && matchCategoria) ? "block" : "none";
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderizarDestaque();
  filtrarCategoria('Todos');
});
// Função para autenticar usuário
// Autentica o usuário com base no nome e senha fornecidos
async function login(event) {
  event.preventDefault();
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();
  const dbUsuarios = new PouchDB('streaming_usuarios');
  try {
    const usuarioDoc = await dbUsuarios.get(user);
    if (usuarioDoc.senha === pass) {
      alert("Login bem-sucedido!");
      if (usuarioDoc.tipo === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "Index.html";
      }
    } else {
      alert("Senha incorreta.");
    }
  } catch (err) {
    alert("Usuário não encontrado.");
    console.error("Erro ao autenticar:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarVideos);
// adicionando o conteudo da página de filmes.html dinamicamente, logo após o carregamento do DOM
//  para garantir que o elemento exista
document.addEventListener("DOMContentLoaded", () => {
  carregarVideos();

  // Handler para carregar filmes.html dinamicamente ao clicar em "Filmes"
  // Verifica se o elemento existe antes de adicionar o evento
  // Adiciona o evento de clique ao link "Filmes"
  const linkFilmes = document.getElementById('linkFilmes');
  if (linkFilmes) {
    linkFilmes.onclick = function(e) {
      e.preventDefault();
      const conteudoPrincipal = document.getElementById('conteudoPrincipal');
      if (conteudoPrincipal) conteudoPrincipal.style.display = 'none';
      fetch('filmes.html')
        .then(response => response.text())
        .then(html => {
          document.getElementById('conteudoDinamico').innerHTML = html;
        });
    };
  }
});

 // Handler para voltar ao conteúdo principal ao clicar em "Mini Streaming"
  const linkIndex = document.getElementById('index');
  if (linkIndex) {
    linkIndex.onclick = function(e) {
      e.preventDefault();
      const conteudoPrincipal = document.getElementById('conteudoPrincipal');
      if (conteudoPrincipal) conteudoPrincipal.style.display = 'block';
      document.getElementById('conteudoDinamico').innerHTML = '';
    };

  }

function mostrarCadastro() {
  document.querySelector('form[onsubmit="return login(event)"]').style.display = 'none';
  document.getElementById('cadastroUsuario').style.display = 'block';
}

  async function cadastrarUsuario(event) {
    event.preventDefault();
    const usuario = document.getElementById('novoUsuario').value.trim();
    const senha = document.getElementById('novaSenha').value.trim();
    const dbUsuarios = new PouchDB('streaming_usuarios');

    // Validação de campos vazios
    if (!usuario || !senha) {
      alert('Preencha todos os campos!');
      return false;
    }

    // Validação de usuário já existente
    try {
      await dbUsuarios.get(usuario);
      alert('Usuário já existe!');
      console.warn('Tentativa de cadastro de usuário já existente:', usuario);
    } catch {
      await dbUsuarios.put({ _id: usuario, usuario, senha, tipo: 'padrao' });
      alert('Usuário cadastrado com sucesso!');
      console.log('Usuário cadastrado:', usuario);
      document.getElementById('cadastroUsuario').style.display = 'none';
      window.location.href = "Index.html";
    }
    return false;
  }
async function listarUsuarios() {
  const dbUsuarios = new PouchDB('streaming_usuarios');
  const result = await dbUsuarios.allDocs({ include_docs: true });
  console.log("Usuários cadastrados:");
  result.rows.forEach(({ doc }) => {
    console.log(doc);
  });
}

async function cadastrarFilme(event) {
  event.preventDefault();
  const titulo = document.getElementById('novoTitulo').value.trim();
  const categoria = document.getElementById('novaCategoria').value.trim();
  const urlYoutube = document.getElementById('novoLink').value.trim();

  // Extrai o ID do YouTube do link
  const match = urlYoutube.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const idYoutube = match ? match[1] : null;
  if (!idYoutube) {
    alert('Link do YouTube inválido!');
    return false;
  }

  const urlEmbed = `https://www.youtube.com/embed/${idYoutube}`;
  const db = new PouchDB('streaming_filmes');
  const novoFilme = {
    _id: idYoutube,
    titulo,
    categoria,
    url: urlEmbed
  };

  try {
    await db.put(novoFilme);
    alert('Filme cadastrado com sucesso!');
    event.target.reset();
    listarFilmes(); // Atualiza o painel de filmes cadastrados
  } catch (err) {
    alert('Erro ao cadastrar filme: ' + err.message);
  }
}

async function listarFilmes() {
  const db = new PouchDB('streaming_filmes');
  const container = document.getElementById('listaFilmes');
  if (!container) return; // Garante que o elemento existe
  container.innerHTML = '';
  const result = await db.allDocs({ include_docs: true });
  result.rows.forEach(({ doc }) => {
    if (doc.url && doc.titulo) {
      const idYoutube = doc.url.split('/embed/')[1];
      container.innerHTML += `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card h-100 video-card bg-black text-white">
            <img src="https://img.youtube.com/vi/${idYoutube}/0.jpg" class="card-img-top" alt="${doc.titulo}">
            <div class="card-body text-center">
              <h5 class="card-title">${doc.titulo}</h5>
              <p class="card-text">${doc.categoria || ''}</p>
            </div>
          </div>
        </div>
      `;
    }
  });
}

document.addEventListener("DOMContentLoaded", listarFilmes);

// Manipulação de usuários com PouchDB
const dbUsuarios = new PouchDB('streaming_usuarios');

async function listarUsuarios() {
  const container = document.getElementById('listaUsuarios');
  container.innerHTML = '';
  const result = await dbUsuarios.allDocs({ include_docs: true });
  result.rows.forEach(({ doc }) => {
    container.innerHTML += `
      <tr>
        <td>${doc.usuario}</td>
        <td>${doc.tipo}</td>
        <td>
          <button class="btn btn-sm btn-primary me-2" onclick="abrirModalEditarUsuario('${doc._id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirUsuario('${doc._id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}

async function cadastrarUsuario(event) {
  event.preventDefault();
  const usuario = document.getElementById('novoNomeUsuario').value.trim();
  const senha = document.getElementById('novaSenhaUsuario').value.trim();
  const tipo = document.getElementById('novoTipoUsuario').value;
  if (!usuario || !senha || !tipo || senha.length < 4) {
    mostrarFeedback('Preencha todos os campos corretamente!', 'danger');
    return false;
  }
  try {
    await dbUsuarios.get(usuario);
    mostrarFeedback('Usuário já existe!', 'warning');
    return false;
  } catch {
    await dbUsuarios.put({ _id: usuario, usuario, senha, tipo });
    mostrarFeedback('Usuário cadastrado com sucesso!', 'success');
    event.target.reset();
    listarUsuarios();
  }
}

function mostrarFeedback(msg, tipo) {
  const feedback = document.getElementById('usuarioFeedback');
  feedback.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
}

function abrirModalEditarUsuario(id) {
  dbUsuarios.get(id).then(doc => {
    document.getElementById('editIdUsuario').value = doc._id;
    document.getElementById('editNomeUsuario').value = doc.usuario;
    document.getElementById('editSenhaUsuario').value = doc.senha;
    document.getElementById('editTipoUsuario').value = doc.tipo;
    new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
  });
}

async function salvarEdicaoUsuario(event) {
  event.preventDefault();
  const id = document.getElementById('editIdUsuario').value;
  const usuario = document.getElementById('editNomeUsuario').value.trim();
  const senha = document.getElementById('editSenhaUsuario').value.trim();
  const tipo = document.getElementById('editTipoUsuario').value;
  if (!usuario || !senha || !tipo || senha.length < 4) {
    alert('Preencha todos os campos corretamente!');
    return false;
  }
  const doc = await dbUsuarios.get(id);
  doc.usuario = usuario;
  doc.senha = senha;
  doc.tipo = tipo;
  await dbUsuarios.put(doc);
  alert('Usuário editado com sucesso!');
  bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
  listarUsuarios();
}

async function excluirUsuario(id) {
  if (confirm('Deseja realmente excluir este usuário?')) {
    const doc = await dbUsuarios.get(id);
    await dbUsuarios.remove(doc);
    alert('Usuário excluído!');
    listarUsuarios();
  }
}

document.addEventListener("DOMContentLoaded", listarUsuarios);
  