const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia123', // Ganti dengan secret yang lebih aman
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')));
// Sajikan gambar bd.jpg dari root agar src "/bd.jpg" berfungsi
app.use('/bd.jpg', express.static(path.join(__dirname, 'bd.jpg')));

// Middleware untuk proteksi halaman
function cekLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Halaman utama (hanya bisa diakses jika sudah login)
app.get('/', cekLogin, (req, res) => {
    res.render('index', { username: req.session.username });
});

// Halaman login
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Proses login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Ganti dengan username dan password yang diinginkan
    if (username === 'zhev' && password === '090904') {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Nama pengguna atau kata sandi salah!' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login?logout=1');
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});