const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');

const app = express ();
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan6pbo'
});

connection.connect((err) => {
    if(err) {
        console.error("Terjadi kesalahan dalam Koneski ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view engine', 'ejs');

//ini adalah routing  (Create,  Read, Update, Delete)

// Read
app.get('/', (req, res) => {
    const query = 'SELECT * FROM member';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { member: results, message: req.query.message });
    });
});

// Create / input / insert
app.post('/add', (req, res) => {
    const { nama, Posisi, LuckyNumber } = req.body;
    const query = 'INSERT INTO member (nama, Posisi, LuckyNumber) VALUES (?,?,?)';
    connection.query(query, [nama, Posisi, LuckyNumber], (err, result) => {
        if (err) {
            res.redirect('/?message=Gagal menambahkan data');
        } else {
            res.redirect('/?message=Data berhasil ditambahkan!');
        }
    });
});

// Update
app.post('/update/:id', (req, res) => {
    const { nama, Posisi, LuckyNumber } = req.body;
    const query = 'UPDATE member SET nama = ?, Posisi = ?, LuckyNumber = ? WHERE id = ?';
    connection.query(query, [nama, Posisi, LuckyNumber, req.params.id], (err, result) => {
        if (err) {
            res.redirect('/?message=Gagal memperbarui data');
        } else {
            res.redirect('/?message=Data berhasil diperbarui!');
        }
    });
});

// Delete
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM member WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            res.redirect('/?message=Gagal menghapus data');
        } else {
            res.redirect('/?message=Data berhasil dihapus!');
        }
    });
});

// Mendapatkan data anggota untuk diedit
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM member WHERE id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('edit', { member: results[0] });
        } else {
            res.redirect('/?message=Data tidak ditemukan');
        }
    });
});

// Mendapatkan data anggota untuk diedit
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM member WHERE id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('edit', { member: results[0] });
        } else {
            res.redirect('/?message=Data tidak ditemukan');
        }
    });
});


app.listen(3000,() => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000")
})