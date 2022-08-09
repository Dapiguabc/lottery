# Import libraries
from lamden.crypto.wallet import Wallet
from lamden.crypto.transaction import build_transaction
import requests

def run():
    # Create wallet
    my_wallet = Wallet('<SK HERE AS HEX STRING>')

    # Get Nonce
    # masternode_url = 'https://masternode-01.lamden.io'
    masternode_url = 'https://testnet-master-1.lamden.io'

    res = requests.get(f'{masternode_url}/nonce/{my_wallet.verifying_key}')

    nonce = res.json()['nonce']
    processor = res.json()['processor']

    stamps = 200 

    # Pushing a transaction is similar to intracting with smart contracts via the client
    contract = 'Your Contract name'
    function = 'run'

    tx = build_transaction(
            wallet=sender,
            processor=processor,
            stamps=stamps,
            nonce=nonce,
            contract=contract,
            function=function,
            kwargs={}
        )

    # You can submit the transaction through any Python HTTP library
    response = requests.post(masternode_url, data=tx, verify=False)

if __name__ == '__main__':
    run()

