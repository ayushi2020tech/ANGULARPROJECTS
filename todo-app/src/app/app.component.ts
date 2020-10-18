import {Component} from '@angular/core';
import {Todo} from './todo';
import {TodoDataService} from './todo-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoDataService]
})
export class AppComponent {

  newTodo: Todo = new Todo();

  constructor(private todoDataService: TodoDataService) {
  }

  addTodo() {
    this.todoDataService.addTodo(this.newTodo);
    this.newTodo = new Todo();
  }

  toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo);
  }

  removeTodo(todo) {
    this.todoDataService.deleteTodoById(todo.id);
  }

  get todos() {
    return this.todoDataService.getAllTodos();
  }
  Access Now

Skip to main content
Blog
Community
Jobs
Library
Login
Join Premium
Building a Todo App with Angular CLI
By Jurgen Van de Moere, Todd Motto
JavaScript

March 15, 2018
Share:






Free JavaScript Book!

Write powerful, clean and maintainable JavaScript.

RRP $11.95

Get the book free!
This article on building a todo app with Angular CLI is the first in a four-part series on how to write a todo application in Angular 2:

Part 0 — The Ultimate Angular CLI Reference Guide
Part 1 — Getting our first version of the Todo application up and running
Part 2 — Creating separate components to display a list of todos and a single todo
Part 3 — Update the Todo service to communicate with a REST API
Part 4 — Use Angular router to resolve data
Part 5 — Add authentication to protect private content
Part 6 — How to Update Angular Projects to the latest version.
Prefer to learn Angular using a step-by-step video course? Check out Learn Angular 5 on SitePoint Premium.

Angular CLI: Illustration of a monitor covered with post-it notes and todo lists

In each article, we’ll refine the underlying architecture of the application and we make sure we have a working version of the application that looks like this:

Angular CLI: Animated GIF of Finished Todo Application

By the end of this series, our application architecture will look like this:

Angular CLI: Application Architecture of Finished Todo Application

The items that are marked with a red border are discussed in this article, while items that are not marked with a red border will be discussed in follow-up articles within this series.

In this first part, you’ll learn how to:

initialize your Todo application using Angular CLI
create a Todo class to represent individual todos
create a TodoDataService service to create, update and remove todos
use the AppComponent component to display the user interface
deploy your application to GitHub pages
So let’s get started!

Rather than a successor of AngularJS 1.x, Angular 2 can be considered an entirely new framework built on lessons from AngularJS 1.x. Hence the name change where Angular is used to denote Angular 2 and AngularJS refers to AngularJS 1.x. In this article, we’ll use Angular and Angular 2 interchangeably, but they both refer to Angular 2.

As of February 9, 2017, the ng deploy command has been removed from the core of Angular CLI. Read more here.

Initialize Your Todo Application Using Angular CLI
One of the easiest ways to start a new Angular 2 application is to use Angular’s command-line interface (CLI).

To install Angular CLI, run:

$ npm install -g angular-cli
This will install the ng command globally on your system.

To verify whether your installation completed successfully, you can run:

$  ng version
This should display the version you’ve installed:

angular-cli: 1.0.0-beta.21
node: 6.1.0
os: darwin x64
Now that you have Angular CLI installed, you can use it to generate your Todo application:


Learn PHP for free!
Make the leap into server-side programming with a comprehensive cover of PHP & MySQL.

Normally RRP $11.95 Yours absolutely free

Name
Email
Get the book free
$ ng new todo-app
This creates a new directory with all files you need to get started:

todo-app
├── README.md
├── angular-cli.json
├── e2e
│   ├── app.e2e-spec.ts
│   ├── app.po.ts
│   └── tsconfig.json
├── karma.conf.js
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── index.ts
│   ├── assets
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.json
│   └── typings.d.ts
└── tslint.json
If you’re not familiar with the Angular CLI yet, make sure you check out The Ultimate Angular CLI Reference.

You can now navigate to the new directory:

$ cd todo-app
Then start the Angular CLI development server:

$ ng serve
This will start a local development server that you can navigate to in your browser at http://localhost:4200/.

The Angular CLI development server includes LiveReload support, so your browser automatically reloads the application when a source file changes.

How convenient is that!

Creating the Todo Class
Because Angular CLI generates TypeScript files, we can use a class to represent Todo items.

So let’s use Angular CLI to generate a Todo class for us:

