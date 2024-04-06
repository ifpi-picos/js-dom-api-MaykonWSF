// JavaScript Code
// Constants for API usage (replace with actual API endpoint and your API key)
const TODOIST_API_URL = 'https://api.todoist.com/rest/v2/tasks';
const API_KEY = 'ee4da9945733b28e8c36275210782dc76424fdbe';

document.querySelector('.nova-tarefa').addEventListener('click', async () => {
    const taskName = prompt('Enter the task name:');
    const dueDate = prompt('Enter the due date (YYYY-MM-DD):');
  
    if (taskName && dueDate) {
      await postTaskToTodoist(taskName, dueDate);
    }
  });

//Adicionar nova tarefa
  function addNewTaskCard(taskName, dueDate) {
  const list = document.querySelector('.card');

  const taskItem = document.createElement('li');
  taskItem.className = 'task';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'conteudo';

  const taskInput = document.createElement('input');
  taskInput.type = 'checkbox';
  taskInput.id = taskName.toLowerCase().replace(/ /g, '-');

  const textDiv = document.createElement('div');
  textDiv.className = 'texto';

  const taskLabel = document.createElement('label');
  taskLabel.htmlFor = taskInput.id;
  taskLabel.innerHTML = `<strong>${taskName}</strong>`;

  const dateSpan = document.createElement('span');
  dateSpan.className = 'data';
  dateSpan.textContent = dueDate;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'botoes';

  const removeButton = document.createElement('button');
  removeButton.className = 'remover';
  removeButton.innerHTML = '🗑️';
  // Add an event listener to handle task removal
  removeButton.addEventListener('click', function() {
    taskItem.remove();
  });

  textDiv.appendChild(taskLabel);
  textDiv.appendChild(dateSpan);
  contentDiv.appendChild(taskInput);
  contentDiv.appendChild(textDiv);
  taskItem.appendChild(contentDiv);
  taskItem.appendChild(buttonsDiv);
  list.appendChild(taskItem);
}

document.addEventListener('DOMContentLoaded', () => {
    exibirTasks(); // Chama a função para carregar e exibir as tarefas existentes
});

// Função para exibir as tarefas na página
async function exibirTasks() {
    try {
        const response = await fetch(TODOIST_API_URL, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (response.ok) {
            const tarefas = await response.json();
            const lista = document.querySelector('.card');
            lista.innerHTML = '';

            tarefas.forEach(tarefa => {
                addNewTaskCard(tarefa.content, tarefa.due ? tarefa.due.date : 'Sem data');
            });
        } else {
            throw new Error('Falha ao carregar tarefas do Todoist');
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas do Todoist:', error);
    }
}

// Correção da função para postar uma nova tarefa para a API do Todoist v2
async function postTaskToTodoist(taskName, dueDate) {
    try {
        const task = { content: taskName };
        if (dueDate) {
            task.due_string = dueDate;
            task.due_lang = 'pt';
        }
        
        const response = await fetch(TODOIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            await exibirTasks();
        } else {
            throw new Error('Falha ao postar tarefa no Todoist');
        }
    } catch (error) {
        console.error('Erro ao postar tarefa no Todoist:', error);
    }
}