/**
 * Add income tool which take 2 params
 * @param name, amount,
 *
 */

import { incomeDB } from "../agent";

type IncomeDB = {
    name: string;
    amount: string | number;
}

export function addIncome({name, amount}: IncomeDB){
    incomeDB.push({name, amount: Number(amount)});
    return 'Added income to the income DB.'
}