const { Router } = require('express')
const { getTodos, getTodo, updateTodo, deleteTodo, completed, createTodo } = require('../controllers/todos.controllers')

const router = Router()

router.route('/todos').get(getTodos).post(createTodo)

router.route('/todos/:id').get(getTodo).patch(updateTodo).delete(deleteTodo)

router.get('/todos/completed', completed)

module.exports = router