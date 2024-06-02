export const errorHandler = (statusCode, msg)=>{
    const error = new Error()
    error.statusCode = statusCode
    error.msg = msg
    return error;
}