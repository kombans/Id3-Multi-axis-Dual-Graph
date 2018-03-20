export class Price {
    date: Date;
    predicted: number;
    close: number;
    profit: number;
    action: string;

    constructor(date: Date, predicted: number, close: number, profit: number, action: string) {
        this.profit = profit;
        this.date = date;
        this.predicted = predicted;
        this.close = close;
        this.action = action;
    }

}