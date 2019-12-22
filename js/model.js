'use strict';

export default class Model{
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