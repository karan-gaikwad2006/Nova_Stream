class ApiError extends Error {
    constructor(message = "Something went wrong", statusCode, error = [] , stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.stack = stack;
        this.data = null;
        this.message = message;
        this.success = false;

        if (stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

// ye ek file banai hai ki api error aengi agr toh isi tarike se handle krenge