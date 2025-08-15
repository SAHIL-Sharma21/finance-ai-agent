/**
 * Add income tool which take 2 params
 * @param name, amount,
 *
 */

import {addIncomeDB} from '../database';

type IncomeDB = {
    name: string;
    amount: string | number;
}

export function addIncome({name, amount}: IncomeDB){
    return addIncomeDB({
        name,
        amount: typeof amount === "string" ? parseFloat(amount) : amount
    });
}