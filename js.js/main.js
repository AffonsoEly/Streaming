const db = new PouchDB('streaming_filmes');

// Dados iniciais (apenas para exemplo)
const videosIniciais = [
  {
    _id: 'video_1',
    titulo: 'Vídeo 1',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    _id: 'video_2',
    titulo: 'Vídeo 2',
    url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ'
  },
  {
    _id: 'video_3',
    titulo: 'Vídeo 3',
    url: 'https://www.youtube.com/embed/L_jWHffIx5E'
  },
  {
    _id: 'video_4',
    titulo: 'Vídeo 4',
    url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
  },
  {
    _id: 'video_5',
    titulo: 'Vídeo 5',
    url: 'https://www.youtube.com/embed/e-ORhEE9VVg'
  },
  {
    _id: 'video_6',
    titulo: 'Vídeo 6',
    url: 'https://www.youtube.com/embed/kXYiU_JCYtU'
  }
];

// Inserir vídeos se não existirem
videosIniciais.forEach(video => {
  db.get(video._id).catch(() => db.put(video));
});

async function carregarVideos() {
  const container = document.getElementById('videoList');
  container.innerHTML = '';
  const result = await db.allDocs({ include_docs: true });

  result.rows.forEach(({ doc }) => {
    const idYoutube = doc.url.split('/embed/')[1];
    container.innerHTML += `
      <div class="col-md-4 col-sm-6 mb-4">
        <div class="card h-100 video-card bg-black text-white" onclick="playVideo('${doc.url}')">
          <img src="https://img.youtube.com/vi/${idYoutube}/0.jpg" class="card-img-top" alt="${doc.titulo}">
          <div class="card-body text-center">
            <h5 class="card-title">${doc.titulo}</h5>
          </div>
        </div>
      </div>
    `;
  });
}

function playVideo(url) {
  localStorage.setItem("currentVideo", url);
  window.location.href = "player.html";
}

function filtrarVideos() {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const cards = document.querySelectorAll(".video-card");
  cards.forEach(card => {
    const titulo = card.querySelector(".card-title").innerText.toLowerCase();
    card.parentElement.style.display = titulo.includes(filtro) ? "block" : "none";
  });
}

async function login(event) {
  event.preventDefault();
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;
  try {
    const result = await db.find({ selector: { tipo: 'usuario', nome: user, senha: pass } });
    if (result.docs.length > 0) {
      alert("Login bem-sucedido!");
      // redirecionar se quiser
    } else {
      alert("Usuário ou senha incorretos.");
    }
  } catch (err) {
    console.error("Erro ao autenticar:", err);
    alert("Erro no login.");
  }
}

document.addEventListener("DOMContentLoaded", carregarVideos);
// adicionando o conteudo da página de filmes.html dinamicamente, logo após o carregamento do DOM
//  para garantir que o elemento exista
document.addEventListener("DOMContentLoaded", () => {
  carregarVideos();

  // Handler para carregar filmes.html dinamicamente ao clicar em "Filmes"
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
