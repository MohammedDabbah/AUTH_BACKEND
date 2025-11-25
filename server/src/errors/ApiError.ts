export class ApiError extends Error {
    status: number;


    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    };

    public static badRequest(msg: string): Error {
        return new ApiError(400, msg);
    };

    public static unauthorized(msg: string = "Unauthorized" ): Error {
        return new ApiError(401, msg);
    };

    public static notfound(msg: string = "Not found" ): Error {
        return new ApiError(404, msg);
    };
};