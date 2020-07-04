export default function catchErrors(error) {

    let errorMsg;

    if (error.response) {
        //status code is not 2XX
        if (error.response.data.name) {
           errorMsg =  "Error connecting to DB"
        }
        else {
            errorMsg = error.response.data
        }
        
    }
    else if (error.request) {
        errorMsg = error.request
    }
    else {
        errorMsg =  error.message
    }

    return errorMsg;

}