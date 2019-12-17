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

	}

	createBlock(tagName, className){
		let block = document.createElement(tagName);
		if(className){
			block.classList.add(className);
		}

		return block;
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