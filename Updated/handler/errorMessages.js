const throwError = (res, statusCode = 500) => {
    res.status(statusCode);

    switch (statusCode) {
        
        case 400:
            throw new Error("email already Existed.")    
         case 404:
            throw new Error("Not Found.");
         case 403:
            throw new Error("Forbidden")
        case 401:
                throw new Error("All fields are Required");            
        case 500:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrace: err.stack
            });
            break;
            default:
            res.json(err.message)
            console.error(err.message);
            break;
    }

}

module.exports = throwError;