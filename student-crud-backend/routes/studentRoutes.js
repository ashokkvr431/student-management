const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add student
router.post('/', (req, res) => {
    const { name, email, course } = req.body;
    db.query('INSERT INTO students (name, email, course) VALUES (?, ?, ?)', [name, email, course], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Student added successfully' });
    });
});

// Update student
router.put('/:id', (req, res) => {
    const { name, email, course } = req.body;
    db.query('UPDATE students SET name=?, email=?, course=? WHERE id=?', [name, email, course, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Student updated successfully' });
    });
});

// Delete student
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM students WHERE id=?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Student deleted successfully' });
    });
});

module.exports = router;
