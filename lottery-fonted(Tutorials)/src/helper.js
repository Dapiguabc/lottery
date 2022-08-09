import { Network } from "./Constant";
import BigNumber from "bignumber.js";

/**
* Format money. 100000 > 100,000
* @param {Number|String} vlaue money
**/
export const formatMoney = (value) => {
	if (!value) return '0.00'
    const values = value.toString().split('.')
    let integerNum = values[0]
    let decimalNum = values[1] ? values[1].slice(0, 2) : '00'
    decimalNum = decimalNum.length === 1 ? decimalNum + 0 : decimalNum
    if (integerNum < 1000) {
      return `${integerNum}.${decimalNum}`
    }
    const list = []
    while (integerNum.length > 3) {
      list.unshift(integerNum.slice(-3))
      integerNum = integerNum.slice(0, -3)
    }
    list.unshift(integerNum)
    return `${list.join(',')}.${decimalNum}`
}
/**
* Format account. 4a035ff604ffb0a44e5235e2fed8f69666b6df6ff11cbfa347d154d1a5453bba => 4a03....3bba
**/
export const formatAccount = (account, lsize = 4, rsize = 4) => {
   if (!account) {
       return '';
   } else {
       return account.substring(0, lsize) + '...' + account.substring(account.length - rsize);
   }
}


/**
 * Change Utc+0 to local timezone
 */
export function changeTimeZone(dateString){
    var localDate = new Date(dateString);
    var localTime = localDate.getTime();
    var localOffset = localDate.getTimezoneOffset()*60*1000;
    return new Date(localTime - localOffset);
}


/** Return current state of a contract variable for smart contract 
 * @param {string} contract 
 * @param {string} variableName 
 * @param {any[]} keys
 * @param {any} default_value 
 **/
export async function getVariable(contract, variableName, keys, default_value) {
  try {
      let url = `http://${Network[process.env.NODE_ENV].blockService}/current/one/${contract}/${variableName}`;
      if (keys.length > 0) {
          url = `${url}/${keys.join(':')}`
      }
      const res = await fetch(
          url, {
              method: 'GET',
          },
      )
      if (res.status === 200) {
          let json = await res.json()
          let value = json.value
          if (value || value===0) {
              if (value.__fixed__) return new BigNumber(value.__fixed__)
              else return value
          } else {
              return default_value
          }
      } else {
          return default_value
      }
  } catch (error) {
      return default_value;
  }
}


/** Return all the state of a contract variable
 * @param {string} contract 
 * @param {string} variableName 
 * @param {any[]} keys
 **/
export async function getAllVariable(contract, variableName, keys) {
    try {
        let url = `http://${Network[process.env.NODE_ENV].blockService}/current/all/${contract}/${variableName}`;
        if (keys.length > 0) {
            url = `${url}/${keys.join(':')}`
        }
        const res = await fetch(
            url, {
                method: 'GET',
            },
        )
        if (res.status === 200) {
            return res.json()
        } else {
            return {}
        }
    } catch (error) {
        return {};
    }
}
