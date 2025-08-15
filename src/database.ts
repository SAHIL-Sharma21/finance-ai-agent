import {Database} from 'bun:sqlite';

export const db = new Database("finance.db");

const createExpenseTable = `
    CREATE TABLE IF NOT EXIST expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

const createIncomeTable = `
    CREATE TABLE IF NOT EXIST income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;


// initilise database creation 
export function initDB(){
     db.exec(createExpenseTable);
     db.exec(createIncomeTable);
     console.log("Database Initialized with the table.")
}


// Database functions to perform operations

type AddAmount = {
    name: string;
    amount: string | number;
}
export async function addExpenseDB({name, amount}: AddAmount){
    try {
        if(!name && !amount) return;

        db.run('INSERT INTO expenses (name, amout) VALUES (?, ?)', [name, amount])
        return "expense added to the DB."
    } catch (err) {
        console.error("Error", err);
    }
}

export async function addIncomeDB({name, amount}: {name: string, amount: number | string}){
    try {
        db.run('INSERT INTO income (name, amount) VALUES (?, ?)', [name, amount]);
        return 'Income is added to the Income DB.'
    } catch (err) {
        console.error("Error: ", err)
    }
}

export async function getMoneyBalanceDB(){
    try {
        const incomeResult = db.query('SELECT SUM(amount) as totalIncome FROM income').get() as {totalIncome: number | null};
        const expenseResult = db.query('SELECT SUM(amount) as totalExpense FROM expenses').get() as {totalExpense: number | null};

        const totalIncome = incomeResult?.totalIncome || 0;
        const totalExpense = expenseResult?.totalExpense || 0;

        return `Current balance is ${(totalIncome - totalExpense).toFixed(2)} INR`
    } catch (err) {
        console.error("Error: ", err);
    }
}

export async function getAllExpenseDB() {
    try {
        const results = db.query('SELECT * FROM expenses ORDER BY date DESC').all();
        return results;
    } catch (err) {
        console.error("Error ", err)
        return [];
    }
}


export async function getAllIncome() {
    try {
        const result = db.query('SELECT * FROM income ORDER BY date DESC').all();
        return result;
    } catch (err) {
        console.error("Error ", err)
        return [];
    }
}


initDB();