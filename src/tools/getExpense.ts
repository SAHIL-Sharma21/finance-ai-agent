/**
 * AI agen tool
 * -> Get TOTAL expense
 */

import {getAllExpenseDB} from '../database';

type TotalExpense = {
    from?: string | any;
    to?: string | any;
}

export async function getTotalExpense({from, to}: TotalExpense){
    return await getAllExpenseDB();
}