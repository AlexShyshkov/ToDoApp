'use strict';

class Model{
	constructor(){
		this.todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
	}

	bindTodoListChanged(callback){
		this.onTodoListChanged = callback;
	}

	/*Private methode for updating value in local storage and state of model
	This method will call after every change of this.todoItems*/
	_updateValue(todoItems){
		this.onTodoListChanged(todoItems);
		localStorage.setItem('items', JSON.stringify(todoItems));
	}

	//Add task to the task list
	addTodoItem(inputedText){
		let todoItem = {
			id: this.todoItems.length > 0 ? this.todoItems[this.todoItems.length - 1].id + 1 : 1,
			text: inputedText,
			complete: false
		}

		this.todoItems.push(todoItem);
		this._updateValue(this.todoItems);
	}

	//Check all tasks in todo items list and replace the text of task with choosen id
	editTodoItem(id, newTodoItemValue){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: newTodoItemValue,
				complete: todoItem.complete
			} :	todoItem
		);

		this._updateValue(this.todoItems);	
	}

	//Delete task by id
	deleteTodoItem(id){
		this.todoItems = this.todoItems.filter(todoItem => todoItem.id !== id);

		this._updateValue(this.todoItems);
	}

	//Toggle boolean complete property of the task
	completeTodoItem(id){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: todoItem.text,
				complete: !todoItem.complete
			} : todoItem
		);

		this._updateValue(this.todoItems);
	}

	/*sortTodoItem(complete){
		this.todoItems = this.todoItems.filter(todoItem => todoItem.complete === true);

		//this._updateValue(this.todoItems);
	}*/
}

class View{
	constructor(){
		//Recieve root element
		this.todoApp = this.getElement('#app');

		//Creation of block with select, input field and add button
		this.inputBlock = this.createBlock('div', 'input-block');
		this.inputBlock.id = 'inputBlock';
		this.form = this.createBlock('form');

		//Creation of select element for filter items in list
		this.select = this.createBlock('select', 'todo-select');
		this.select.id = 'taskFilter';
		this.optionAll = this.createBlock('option');
		this.optionAll.text = 'All';
		this.optionDone = this.createBlock('option');
		this.optionDone.text = 'Done';
		this.select.append(this.optionAll, this.optionDone, this.optionActive);

		//Creation of input field for todo items
		this.input = this.createBlock('input', 'todo-input');
		this.input.id = 'taskInput';
		this.input.type = 'text';
		this.input.placeholder = 'Write you task here...';
		this.input.name = 'task';

		//Creation of Add button
		this.addButton = this.createBlock('button', 'add-btn');
		this.addButton.id = 'addTaskBtn';
		this.addButton.textContent = 'Add';

		//Creation of list for todo items
		this.todoItemsList = this.createBlock('ul', 'todo-list');
		this.todoItemsList.id = 'todoItemsList';

		this.form.append(this.select, this.input, this.addButton)
		this.inputBlock.append(this.form);
		this.todoApp.append(this.inputBlock, this.todoItemsList);

		this._temporaryTodoItem = '';
		this._updateTemporaryTodoItem();
	}

	//Private method for recieving value from input
	get _inputText(){
		return this.input.value;
	}

	//Private method for reset/clear input field after addition of new task
	_clearInput(){
		this.input.value = '';
	}

	//Create tag with css style
	createBlock(tagName, className){
		let block = document.createElement(tagName);
		if(className){
			block.classList.add(className);
		}

		return block;
	}

	//Recieve element from the DOM
	getElement(elementId){
		let element = document.querySelector(elementId);

		return element;
	}

	//Method creates ul and li tags for new tasks and display list of tasks
	displayTodoItems(todoItems){
		//delete all nodes if they exist
		while(this.todoItemsList.firstChild){
			this.todoItemsList.removeChild(this.todoItemsList.firstChild);
		}

		//display default message if no tasks in the list
		if(todoItems.length === 0){
			let defaultMessage = this.createBlock('p', 'default-msg');
			defaultMessage.textContent = 'You have no tasks today';
			this.todoItemsList.append(defaultMessage);
		} else {
			//Create todo item node
			todoItems.forEach( todoItem => {
				let line = this.createBlock('li', 'todo-list-line');
				line.id = todoItem.id;

				let checkbox = this.createBlock('input', 'todo-list-line__checkbox');
				checkbox.type = 'checkbox';
				checkbox.checked = todoItem.complete;

				let span = this.createBlock('span', 'todo-list-line__span');
				span.contentEditable = true;
				
				//If todo item has status complete - create strike through line text
				if(todoItem.complete){
					let strike = this.createBlock('s');
					strike.textContent = todoItem.text;
					span.append(strike);
				} else {
					//In othe case just display todo item
					span.textContent = todoItem.text;
				}

				let deleteBtn = this.createBlock('button', 'delete-btn');
				deleteBtn.textContent = 'Delete';
				line.append(checkbox, span, deleteBtn);

				//Append all nodes to the todo items list, which was created in constructor
				this.todoItemsList.prepend(line);
			});
		}

		//console.log(todoItems);
	}

	//Private method for updating temporary state
	_updateTemporaryTodoItem(){
		this.todoItemsList.addEventListener('input', event => {
			if(event.target.className === 'todo-list-line__span'){
				this._temporaryTodoItem = event.target.innerText;
			}
		});
	}

	//Add event listeners on the DOM elements
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

	/*bindSortTodoItem(handler){
		this.select.addEventListener('change', event =>{
			if(event.target.options[this.select.selectedIndex].text === 'Done'){
				let id = parseInt(event.target.parentElement.id);

				handler(id);
			}
		});
	}*/
}

class Controller{
	constructor(model, view){
		this.model = model;
		this.view = view;

		this.model.bindTodoListChanged(this.onTodoListChanged);

		//Call event handlers from the view
		this.view.bindAddTodoItem(this.addTodoItemHandler);
		this.view.bindDeleteTodoItem(this.deleteTodoItemHandler);
		this.view.bindCompleteTodoItem(this.completeTodoItemHandler);
		this.view.bindEditTodoItem(this.editTodoItemHandler);

		//this.view.bindSortTodoItem(this.sortTodoItemHandler);

		//Display default items if they exist
		this.onTodoListChanged(this.model.todoItems);
	}

	//Handlers for the events in the controller
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

	/*sortTodoItemHandler = complete => {
		this.model.sortTodoItem(complete);
	}*/
}

let todoApp = new Controller(new Model(), new View());