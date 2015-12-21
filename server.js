var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?complete=true&q=work
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	} else {
		filteredTodos = todos;
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) { return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;});
	} 

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matched = _.findWhere(todos, {id: todoId});
	// var matched;

	// todos.forEach(function (todo) {
	// 	if (todoId === todo.id) {
	// 		matched = todo;
	// 	}
	// });

	if (matched) { 
		res.json(matched);
	} else {
		res.status(404).send();
	}
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body,'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)  {
		return res.status(400).send();
	}

	body.id = todoNextId++;

	body.description = body.description.trim();
	todos.push(body)
	
	console.log('description: ' + body.description);
	res.json(body);
});

// DELETE /todos/id 
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matched = _.findWhere(todos, {id: todoId});

	if (matched) { 
		todos = _.without(todos, matched);
		res.json(matched);
	} else {
		res.status(404).json({"error" : "ID not found"});
	}
});

// PUT /todos/id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matched = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body,'description', 'completed');
	var validAttributes = {};

	if (!matched) {
		return res.status(404).send();
	};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matched, validAttributes);
	res.json(matched);

});

app.listen(PORT, function(){
	console.log("Express listening on port " + PORT + "!");
});