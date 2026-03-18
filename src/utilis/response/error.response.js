
export const asyncHandler = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch(error => {
            error.status = 500
            return next(error)
        })
    }
}

export const globalErrorHandeling = (error, req, res, next) => {
    if (process.env.MODE == 'dev') {
        return res.status(error.cause || 500).json({ message: error.message, stack: error.stack, error })
    }
    return res.status(error.cause || 500).json({ message: error.message })

}