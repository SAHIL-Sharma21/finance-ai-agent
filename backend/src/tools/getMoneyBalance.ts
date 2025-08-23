/**
 * GetMoney Balance of the person who spent and have total
 */

import {getMoneyBalanceDB} from '../database';

export async function getMoneyBalance(){
    return await getMoneyBalanceDB();
}