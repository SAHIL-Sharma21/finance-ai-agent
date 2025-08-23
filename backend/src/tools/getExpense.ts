/**
 * AI agen tool
 * -> Get TOTAL expense
 */

import {getAllExpenseDB} from '../database';

type TotalExpense = {
    from?: string | any;
    to?: string | any;
}
//TODO:have to refactor this function or delete some code
export async function getTotalExpense({from, to}: TotalExpense){
    const allExpense = await getAllExpenseDB();

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const filteredData = allExpense.filter((expense) => {
        const d = new Date(expense.date);
        return d >= fromDate && d <= toDate;
    });

    const total = filteredData.reduce((sum, ex) => sum + Number(ex.amount), 0);
    console.log("result--->", total);
    return `Total expense from ${from} to ${to} is ₹${total}`;
}