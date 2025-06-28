import mongoose from "mongoose";
import { Costumer, Restaurant } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerCostumer = async (req, res) => {
    
    const {
        nome,
        cognome,
        username,
        email,
        password,
        conferma_password,
        indirizzo_consegna,
        telefono
    } = req.body;

    // Validazione dei campi obbligatori
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Nome non valido' 
        });
    }

    if (!cognome || typeof cognome !== 'string' || cognome.trim().length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Cognome non valido' 
        });
    }

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
        return res.status(400).json({ 
            success: false,
            message: 'Username deve contenere almeno 3 caratteri' 
        });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ 
            success: false,
            message: 'Email non valida' 
        });
    }

    if (!password || typeof password !== 'string' || password.length < 5) {
        return res.status(400).json({ 
            success: false,
            message: 'La password deve contenere almeno 5 caratteri' 
        });
    }

    if (password !== conferma_password) {
        return res.status(400).json({ 
            success: false,
            message: 'Le password non coincidono' 
        });
    }

    try {
        // Verifica se l'username o l'email esistono già
        const existingCostumer = await Costumer.findOne({ 
            $or: [
                { username: username.trim() },
                { email: email.trim() }
            ]
        });

        if (existingCostumer) {
            const field = existingCostumer.username === username.trim() ? 'username' : 'email';
            return res.status(409).json({ 
                success: false,
                message: `${field} già in uso` 
            });
        }



        // Creazione del nuovo utente
        const newCostumer = new Costumer({
            tipo_utente: 'cliente',
            nome: nome.trim(),
            cognome: cognome.trim(),
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            indirizzo_consegna: indirizzo_consegna?.trim() || '',
            telefono: telefono?.trim() || '',
            data_registrazione: new Date()
        });

        // Salva l'utente
        await newCostumer.save();
        
        // Genera il token JWT usando la variabile d'ambiente

        const token = jwt.sign(
            { 
                id: newCostumer._id, 
                role: 'costumer', 
                username: newCostumer.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const costumerData = newCostumer.toObject();
        delete costumerData.password;

        // Imposta il cookie (come fatto per il ristoratore)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.MAX_AGE) || 3600000 // fallback: 1 ora
        });

        // Risposta JSON standardizzata
        res.status(201).json({
            success: true,
            message: 'Registrazione completata con successo',
            redirect: '/costumer/dashboard',
            token,
            costumer: costumerData
        });

    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ 
            success: false,
            message: 'Si è verificato un errore durante la registrazione'
        });
    }
};

export const registerRestaurant = async (req, res) => {

    const {
        nome,
        cognome,
        email,
        password,
        conferma_password,
        nome_ristorante,
        indirizzo_ristorante,
        partita_iva,
        numero_telefono,
        immagine,
        descrizione
    } = req.body;

    // Validazione campi base
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Nome non valido' });
    }

    if (!cognome || typeof cognome !== 'string' || cognome.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Cognome non valido' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Email non valida' });
    }

    if (!password || typeof password !== 'string' || password.length < 5) {
        return res.status(400).json({ success: false, message: 'La password deve contenere almeno 5 caratteri' });
    }

    if (password !== conferma_password) {
        return res.status(400).json({ success: false, message: 'Le password non coincidono' });
    }

    // Validazione campi specifici del ristoratore
    if (!nome_ristorante || typeof nome_ristorante !== 'string' || nome_ristorante.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Nome ristorante non valido' });
    }

    if (!indirizzo_ristorante || typeof indirizzo_ristorante !== 'string' || indirizzo_ristorante.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Indirizzo ristorante non valido' });
    }

    if (!partita_iva || typeof partita_iva !== 'string' || !/^[0-9]{11}$/.test(partita_iva.trim())) {
        return res.status(400).json({ success: false, message: 'Partita IVA non valida (devono essere 11 cifre)' });
    }

    if (!numero_telefono || typeof numero_telefono !== 'string' || !/^\+?[0-9]{8,15}$/.test(numero_telefono.trim())) {
        return res.status(400).json({ success: false, message: 'Numero di telefono non valido' });
    }

    if (immagine && typeof immagine === 'string' && immagine.trim().length > 0) {
        const imgRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
        if (!imgRegex.test(immagine.trim())) {
            return res.status(400).json({ success: false, message: 'URL immagine non valido' });
        }
    }

    if (descrizione && typeof descrizione === 'string' && descrizione.length > 1000) {
        return res.status(400).json({ success: false, message: 'Descrizione troppo lunga (max 1000 caratteri)' });
    }

    try {
        const existingRestaurant = await Restaurant.findOne({
            $or: [
                { email: email.trim() },
                { partita_iva: partita_iva.trim() }
            ]
        });

        if (existingRestaurant) {
            const field = existingRestaurant.email === email.trim() ? 'email' : 'partita IVA';
            return res.status(409).json({ success: false, message: `${field} già in uso` });
        }

        const newRestaurant = new Restaurant({
            tipo_utente: 'ristoratore',
            nome: nome.trim(),
            cognome: cognome.trim(),
            email: email.trim(),
            password: password.trim(),
            nome_ristorante: nome_ristorante.trim(),
            indirizzo_ristorante: indirizzo_ristorante.trim(),
            partita_iva: partita_iva.trim(),
            numero_telefono: numero_telefono.trim(),
            immagine: immagine?.trim(),
            descrizione: descrizione?.trim(),
            data_registrazione: new Date()
        });

        await newRestaurant.save();

        const token = jwt.sign(
            {
                id: newRestaurant._id,
                role: 'restaurant',
                partita_iva: newRestaurant.partita_iva
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const restaurantData = newRestaurant.toObject();
        delete restaurantData.password;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.MAX_AGE) || 3600000
        });

        res.status(201).json({
            success: true,
            message: 'Registrazione completata con successo',
            redirect: '/restaurant/dashboard',
            token,
            restaurant: restaurantData
        });

    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ 
            success: false,
            message: 'Si è verificato un errore durante la registrazione' 
        });
    }
};


