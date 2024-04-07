const URL_API_TODOIST = 'https://api.todoist.com/rest/v2/tasks'
const CHAVE_API = 'ee4da9945733b28e8c36275210782dc76424fdbe'

function formatarDataParaBR(dataISO) {
  if (!dataISO) return 'Sem data'
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarDataParaISO(dataBR) {
  const [dia, mes, ano] = dataBR.split('/')
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

document.querySelector('.nova-tarefa').addEventListener('click', async () => {
    const nomeTarefa = prompt('Digite o nome da tarefa:')
    const dataEntregaBR = prompt('Digite a data de entrega (DD/MM/YYYY):')
  
    if (nomeTarefa && dataEntregaBR) {
      await postarTarefaParaTodoist(nomeTarefa, dataEntregaBR)
    }
})

function adicionarNovoCartaoTarefa(nomeTarefa, dataISO, idTarefa) {
  const lista = document.querySelector('.card')

  const itemTarefa = document.createElement('li')
  itemTarefa.className = 'task'

  const divConteudo = document.createElement('div')
  divConteudo.className = 'conteudo'

  const inputTarefa = document.createElement('input')
  inputTarefa.type = 'checkbox'
  inputTarefa.id = `tarefa-${idTarefa}`

  const divTexto = document.createElement('div')
  divTexto.className = 'texto'

  const rotuloTarefa = document.createElement('label')
  rotuloTarefa.htmlFor = inputTarefa.id
  rotuloTarefa.innerHTML = `<strong>${nomeTarefa}</strong>`

  const spanData = document.createElement('span')
  spanData.className = 'data'
  spanData.textContent = formatarDataParaBR(dataISO)

  const divBotoes = document.createElement('div')
  divBotoes.className = 'botoes'

  const botaoRemover = document.createElement('button')
  botaoRemover.className = 'remover'
  botaoRemover.innerHTML = '🗑️'
  botaoRemover.addEventListener('click', function() {
    removerTarefa(idTarefa, itemTarefa)
  })

  divTexto.appendChild(rotuloTarefa)
  divTexto.appendChild(spanData)
  divConteudo.appendChild(inputTarefa)
  divConteudo.appendChild(divTexto)
  divBotoes.appendChild(botaoRemover)
  itemTarefa.appendChild(divConteudo)
  itemTarefa.appendChild(divBotoes)
  lista.appendChild(itemTarefa)
}

document.addEventListener('DOMContentLoaded', () => {
    exibirTarefas()
})

async function exibirTarefas() {
    try {
        const resposta = await fetch(URL_API_TODOIST, {
            headers: {
                'Authorization': `Bearer ${CHAVE_API}`
            }
        })

        if (resposta.ok) {
            const tarefas = await resposta.json()
            const lista = document.querySelector('.card')
            lista.innerHTML = ''

            tarefas.forEach(tarefa => {
                adicionarNovoCartaoTarefa(tarefa.content, tarefa.due ? tarefa.due.date : '', tarefa.id)
            })
        } else {
            throw new Error('Falha ao carregar tarefas do Todoist')
        }
    } catch (erro) {
        console.error('Erro ao carregar tarefas do Todoist:', erro)
    }
}

async function postarTarefaParaTodoist(nomeTarefa, dataEntregaBR) {
    try {
        const tarefa = {
            content: nomeTarefa,
            due_date: dataEntregaBR ? formatarDataParaISO(dataEntregaBR) : undefined
        }
        
        const resposta = await fetch(URL_API_TODOIST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHAVE_API}`
            },
            body: JSON.stringify(tarefa)
        })

        if (resposta.ok) {
            await exibirTarefas()
        } else {
            throw new Error('Falha ao postar tarefa no Todoist')
        }
    } catch (erro) {
        console.error('Erro ao postar tarefa no Todoist:', erro)
    }
}

async function removerTarefa(idTarefa, elementoTarefa) {
  try {
    const resposta = await fetch(`${URL_API_TODOIST}/${idTarefa}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CHAVE_API}`
      }
    })

    if (resposta.ok) {
      elementoTarefa.remove()
    } else {
      throw new Error('Falha ao deletar tarefa do Todoist')
    }
  } catch (erro) {
    console.error('Erro ao deletar tarefa do Todoist:', erro)
  }
}