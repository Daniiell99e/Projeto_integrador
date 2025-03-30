let cadastrar = document.querySelector(".continue-button")
        cadastrar.disabled = true

        function enableOrDisableButton(){
            const contrato = document.getElementById("contrato")

            if(contrato.checked == true){
                cadastrar.disabled = false
            }else{
                cadastrar.disabled = true
            }
        }