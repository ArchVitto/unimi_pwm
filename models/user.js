import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';
import { hashPassword } from './../middlewares/auth.js'; 

const costumerSchema = mongoose.Schema({
    tipo_utente: {
        type: String,
        required: true,
        default: 'cliente',
        enum: ['cliente'] 
    },
    nome: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    cognome: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email non valida']
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    indirizzo_consegna: {
        type: String,
        trim: true,
        default: ''
    },
    telefono: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                // Validazione base del telefono (modifica secondo necessità)
                return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
            },
            message: props => `${props.value} non è un numero di telefono valido!`
        },
        default: ''
    },
    data_registrazione: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password; // Rimuove la password quando il documento è convertito in JSON
            delete ret.__v;
            return ret;
        }
    }
});

// Aggiungi un metodo per verificare la password
costumerSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Metodo per generare JWT
costumerSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            tipo_utente: this.tipo_utente,
            email: this.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

const restaurantSchema = mongoose.Schema({
    tipo_utente: {
        type: String,
        required: true,
        default: 'ristoratore',
        enum: ['ristoratore']
    },
    nome: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    cognome: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email non valida']
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    nome_ristorante: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    indirizzo_ristorante: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    numero_telefono: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[0-9]{8,15}$/, 'Numero di telefono non valido']
    },
    immagine: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/, 'URL immagine non valido']
    },
    descrizione: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    partita_iva: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{11}$/.test(v);
            },
            message: props => `${props.value} non è una partita IVA valida!`
        }
    },
    data_registrazione: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});
// Metodo per verificare la password (usato nel login)
restaurantSchema.methods.verifyPassword = async function(password) {
    const result = await bcrypt.compare(password, this.password);
    
    return result;
};

// Metodo per generare il token JWT
restaurantSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            tipo_utente: this.tipo_utente,
            nome_ristorante: this.nome_ristorante // Aggiungi dati utili per il frontend
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};



costumerSchema.pre('save', hashPassword);
restaurantSchema.pre('save', hashPassword);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export const Costumer = mongoose.model('Costumer', costumerSchema);