$ ng generate class Todo --spec
This will create the following:

src/app/todo.spec.ts
src/app/todo.ts
Let’s open up src/app/todo.ts:

export class Todo {
}
Next, add the logic we need:

export class Todo {
  id: number;
  title: string = '';
  complete: boolean = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
In this Todo class definition, we specify that each Todo instance will have three properties:

id: number, unique ID of the todo item
title: string, title of the todo item
complete: boolean, whether or not the todo item is complete
We also provide constructor logic that lets us specify property values during instantiation so we can easily create new Todo instances like this:

let todo = new Todo({
  title: 'Read SitePoint article',
  complete: false
});
While we’re at it, let’s add a unit test to make sure our constructor logic works as expected.

When generating the Todo class, we used the --spec option. This told Angular CLI to also generate src/app/todo.spec.ts for us with a basic unit test:

import {Todo} from './todo';

describe('Todo', () => {
  it('should create an instance', () => {
    expect(new Todo()).toBeTruthy();
  });
});
Let’s add an additional unit test to make sure the constructor logic works as expected:

import {Todo} from './todo';

describe('Todo', () => {
  it('should create an instance', () => {
    expect(new Todo()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    let todo = new Todo({
      title: 'hello',
      complete: true
    });
    expect(todo.title).toEqual('hello');
    expect(todo.complete).toEqual(true);
  });
});
To verify whether our code works as expected, we can now run:

$ ng test
This executes the Karma test runner and run all our unit tests. This should output:

[karma]: No captured browser, open http://localhost:9876/
[karma]: Karma v1.2.0 server started at http://localhost:9876/
[launcher]: Launching browser Chrome with unlimited concurrency
[launcher]: Starting browser Chrome
[Chrome 54.0.2840 (Mac OS X 10.12.0)]: Connected on socket /#ALCo3r1JmW2bvt_fAAAA with id 84083656
Chrome 54.0.2840 (Mac OS X 10.12.0): Executed 5 of 5 SUCCESS (0.159 secs / 0.154 secs)
If your unit tests are failing, you can compare your code to the working code on GitHub.

Now that we have a working Todo class to represent an individual todo, let’s create a TodoDataService service to manage all todos.

Creating the TodoDataService Service
The TodoDataService will be responsible for managing our Todo items.

In another part of this series, you’ll learn how to communicate with a REST API, but for now we’ll store all data in memory.

Let’s use Angular CLI again to generate the service for us:

$ ng generate service TodoData
This outputs:

installing service
  create src/app/todo-data.service.spec.ts
  create src/app/todo-data.service.ts
  WARNING Service is generated but not provided, it must be provided to be used
When generating a service, Angular CLI also generates a unit test by default so we don’t have to explicitly use the --spec option.

Angular CLI has generated the following code for our TodoDataService in src/app/todo-data.service.ts:

import { Injectable } from '@angular/core';

@Injectable()
export class TodoDataService {

  constructor() { }

}
and a corresponding unit test in src/app/todo-data.service.spec.ts:

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TodoDataService } from './todo-data.service';

describe('TodoDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoDataService]
    });
  });

  it('should ...', inject([TodoDataService], (service: TodoDataService) => {
    expect(service).toBeTruthy();
  }));
});
Let’s open up src/app/todo-data.service.ts and add our todo management logic to the TodoDataService:

import {Injectable} from '@angular/core';
import {Todo} from './todo';

@Injectable()
export class TodoDataService {

  // Placeholder for last id so we can simulate
  // automatic incrementing of ids
  lastId: number = 0;

  // Placeholder for todos
  todos: Todo[] = [];

  constructor() {
  }

  // Simulate POST /todos
  addTodo(todo: Todo): TodoDataService {
    if (!todo.id) {
      todo.id = ++this.lastId;
    }
    this.todos.push(todo);
    return this;
  }

  // Simulate DELETE /todos/:id
  deleteTodoById(id: number): TodoDataService {
    this.todos = this.todos
      .filter(todo => todo.id !== id);
    return this;
  }

  // Simulate PUT /todos/:id
  updateTodoById(id: number, values: Object = {}): Todo {
    let todo = this.getTodoById(id);
    if (!todo) {
      return null;
    }
    Object.assign(todo, values);
    return todo;
  }

  // Simulate GET /todos
  getAllTodos(): Todo[] {
    return this.todos;
  }

