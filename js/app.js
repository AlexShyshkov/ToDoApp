'use strict';

class Model{
	constructor(){
		this.todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
	}

	addTodoItem(inputedText){
		let todoItem = {
			id: this.todoItems.length > 0 ? this.todoItems[this.todoItems.length - 1].id + 1 : 1,
			text: inputedText,
			isComplete: false
		}

		this.todoItems.push(todoItem);
		this.saveItem(this.todoItems);
	}

	editTodoItem(id, newTodoItemValue){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: newTodoItemValue,
				isComplete: todoItem.isComplete
			} :	todoItem
		);

		this.saveItem(this.todoItems);	
	}

	deleteTodoItem(id){
		this.todoItems = this.todoItems.filter(todoItem => todoItem.id !== id);

		this.saveItem(this.todoItems);
	}

	completeTodoItem(id){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: todoItem.inputedText,
				isComplete: !todoItem.isComplete
			} : todoItem
		);

		this.saveItem(this.todoItems);
	}

	bindTodoListChanged(callback){
		this.onTodoListChanged = callback;
	}

	saveItem(todoItems){
		this.onTodoListChanged(todoItems);
		localStorage.setItem('items', JSON.stringify(todoItems));
	}
}

class View{
	constructor(){
		this.todoApp = this.getElement('app');

		/*Block with select, input, add button*/
		this.inputBlock = this.createBlock('div', 'input-block');
		this.inputBlock.id = 'inputBlock';

		/*Select for filter items*/
		this.select = this.createBlock('select', 'todo-select');
		this.select.id = 'taskFilter';
		this.optionAll = this.createBlock('option');
		this.optionAll.text = 'All';
		this.optionDone = this.createBlock('option');
		this.optionDone.text = 'Done';
		this.optionActive = this.createBlock('option');
		this.optionActive.text = 'Active';
		this.select.append(this.optionAll, this.optionDone, this.optionActive);

		/*Input for todo items*/
		this.input = this.createBlock('input', 'todo-input');
		this.input.id = 'taskInput';
		this.input.type = 'text';
		this.input.placeholder = 'Write you task here...';
		this.input.name = 'task';

		/*Add button*/
		this.addButton = this.createBlock('button', 'add-btn');
		this.addButton.id = 'addTaskBtn';
		this.addButton.textContent = 'Add';

		/*List for todo items*/
		this.todoItemsList = this.createBlock('ul', 'todo-list');
		this.todoItemsList.id = 'todoItemsList';

		this.inputBlock.append(this.select, this.input, this.addButton);
		this.todoApp.append(this.inputBlock, this.todoItemsList);

		/**/
		this.temporaryTodoItem = '';
		this.updateTemporaryTodoItem();
	}

	updateTemporaryTodoItem(){
		this.todoItemsList.addEventListener('input', event => {
			if(event.target.className === 'editable'){
				this.temporaryTodoItem = event.target.innerText;
			}
		});
	}

	createBlock(tagName, className){
		let block = document.createElement(tagName);
		if(className){
			block.classList.add(className);
		}

		return block;
	}

	getElement(elementId){
		let element = document.getElementById(elementId);

		return element;
	}

	get inputText(){
		return this.input.value;
	}

	clearInput(){
		this.input.value = '';
	}

	displayTodoItems(todoItems){
		while(this.todoItemsList.firstChild){
			this.todoItemsList.removeChild(this.todoItemsList.firstChild);
		}

		if(todoItems.length === 0){
			let defaultMessage = this.createBlock('p');
			defaultMessage.textContent = 'You have no tasks today';
			this.todoItemsList.append(defaultMessage);
		} else {
			todoItems.forEach( todoItem => {
				let line = this.createBlock('li');
				line.id = todoItem.id;

				let checkbox = this.createBlock('input');
				checkbox.type = 'checkbox';
				checkbox.checked = todoItem.isComplete; //

				let span = this.createBlock('span');
				span.contentEditable = true;
				span.classList.add('editable');

				if(todoItem.isComplete){
					let strike = this.createBlock('s');
					strike.textContent = todoItem.text;
					span.append(strike);
				} else {
					span.textContent = todoItem.text;
				}

				let deleteBtn = this.createBlock('button', 'delete-btn');
				deleteBtn.textContent = 'Delete';
				line.append(checkbox, span, deleteBtn);

				this.todoItemsList.append(line);
			});
		}
	}

	bindAddTodoItem(handler){
		this.addButton.addEventListener('submit', event => {//-form?
			event.preventDefault();

			if(this.inputText){
				handler(this.inputText);
				this.clearInput();
			}
		});
	}

	bindDeleteTodoItem(handler){
		this.todoItemsList.addEventListener('click', event => {
			if(event.target.className === 'delete-btn'){
				let id = parseInt(event.target.parentElement.id);

				handler(id);
			}
		});
	}

	bindCompleteTodoItem(handler){
		this.todoItemsList.addEventListener('change', event => {
			if(event.target.type === 'checkbox'){
				let id = parseInt(event.target.parentElement.id);

				handler(id);
			}
		});
	}
}

class Controller{
	constructor(model, view){
		this.model = model;
		this.view = view;

		this.model.bindTodoListChanged(this.onTodoListChanged);

		this.view.bindAddTodoItem(this.addTodoItemHandler);
		this.view.bindDeleteTodoItem(this.deleteTodoItemHandler);
		this.view.bindCompleteTodoItem(this.completeTodoItemHandler);

		this.onTodoListChanged(this.model.todoItems);
	}

	onTodoListChanged(todoItems){//??
		this.view.displayTodoItems(todoItems);
	}

	addTodoItemHandler(text){
		this.model.addTodoItem(text);
	}

	editTodoItemHandler(id, text){
		this.model.editTodoItem(id, text);
	}

	deleteTodoItemHandler(id){
		this.model.deleteTodoItem(id);
	}

	completeTodoItemHandler(id){
		this.model.completeTodoItem(id);
	}
}

let modelApp = new Model();
let viewApp = new View();
let todoApp = new Controller(modelApp, viewApp);