const btsVerDetalhes = document.querySelectorAll('.card-button')

btsVerDetalhes.forEach(botao => {
  botao.addEventListener('click', () => {
    // Pega o ID do item, por exemplo via data-attribute
    const id = botao.getAttribute('data-id');

    // Redireciona para a página de detalhes correspondente
    window.location.href = 'detalhesDestino.html';
  });
});