export const loginRestaurant = async (req, res) => {
    const { password, partita_iva } = req.body;
    console.log("Dati ricevuti:", { partita_iva, password });

    if (!partita_iva || !password) {
        return res.status(400).json({
            success: false,
            message: "p.iva e password sono obbligatorie."
        });
    }

    try {
        const restaurant = await Restaurant.findOne({ partita_iva }).select('+password');
        console.log("Restaurant trovato:", restaurant);

        if (!restaurant) {
            return res.status(401).json({ 
                success: false,
                message: "Credenziali non valide."
            });
        }

        const isPasswordValid = await restaurant.verifyPassword(password);
        console.log("Password valida?", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide."
            });
        }

        const token = jwt.sign(
            { id: restaurant._id, role: 'restaurant',partita_iva: partita_iva },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const restaurantData = restaurant.toObject();
        delete restaurantData.password;


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: process.env.MAX_AGE // 1 ora in ms
        });

        res.status(200).json({
            success: true,
            token,
            redirect: '/restaurant/dashboard',
            restaurant: restaurantData
        });

    } catch (error) {
        console.error("Errore durante il login del ristoratore:", error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server."
        });
    }
};


export const loginCostumer = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "username e password sono obbligatorie."
        });
    }

    try {
        const loginCostumer = await Costumer.findOne({ username }).select('+password');
        if (!loginCostumer) {
            return res.status(401).json({ 
                success: false,
                message: "Credenziali non valide."
            });
        }

        const isPasswordValid = await loginCostumer.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Credenziali non valide."
            });
        }


        // Genera il token JWT usando la variabile d'ambiente
        const token = jwt.sign(
            { 
                id: loginCostumer._id, 
                role: 'costumer', 
                username: loginCostumer.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const costumerData = loginCostumer.toObject();
        delete costumerData.password;

        // Imposta il cookie (come fatto per il ristoratore)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.MAX_AGE) || 3600000 // fallback: 1 ora
        });

        res.status(200).json({
            success: true,
            token,
            redirect: '/costumer/dashboard',
            costumer: costumerData
        });

    } catch (error) {
        console.error("Errore durante il login:", error);
        res.status(500).json({
            success: false,
            message: "Errore interno del server."
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/', 
    });

    res.status(200).json({
        success: true,
        message: 'Logout effettuato con successo',
        redirect: '/auth/login'
    });
};

//Invio pagina login.html
export const loginPage = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/login.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const loginPageCostumer = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/login_costumer.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const loginPageRestaurant = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/login_restaurant.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

//Invio pagina register.html
export const registerPage = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/register.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const registerPageCostumer = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/register_costumer.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const registerPageRestaurant = (req, res) => {
    try {
        // Invia il file HTML direttamente
        res.sendFile('html/login_register/register_restaurant.html', { root: './public' });
    } catch (error) {
        console.error('Error serving login page:', error);
        res.status(500).send('Internal Server Error');
    }
}
