'use strict';

export default class Controller{
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