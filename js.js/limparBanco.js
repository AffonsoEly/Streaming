const PouchDB = require('pouchdb');
const dbFilmes = new PouchDB('streaming_filmes');
const dbUsuarios = new PouchDB('streaming_usuarios');

Promise.all([
  dbFilmes.destroy(),
  dbUsuarios.destroy()
]).then(() => {
  console.log('Bancos de dados excluídos com sucesso!');
}).catch(err => {
  console.error('Erro ao excluir bancos:', err);
});