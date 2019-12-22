'use strict';

class Model{
	constructor(){
		this.todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
	}

	bindTodoListChanged(callback){
		this.onTodoListChanged = callback;
	}

	_saveItem(todoItems){
		this.onTodoListChanged(todoItems);
		localStorage.setItem('items', JSON.stringify(todoItems));
	}

	addTodoItem(inputedText){
		let todoItem = {
			id: this.todoItems.length > 0 ? this.todoItems[this.todoItems.length - 1].id + 1 : 1,
			text: inputedText,
			complete: false
		}

		this.todoItems.push(todoItem);
		this._saveItem(this.todoItems);
	}

	editTodoItem(id, newTodoItemValue){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: newTodoItemValue,
				complete: todoItem.complete
			} :	todoItem
		);

		this._saveItem(this.todoItems);	
	}

	deleteTodoItem(id){
		this.todoItems = this.todoItems.filter(todoItem => todoItem.id !== id);

		this._saveItem(this.todoItems);
	}

	completeTodoItem(id){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: todoItem.inputedText,
				complete: !todoItem.complete
			} : todoItem
		);

		this._saveItem(this.todoItems);
	}
}

class View{
	constructor(){
		this.todoApp = this.getElement('#app');

		/*Block with select, input, add button*/
		this.inputBlock = this.createBlock('div', 'input-block');
		this.inputBlock.id = 'inputBlock';

		this.form = this.createBlock('form');

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

		this.form.append(this.select, this.input, this.addButton)
		this.inputBlock.append(this.form);
		this.todoApp.append(this.inputBlock, this.todoItemsList);

		/**/
		this._temporaryTodoItem = '';
		this._updateTemporaryTodoItem();
	}

	get _inputText(){
		return this.input.value;
	}

	_clearInput(){
		this.input.value = '';
	}

	createBlock(tagName, className){
		let block = document.createElement(tagName);
		if(className){
			block.classList.add(className);
		}

		return block;
	}

	getElement(elementId){
		let element = document.querySelector(elementId);

		return element;
	}

	displayTodoItems(todoItems){
		while(this.todoItemsList.firstChild){
			this.todoItemsList.removeChild(this.todoItemsList.firstChild);
		}

		if(todoItems.length === 0){
			let defaultMessage = this.createBlock('p');
			defaultMessage.classList.add('default-msg');
			defaultMessage.textContent = 'You have no tasks today';
			this.todoItemsList.append(defaultMessage);
		} else {
			todoItems.forEach( todoItem => {
				let line = this.createBlock('li');
				line.classList.add('todo-list-line');
				line.id = todoItem.id;

				let checkbox = this.createBlock('input');
				checkbox.type = 'checkbox';
				checkbox.checked = todoItem.complete;

				let span = this.createBlock('span');
				span.contentEditable = true;
				span.classList.add('editable');

				if(todoItem.complete){
					let strike = this.createBlock('s');
					strike.textContent = todoItem.text;
					span.append(strike);
				} else {
					span.textContent = todoItem.text;
				}

				let deleteBtn = this.createBlock('button', 'delete-btn');
				deleteBtn.textContent = 'Delete';
				line.append(checkbox, span, deleteBtn);

				this.todoItemsList.prepend(line);
			});
		}

		console.log(todoItems);
	}

	_updateTemporaryTodoItem(){
		this.todoItemsList.addEventListener('input', event => {
			if(event.target.className === 'editable'){
				this._temporaryTodoItem = event.target.innerText;
			}
		});
	}

	bindAddTodoItem(handler){
		this.form.addEventListener('submit', event => {
			event.preventDefault();

			if(this._inputText){
				handler(this._inputText);
				this._clearInput();
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

	bindEditTodoItem(handler){
		this.todoItemsList.addEventListener('focusout', event => {
			if(this._temporaryTodoItem){
				let id = parseInt(event.target.parentElement.id);

				handler(id, this._temporaryTodoItem);
				this._temporaryTodoItem = '';
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
		this.view.bindEditTodoItem(this.editTodoItemHandler);

		this.onTodoListChanged(this.model.todoItems);
	}

	onTodoListChanged = todoItems => {
		this.view.displayTodoItems(todoItems);
	}

	addTodoItemHandler = text => {
		this.model.addTodoItem(text);
	}

	editTodoItemHandler = (id, text) => {
		this.model.editTodoItem(id, text);
	}

	deleteTodoItemHandler = id => {
		this.model.deleteTodoItem(id);
	}

	completeTodoItemHandler = id => {
		this.model.completeTodoItem(id);
	}
}

let todoApp = new Controller(new Model(), new View());