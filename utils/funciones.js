export function validarToken(req, res, next) {
    const bearerHeader = req.headers('authorization');
    console.log(bearerHeader)
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }
}