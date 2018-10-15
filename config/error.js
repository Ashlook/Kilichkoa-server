/*
Fichier contenant les constantes pour les message d'erreur
*/

module.exports.ErrorHandler = () => {
    return new ErrorHandler();
}

class ErrorHandler {
    constructor() {
        this.DRINK_NOT_FOUND = 1000;
        this.USER_NOT_FOUND = 1001;
        this.USER_ALREADY_EXISTS = 1002;
        this.PASSWORD_DIFFERS = 1003;
        this.USER_DIFFERS = 1004;
        this.WRONG_PASSWORD = 1005;
        this.PASSWORD_TOO_SHORT = 1006;
        this.NOT_ADMIN = 1007;
        this.NOT_ACTIVE = 1008;
    }



    /**
     * Gestion des erreur
     */
    handleError(err) {
        const msg = {
            success: false
        }
        switch (err) {
            case this.USER_NOT_FOUND:
                msg.message = 'Aucun utilisateur trouvé';
                break;

            case this.USER_ALREADY_EXISTS:
                msg.message = 'L\'utilisateur existe déjà';
                break;

            case this.PASSWORD_DIFFERS:
                msg.message = 'La vérification n\'est pas égale au mot de passe';
                break;

            case this.USER_DIFFERS:
                msg.message = 'Utilisateur différent de celui authentifié';
                break;

            case this.WRONG_PASSWORD:
                msg.message = "Mauvais mot de passe";
                break;

            case this.DRINK_NOT_FOUND:
                msg.message = 'Aucune tournée trouvée';
                break;

            case this.PASSWORD_TOO_SHORT:
                msg.message = 'Le mot de passe doit faire au moins 8 caractères';
                break;

            case this.NOT_ADMIN:
                msg.message = 'Vous devez être admin pour faire cette action';
                break;

            case this.NOT_ACTIVE:
                msg.message = 'Vous devez être actif pour faire cette action';
                break;

            default:
                msg.error = err;
                console.log(err);
                msg.message = 'Monngoose error';
                break;
        }
        console.log('Ctrl Error :', msg.message);
        return msg;
    }
}