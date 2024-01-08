const catchHander = (res, error)=>{
    console.error(error.message);
    res.json(`We are Facing an error: ${error}`)
}

module.exports = catchHander;