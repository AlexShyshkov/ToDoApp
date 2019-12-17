'use strict';

class Model{

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