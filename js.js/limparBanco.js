const PouchDB = require('pouchdb');
const db = new PouchDB('streaming_filmes');

db.allDocs({ include_docs: true }).then(res => {
  return Promise.all(res.rows.map(row => db.remove(row.doc)));
}).then(() => {
  console.log('Todos os vídeos removidos!');
});