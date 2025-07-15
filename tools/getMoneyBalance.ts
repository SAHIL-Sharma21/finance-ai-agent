/**
 * GetMoney Balance of the person who spent and have total
 */

import { expenseDB, incomeDB } from "../agent";

export function getMoneyBalance(){
    const totalExpense = expenseDB.reduce((acc: number, item: any) => {
        acc + item.amount
    }, 0)

    const totalIncome = incomeDB.reduce((acc: number, item: any) => (acc + item.amount), 0)

    return `${totalIncome - totalExpense} INR`;
}