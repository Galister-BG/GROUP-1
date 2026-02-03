const fs = require("fs");

const path = require('path');

const todos = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/data.json'), 'utf8')
);   

const saveData = () => {
  fs.writeFileSync(
    path.join(__dirname, '../data/data.json'),
    JSON.stringify(todos, null, 2),
    'utf8'
  );
};   

// POST new - create a new todo
const createTodo = (req, res) => {
	const { task, completed } = req.body;

	try {
		if (!task) return res.status(400).json({ error: "Task field is required" });

		if (typeof task !== "string") {
			return res.status(400).json({ error: "Task must be a string" });
		}

		if (todos.some((t) => t.task === task))
			return res.status(400).json({ error: "Task already exists" });

		const newTodo = {
			id: new Date().toString(),
			task: task,
			completed: completed,
		};

		todos.push(newTodo);

		saveData();

		res.status(201).json({ message:'Todo created successfully', newTodo});
	} catch (error) {
		console.error("Error creating todo");

		res.status(500).json({ message: "Error creating todo" });
	}
};

// PATCH Update- partial update of a todo
const updateTodo = (req, res) => {
	const { id } = req.params;

	try {
		let task = todos.find((t) => t.id === id);

		if (!task) return res.status(404).json({ message: "Todo not found" });

		Object.assign(task, req.body);
		saveData();

		res.status(200).json(task);
	} catch (error) {
		console.error("Error updating");
	}
};

//get all completed todos
const completed = (req, res) => {
	const completed = todos.filter((t) => t.completed === true);
	res.status(200).json(completed);
};

//Get todos
const getTodos = (req, res) => {
	try {
		res.status(200).json(todos);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving todos" });
	}
}; 

// Get a specific todo by id
const getTodo = (req, res) => {
	const { id } = req.params;

	try {
		const todo = todos.find((t) => t.id === id);

    if (!todo) return res.status(404).json({ message: "Todo not found" });   
    
		res.status(200).json({ message: `Todo found successfully`, todo });
	} catch (error) {
		res.status(400).json({ message: "Todo not found" });
	}
};

//Delete specific todo
const deleteTodo = (req, res) => {
	const { id } = req.params;

  try {
    const index= todos.findIndex(t=> t.id===id)

 if (index === -1) return res.status(404).json({ message: "Todo not found" });
    const deletedTodo = todos.splice(index, 1)[0];
    
    saveData();

res.status(200).json({ message: "Todo deleted", todo: deletedTodo });   
	} catch (error) {
		res.status(400).json({ message: "Error deleting todo" });
	}
};

module.exports =  { createTodo, updateTodo, getTodo, getTodos, deleteTodo, completed };
