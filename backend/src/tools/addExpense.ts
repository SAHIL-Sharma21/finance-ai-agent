import {addExpenseDB} from '../database';

/**
 * Add expense tools to add the expense in the database;
 */
type AddAmount = {
    name: string;
    amount: string | number;
}

export function addExpense({ name,amount}: AddAmount){
    return addExpenseDB({
        name, 
        amount: typeof amount === "string" ? parseFloat(amount) : amount
    });
}