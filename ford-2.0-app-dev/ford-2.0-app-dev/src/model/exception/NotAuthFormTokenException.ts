export class NotAuthFormTokenException extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'MyException';
    }
}