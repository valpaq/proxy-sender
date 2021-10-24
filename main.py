import json
import web3
from web3 import HTTPProvider
from web3 import Web3
from web3.middleware import geth_poa_middleware
from web3 import Account
import sys


def approve_contract(w3, token_address, amount, info_json):
    with open("artifacts\@openzeppelin\contracts\\token\ERC20\IERC20.sol\IERC20.json") as f:
        for_abi = json.load(f)
    abi = for_abi["abi"]
    token_contract = w3.eth.contract(token_address, abi=abi)
    transaction = token_contract.functions.approve(info_json['address_contract'], int(amount))\
        .buildTransaction({'from': info_json['author_address']})
    transaction.update({ 'gas' : info_json['approve_gas'] })
    transaction.update({ 'nonce' : w3.eth.get_transaction_count(info_json['author_address']) })
    acct = Account.privateKeyToAccount(info_json['privatekey'])
    signed_tx = acct.sign_transaction(transaction)
    txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    w3.eth.wait_for_transaction_receipt(txn_hash, timeout = 30000)


def main():
    args = sys.argv
    if len(args) <= 3:
        raise ValueError('not enough input')
    with open("artifacts/contracts/ProxySender.sol/ProxySender.json") as f:
        info_json = json.load(f)
    abi = info_json["abi"]
    with open("config.json") as f:
        info_json = json.load(f)
    address_contract = info_json["address_contract"]
    author_address = info_json["author_address"]
    http_connect = info_json['http_connect']
    infuraid = info_json['INFURAID']
    w3 = Web3(HTTPProvider(http_connect + infuraid))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    contract = w3.eth.contract(address_contract, abi=abi)
    print(contract.all_functions())

    if len(args) == 5:
        approve_contract(w3, args[2], args[3], info_json)
        transaction = contract.functions.resendAny(args[2], int(args[3]), args[4]).buildTransaction({'from': author_address})
    else:
        if args[1] == "resendUSDT":
            approve_contract(w3, info_json['usdt'], args[2], info_json)
            transaction = contract.functions.resendUSDT(int(args[2]), args[3]).buildTransaction({'from': author_address})
        else:
            transaction = contract.functions.resendETH(args[2]).buildTransaction({'from': author_address})
            transaction.update({"value": Web3.toWei(args[3],'ether')})
# https://web3py.readthedocs.io/en/stable/contracts.html?highlight=transaction%20dictionary#web3.contract.ContractFunction.buildTransaction
    
    transaction.update({ 'gas' : info_json['appropriate_gas_amount'] })
    transaction.update({ 'nonce' : w3.eth.get_transaction_count(author_address) })
    acct = Account.privateKeyToAccount(info_json['privatekey'])
    signed_tx = acct.sign_transaction(transaction)
    txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    w3.eth.wait_for_transaction_receipt(txn_hash, timeout = 30000)

if __name__ == '__main__':
    main()