  // Simulate GET /todos/:id
  getTodoById(id: number): Todo {
    return this.todos
      .filter(todo => todo.id === id)
      .pop();
  }

  // Toggle todo complete
  toggleTodoComplete(todo: Todo){
    let updatedTodo = this.updateTodoById(todo.id, {
      complete: !todo.complete
    });
    return updatedTodo;
  }

}
The actual implementation details of the methods are not essential for the purpose of this article. The main takeaway is that we centralize the business logic in a service.

To make sure the business logic in our TodoDataService service works as expected, we also add some additional unit tests in src/app/todo-data.service.spec.ts:

import {TestBed, async, inject} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoDataService} from './todo-data.service';

describe('TodoDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoDataService]
    });
  });

  it('should ...', inject([TodoDataService], (service: TodoDataService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getAllTodos()', () => {

    it('should return an empty array by default', inject([TodoDataService], (service: TodoDataService) => {
      expect(service.getAllTodos()).toEqual([]);
    }));

    it('should return all todos', inject([TodoDataService], (service: TodoDataService) => {
      let todo1 = new Todo({title: 'Hello 1', complete: false});
      let todo2 = new Todo({title: 'Hello 2', complete: true});
      service.addTodo(todo1);
      service.addTodo(todo2);
      expect(service.getAllTodos()).toEqual([todo1, todo2]);
    }));

  });

  describe('#save(todo)', () => {

    it('should automatically assign an incrementing id', inject([TodoDataService], (service: TodoDataService) => {
      let todo1 = new Todo({title: 'Hello 1', complete: false});
      let todo2 = new Todo({title: 'Hello 2', complete: true});
      service.addTodo(todo1);
      service.addTodo(todo2);
      expect(service.getTodoById(1)).toEqual(todo1);
      expect(service.getTodoById(2)).toEqual(todo2);
    }));

  });

  describe('#deleteTodoById(id)', () => {

    it('should remove todo with the corresponding id', inject([TodoDataService], (service: TodoDataService) => {
      let todo1 = new Todo({title: 'Hello 1', complete: false});
      let todo2 = new Todo({title: 'Hello 2', complete: true});
      service.addTodo(todo1);
      service.addTodo(todo2);
      expect(service.getAllTodos()).toEqual([todo1, todo2]);
      service.deleteTodoById(1);
      expect(service.getAllTodos()).toEqual([todo2]);
      service.deleteTodoById(2);
      expect(service.getAllTodos()).toEqual([]);
    }));

    it('should not removing anything if todo with corresponding id is not found', inject([TodoDataService], (service: TodoDataService) => {
      let todo1 = new Todo({title: 'Hello 1', complete: false});
      let todo2 = new Todo({title: 'Hello 2', complete: true});
      service.addTodo(todo1);
      service.addTodo(todo2);
      expect(service.getAllTodos()).toEqual([todo1, todo2]);
      service.deleteTodoById(3);
      expect(service.getAllTodos()).toEqual([todo1, todo2]);
    }));

  });

  describe('#updateTodoById(id, values)', () => {

    it('should return todo with the corresponding id and updated data', inject([TodoDataService], (service: TodoDataService) => {
      let todo = new Todo({title: 'Hello 1', complete: false});
      service.addTodo(todo);
      let updatedTodo = service.updateTodoById(1, {
        title: 'new title'
      });
      expect(updatedTodo.title).toEqual('new title');
    }));

    it('should return null if todo is not found', inject([TodoDataService], (service: TodoDataService) => {
      let todo = new Todo({title: 'Hello 1', complete: false});
      service.addTodo(todo);
      let updatedTodo = service.updateTodoById(2, {
        title: 'new title'
      });
      expect(updatedTodo).toEqual(null);
    }));

  });

  describe('#toggleTodoComplete(todo)', () => {

    it('should return the updated todo with inverse complete status', inject([TodoDataService], (service: TodoDataService) => {
      let todo = new Todo({title: 'Hello 1', complete: false});
      service.addTodo(todo);
      let updatedTodo = service.toggleTodoComplete(todo);
      expect(updatedTodo.complete).toEqual(true);
      service.toggleTodoComplete(todo);
      expect(updatedTodo.complete).toEqual(false);
    }));

  });

});
Karma comes pre-configured with Jasmine. You can read the Jasmine documentation to learn more about the Jasmine syntax.

