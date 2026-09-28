const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost', // Karena dijalankan di host
    user: 'root',
    password: 'password_saya',
    database: 'nama_database_anda',
    port: 3307 // Port di host
});

db.connect(err => {
    if (err) {
        console.error('Gagal terhubung ke MySQL:', err);
        return;
    }
    console.log('Terhubung ke MySQL');
});

app.post('/api/news', (req, res) => {
    const { title, description, date } = req.body;
    if (!title || !description || !date) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }
    const query = 'INSERT INTO news (title, description, date) VALUES (?, ?, ?)';
    db.query(query, [title, description, date], (err, result) => {
        if (err) {
            console.error('Gagal menyimpan berita:', err);
            return res.status(500).json({ message: 'Gagal menyimpan berita' });
        }
        res.json({ message: 'Berita berhasil disimpan', id: result.insertId });
    });
});

app.get('/api/news', (req, res) => {
    const query = 'SELECT * FROM news';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil berita:', err);
            return res.status(500).json({ message: 'Gagal mengambil berita' });
        }
        res.json(results);
    });
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));