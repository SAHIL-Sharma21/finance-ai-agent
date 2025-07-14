/**
 * AI agen tool
 * -> Get TOTAL expense
 */

import { expenseDB } from "../agent";

type TotalExpense = {
    from: string | any;
    to: string | any;
}

export function getTotalExpense({from, to}: TotalExpense){
    console.log("Calling total expense tool")

    // we have to call Database
    const expense = expenseDB.reduce((acc: number, item: any) => {
        return acc + item.amount;
    }, 0)

    return `${expense} INR`;
}