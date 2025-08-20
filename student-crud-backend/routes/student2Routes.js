// routes/student2Routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students_2
router.get('/', (req, res) => {
    db.query('SELECT * FROM students_2', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Add student to students_2
router.post('/', (req, res) => {
    const { name, email, phone, college, course } = req.body;
    db.query(
        'INSERT INTO students_2 (name, email, phone, college, course) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, college, course],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Student added successfully to students_2' });
        }
    );
});

// Update student in students_2
router.put('/:id', (req, res) => {
    const { name, email, phone, college, course } = req.body;
    db.query(
        'UPDATE students_2 SET name=?, email=?, phone=?, college=?, course=? WHERE id=?',
        [name, email, phone, college, course, req.params.id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Student updated successfully in students_2' });
        }
    );
});

// Delete student from students_2
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM students_2 WHERE id=?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Student deleted successfully from students_2' });
    });
});

module.exports = router;
