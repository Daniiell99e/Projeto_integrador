const urlParams = new URLSearchParams(window.location.search);
const cidadeId = urlParams.get('cidadeID'); // 'cidadeID' deve ser a mesma chave usada na URL

console.log('ID Recebido:', cidadeId);

