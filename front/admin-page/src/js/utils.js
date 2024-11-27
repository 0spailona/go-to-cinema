export const isValid = (value) => {
    if(isNaN(value)){
        console.log("Error. Value is invalid");
        // TODO show error?
        return false
    }
    return true;
};