Let’s zoom in on some of the parts in the unit tests above:

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [TodoDataService]
  });
});
First of all, what is TestBed?

TestBed is a utility provided by @angular/core/testing to configure and create an Angular testing module in which we want to run our unit tests.

We use the TestBed.configureTestingModule() method to configure and create a new Angular testing module. We can configure the testing module to our liking by passing in a configuration object. This configuration object can have most of the properties of a normal Angular module.

In this case we use the providers property to configure the testing module to use the real TodoDataService when running the tests.

In part 3 of this series we will let the TodoDataService communicate with a real REST API and we will see how we can inject a mock service in our test module to prevent the tests from communicating with the real API.

Next, we use the inject function provided by @angular/core/testing to inject the correct service from the TestBed injector in our test function:

it('should return all todos', inject([TodoDataService], (service: TodoDataService) => {
  let todo1 = new Todo({title: 'Hello 1', complete: false});
  let todo2 = new Todo({title: 'Hello 2', complete: true});
  service.addTodo(todo1);
  service.addTodo(todo2);
  expect(service.getAllTodos()).toEqual([todo1, todo2]);
}));
The first argument to the inject function is an array of Angular dependency injection tokens. The second argument is the test function whose parameters are the dependencies that correspond to the dependency injection tokens from the array.

Here we tell the TestBed injector to inject the TodoDataService by specifying it in the array in the first argument. As a result we can access the TodoDataService as service in our test function because service is the name of the first parameter of our test function.

If you want to learn more about testing in Angular, be sure to check out the official Angular testing guide.

To verify whether our service works as expected, we run our unit tests again:

$ ng test
[karma]: No captured browser, open http://localhost:9876/
[karma]: Karma v1.2.0 server started at http://localhost:9876/
[launcher]: Launching browser Chrome with unlimited concurrency
[launcher]: Starting browser Chrome
[Chrome 54.0.2840 (Mac OS X 10.12.0)]: Connected on socket /#fi6bwZk8IjYr1DZ-AAAA with id 11525081
Chrome 54.0.2840 (Mac OS X 10.12.0): Executed 14 of 14 SUCCESS (0.273 secs / 0.264 secs)
Perfect— all unit tests ran successfully!

Now that we have a working TodoDataService service, it’s time to implement the actual user interface.

In Angular 2, parts of the user interface are represented by components.

Editing the AppComponent Component
When we initialized the Todo application, Angular CLI automatically generated a main AppComponent component for us:

src/app/app.component.css
src/app/app.component.html
src/app/app.component.spec.ts
src/app/app.component.ts
The template and styles can also be specified inline, inside the script file. Angular CLI creates separate files by default, so that’s what we’ll use in this article.

Let’s open up src/app/app.component.html:

<h1>
  {{title}}
</h1>
Replace its content with:

<section class="todoapp">
  <header class="header">
    <h1>Todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" autofocus="" [(ngModel)]="newTodo.title" (keyup.enter)="addTodo()">
  </header>
  <section class="main" *ngIf="todos.length > 0">
    <ul class="todo-list">
      <li *ngFor="let todo of todos" [class.completed]="todo.complete">
        <div class="view">
          <input class="toggle" type="checkbox" (click)="toggleTodoComplete(todo)" [checked]="todo.complete">
          <label>{{todo.title}}</label>
          <button class="destroy" (click)="removeTodo(todo)"></button>
        </div>
      </li>
    </ul>
  </section>
  <footer class="footer" *ngIf="todos.length > 0">
    <span class="todo-count"><strong>{{todos.length}}</strong> {{todos.length == 1 ? 'item' : 'items'}} left</span>
  </footer>
</section>
Here’s a super-short primer on Angular’s template syntax in case you haven’t seen it yet:

[property]="expression": set property of an element to the value of expression
(event)="statement": execute statement when event occurred
[(property)]="expression": create two-way binding with expression
[class.special]="expression": add special CSS class to element when the value of expression is truthy
[style.color]="expression": set color CSS property to the value of expression
If you’re not familiar with Angular’s template syntax, you should definitely read the official template syntax documentation.

Let’s see what that means for our view. At the top there is an input to create a new todo:

