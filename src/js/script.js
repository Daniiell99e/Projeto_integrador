// Função para alternar a visibilidade do menu em dispositivos móveis
function toggleMenu(){
    // Obtém o elemento do menu móvel pelo ID "menu-mobile"
    const menuMobile =  document.getElementById("menu-mobile")

    // Verifica se o menu está atualmente ativo, ou seja, se a classe do elemento é "menu-mobile-active"
    if(menuMobile.className === "menu-mobile-active"){
         // Se estiver ativo, altera a classe para "menu-mobile", desativando-o (ocultando o menu)
        menuMobile.className = "menu-mobile"
    }else{
        // Se não estiver ativo, altera a classe para "menu-mobile-active", ativando-o (exibindo o menu)
        menuMobile.className = "menu-mobile-active"
    }
}