import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  // leggi il token dal cookie


    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.log(error);
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('Ruolo nel token:', req.user.role); 
        console.log('Ruoli ammessi:', allowedRoles); 
        if (!allowedRoles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
};
/**
 * Middleware per hashare la password prima del salvataggio (Mongoose pre-save hook)
 * @param {mongoose.Document} doc - Il documento (User/Restaurant) che sta per essere salvato
 * @param {Function} next - Funzione per procedere al salvataggio
 */
export const hashPassword = async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err); // Passa l'errore a Mongoose
    }
};

export const validateCardData = (req, res, next) => {
    const { cardNumber, cardHolder, expiry, cvc } = req.body;
  
    // Log dei dati ricevuti
    console.log('🔍 Validazione dati carta...');
    console.log('💳 Numero carta:', cardNumber);
    console.log('👤 Intestatario:', cardHolder);
    console.log('📅 Scadenza:', expiry);
    console.log('🔒 CVC:', cvc);
  
    // Controlli logici base
    const isCardNumberValid = /^[0-9]{16}$/.test(cardNumber);
    const isExpiryFormatValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry); // MM/YY
    const isCVCValid = /^[0-9]{3,4}$/.test(cvc);
    const isHolderValid = typeof cardHolder === 'string' && cardHolder.trim().length > 0;
  
    // Controllo che la carta non sia scaduta
    let isExpiryDateValid = false;
    if (isExpiryFormatValid) {
        const [month, year] = expiry.split('/');
        const expiryDate = new Date(`20${year}`, month - 1); // Mese è 0-based
        const currentDate = new Date();
        // Impostiamo la data al primo del mese successivo per il confronto
        const firstOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        isExpiryDateValid = expiryDate >= firstOfNextMonth;
    }
  
    // Log dei risultati di validazione
    console.log('✅ Numero carta valido?', isCardNumberValid);
    console.log('✅ Formato scadenza valido?', isExpiryFormatValid);
    console.log('✅ Carta non scaduta?', isExpiryDateValid);
    console.log('✅ CVC valido?', isCVCValid);
    console.log('✅ Intestatario valido?', isHolderValid);
  
    if (!isCardNumberValid || !isExpiryFormatValid || !isExpiryDateValid || !isCVCValid || !isHolderValid) {
      console.warn('❌ Validazione fallita.');
      return res.status(400).json({
        success: false,
        message: 'Dati della carta non validi. Controlla e riprova.'
      });
    }
  
    console.log('✅ Validazione superata, si procede all\'ordine.');
    next();
  };
  