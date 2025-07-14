import { expenseDB } from "../agent";

/**
 * Add expense tools to add the expense in the database;
 */
type AddAmount = {
    name: string;
    amount: string | number;
}

export function addExpense({ name,amount}: AddAmount){
    console.log(`Adding ${amount} to expense db for ${name}`)

    expenseDB.push({
        name,
        amount
    });

    return "Added to the expense db."
}