<input class="new-todo" placeholder="What needs to be done?" autofocus="" [(ngModel)]="newTodo.title" (keyup.enter)="addTodo()">
[(ngModel)]="newTodo.title": adds a two-way binding between the input value and newTodo.title
(keyup.enter)="addTodo()": tells Angular to execute addTodo() when the enter key was pressed while typing in the input element
Don’t worry about where newTodo or addTodo() come from yet; we’ll get there shortly. Just try to understand the semantics of the view for now.

Next there’s a section to display existing todos:

<section class="main" *ngIf="todos.length > 0">
*ngIf="todos.length > 0": only show the section element and all its children when there is at least one todo
Within that section, we ask Angular to generate an li element for each todo:

<li *ngFor="let todo of todos" [class.completed]="todo.complete">
*ngFor="let todo of todos": loop over all todos and assign current todo to a variable called todo for each iteration
[class.completed]="todo.complete": apply CSS class completed to li element when todo.complete is truthy
Finally, we display todo details for each individual todo:

<div class="view">
  <input class="toggle" type="checkbox" (click)="toggleTodoComplete(todo)" [checked]="todo.complete">
  <label>{{todo.title}}</label>
  <button class="destroy" (click)="removeTodo(todo)"></button>
</div>
(click)="toggleTodoComplete(todo)": execute toggleTodoComplete(todo) when the checkbox is clicked
[checked]="todo.complete": assign the value of todo.complete to the property checked of the element
(click)="removeTodo(todo)": execute removeTodo(todo) when the destroy button is clicked
OK, let’s breathe. That was quite a bit of syntax we went through.

If you want to learn every detail about Angular’s template syntax, make sure you read the official template documentation.

You may wonder how expressions like addTodo() and newTodo.title can be evaluated. We haven’t defined them yet, so how does Angular know what we mean?

That’s exactly where the expression context comes in. An expression context is a context in which expressions are evaluated. The expression context of a component is the component instance. And the component instance is an instance of the component class.

The component class of our AppComponent is defined in src/app/app.component.ts.

Angular CLI already created some boilerplate code for us:

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
So we can immediately start adding our custom logic.

We’ll need the TodoDataService service in our AppComponent logic, so let’s start by injecting the service in our component.

First we import TodoDataService and specify it in the providers array of the Component decorator:

// Import class so we can register it as dependency injection token
import {TodoDataService} from './todo-data.service';

@Component({
  // ...
  providers: [TodoDataService]
})
export class AppComponent {
  // ...
}
The AppComponent’s dependency injector will now recognize the TodoDataService class as a dependency injection token and return a single instance of TodoDataService when we ask for it.

Angular’s dependency injection system accepts a variety of dependency injection recipes. The syntax above is a shorthand notation for the Class provider recipe that provides dependencies using the singleton pattern. Check out Angular’s dependency injection documentation for more details.

Now that the components dependency injector knows what it needs to provide, we ask it to inject the TodoDataService instance in our component by specifying the dependency in the AppComponent constructor:

// Import class so we can use it as dependency injection token in the constructor
import {TodoDataService} from './todo-data.service';

@Component({
  // ...
})
export class AppComponent {

  // Ask Angular DI system to inject the dependency
  // associated with the dependency injection token `TodoDataService`
  // and assign it to a property called `todoDataService`
  constructor(private todoDataService: TodoDataService) {
  }

  // Service is now available as this.todoDataService
  toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo);
  }
}
The use of public or private on arguments in the constructor is a shorthand notation that allows us to automatically create properties with that name, so:

class AppComponent {

  constructor(private todoDataService: TodoDataService) {
  }
}
This is a shorthand notation for:

class AppComponent {

  private todoDataService: TodoDataService;

  constructor(todoDataService: TodoDataService) {
    this.todoDataService = todoDataService;
  }
}
We can now implement all view logic by adding properties and methods to our AppComponent class:

import {Component} from '@angular/core';
import {Todo} from './todo';
import {TodoDataService} from './todo-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoDataService]
})
export class AppComponent {

  newTodo: Todo = new Todo();

  constructor(private todoDataService: TodoDataService) {
  }

  addTodo() {
    this.todoDataService.addTodo(this.newTodo);
    this.newTodo = new Todo();
  }

  toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo);
  }

  removeTodo(todo) {
    this.todoDataService.deleteTodoById(todo.id);
  }

  get todos() {
    return this.todoDataService.getAllTodos();
  }

}





