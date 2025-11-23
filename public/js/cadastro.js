// Mostra senha

const input = document.getElementById("input-password")
const toggle = document.querySelector(".icons")

toggle.addEventListener('click' , () => {
    if (input.type === "password") {
        input.type = "text"
        toggle.src = "/logos/icons/eye-off.svg" 
    } else {
        input.type = "password"
        toggle.src = "/logos/icons/eye.svg"
    }




 })

 const inputConfirm = document.getElementById("input-confirm-password")
 const toggleConfirm = document.querySelectorAll(".icons")[1]

    toggleConfirm.addEventListener('click' , () => {
        if (inputConfirm.type === "password") {
            inputConfirm.type = "text"
            toggleConfirm.src = "/logos/icons/eye-off.svg" 
        } else {
            inputConfirm.type = "password"
            toggleConfirm.src = "/logos/icons/eye.svg"
        }   




    })
    
// Fim mostra senha

//Validação de formulário
const form = document.getElementById("form-cadastro");

if (form) {
  form.addEventListener("submit", function(e) {
    input.classList.remove("invalid");
    inputConfirm.classList.remove("invalid");

    if (input.value.length < 8) {
      e.preventDefault();
      input.classList.add("invalid");
      alert("A senha deve ter pelo menos 8 caracteres!");
      return;
    }

    if (input.value !== inputConfirm.value) {
      e.preventDefault();
      input.classList.add("invalid");
      inputConfirm.classList.add("invalid");
      alert("As senhas não coincidem!");
    }
  });
}

// Fim validação de formulário
