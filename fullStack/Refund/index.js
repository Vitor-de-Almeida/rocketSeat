// Seleciona os elementos do formulário.
const form = document.querySelector('form')
const amount = document.getElementById('amount');
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Captura o evento do input para formatar o valor.
amount.oninput = () => {

    //Obtém o valor atual do input e remove os caracteres não numéricos.
    let valorInput = amount.value.replace(/\D/g, "")
    //Transforma o valor em cetavos
    valorInput = Number(valorInput) / 100
    //Atualiza o valor do input para reais.
    amount.value = formatCurrencyBRL(valorInput)

}

//Transforma o valor da moeda para padrão BRL.
function formatCurrencyBRL(parametro) {
    //Formata o valor no padrão BRL (Real Brasileiro)
    const formatoMoeda = {
        style:"currency",
        currency:"BRL"
    }
   
    parametro = parametro.toLocaleString('pt-BR', formatoMoeda)

    return parametro
}

//Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
    event.preventDefault()
    //Cria objeto com os detalhes da nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    //Chama a função que irá adcionar o item na lista
    expenseAdd(newExpense)
}

//Adiciona um novo item na lista.
function expenseAdd(newExpense) {
    try {

        //Cria o elemento de li para adicionar o item na lista.
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a informação da despesa.

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //Cria o nome da despesa.

        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa.

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name
        
        //adiciona o nome e categoria na div das informações da despesa.

        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa.

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

        // Cria o ícone de remover

        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adiciona as informações no item.

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista.

        expenseList.append(expenseItem)

        // Limpa o formulário para adicionar um novo item

        formClear()
        
        //Atualiza as despesas totais.

        updateTotals()
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

//Atualiza as despesas totais.

function updateTotals() {
    try {
        //Recupera a quantidade de itens (li) da lista (ul)
        const items = expenseList.children
        // Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
        // Variável para incrementar o total do valor.
        let total = 0

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")
            // Remove caracteres não númericos e substitui a vírgula por ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            // Converte para valor float.
            value = parseFloat(value)
            //Verifica se é um número válido
            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }
            //Incrementar o valor total.

            total += Number(value)
        }
        //Cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que será exibido pela small com um estilo.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

        // Adiciona o símbolo da moeda e o valor total formatado.
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar a quantidade de despesas totais")
    }
}

expenseList.addEventListener('click', function (event) {
    //Verificar se o elemento clicado é o ícone para remover.
    if (event.target.classList.contains("remove-icon")) {
        //Obtém a li pai do elemento clicado.
        const item = event.target.closest(".expense")
        // Remove o item da lista.
        item.remove()
    }
    //Atualiza os totais.
    updateTotals()
})

function formClear() {
    expense.value =""
    category.value =""
    amount.value =""
    expense.focus()
}