'use strict';

import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

let todoApp = new Controller(new Model(), new View());