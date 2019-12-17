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
	}

	editTodoItem(id, newTodoItemValue){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: newTodoItemValue,
				isComplete: todoItem.isComplete
			} :	todoItem
		);	
	}

	deleteTodoItem(id){
		this.todoItems = this.todoItems.filter(todoItem => todoItem.id !== id);
	}

	changeCompleteProperty(id){
		this.todoItems = this.todoItems.map(todoItem =>
			todoItem.id === id ? {
				id: todoItem.id,
				text: todoItem.inputedText,
				isComplete: !todoItem.isComplete
			} : todoItem
		);
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
}

class Controller{
	constructor(model, view){
		this.model = model;
		this.view = view;
	}
}

let modelApp = new Model();
let viewApp = new View();
let todoApp = new Controller(modelApp, viewApp);