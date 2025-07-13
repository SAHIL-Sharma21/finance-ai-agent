/**
 * AI agen tool
 * -> Get TOTAL expense
 */

type TotalExpense = {
    from: string | any;
    to: string | any;
}

export function getTotalExpense({from, to}: TotalExpense){
    console.log("Calling total expense tool")

    // we have to call Database
    return "10000";
}