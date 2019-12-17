'use strict';

class Model{
	constructor(){
		this.todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
	}

	addTodoItems(inputedText){
		let todoItem = {
			id: this.todoItems.length > 0 ? this.todoItems[this.todoItems.length - 1].id + 1 : 1,
			text: inputedText,
			isComplete: false
		}
	}
}

class View{

}

class Controller{
	constructor(model, view){
		this.model = model;
		this.view = view;
	}
}

let model = new Model();
let view = new View();
let todoApp = new Controller(model, view);