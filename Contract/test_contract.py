import imp
import unittest
from contracting.client import ContractingClient
from contracting.stdlib.bridge.time import Timedelta


class MyTestCase(unittest.TestCase):
     # Will be called before per test
    def setUp(self):
        self.client = ContractingClient()
        self.client.flush()
        
        # Submit the currency contract as the dependency of lottert contact
        with open('currency.py') as f:
            code = f.read()
            self.client.submit(code, name='currency')

        # Submit the lottery contract
        with open('./lottery.py') as f:
            code = f.read()
            self.client.submit(code, name='lottery')

        self.lottery = self.client.get_contract('lottery')
        self.currency = self.client.get_contract('currency')

    # Will be called after per test
    def tearDown(self):
        # Reset the contracting client
        self.client.flush()

    # Test seed method 
    def test_seed(self):
        self.assertEqual(self.lottery.quick_read('min_amount'), 1)
        self.assertEqual(self.lottery.quick_read('interval_seconds'), 3600)
        self.assertEqual(self.lottery.quick_read('current_round'), 1)
        self.assertFalse(self.lottery.quick_read('genesis_round_run'))

    def test_buy_error(self):
        self.lottery.run()
        self.currency.approve(amount=1000, to='lottery', signer='dapiguabc')

        # Should raise error if ticket is incorrect
        with self.assertRaisesRegex(AssertionError, 'Ticket #ErrorTicket not exists'):
            self.lottery.buy(ticket = 'ErrorTicket', amount = 10, round_num = 1, signer='dapiguabc')
        
        # Should raise error if amount is less than the min purchase amount
        with self.assertRaisesRegex(AssertionError, 'At least 1 Taus are required'):
            self.lottery.buy(ticket = 'Banana', amount = 0, round_num = 1, signer='dapiguabc')

        # Should raise error if the lottery round is not started
        with self.assertRaisesRegex(AssertionError, 'Round #2 not started'):
            self.lottery.buy(ticket = 'Banana', amount = 10, round_num = 2)

    # Test whether we can buy a ticket successfully
    def test_buy(self):
        self.lottery.run()
        self.currency.approve(amount=1000, to='lottery', signer='dapiguabc')
        self.lottery.buy(ticket = 'Banana', amount = 10, round_num = 1, signer='dapiguabc')
        
        self.assertEqual(self.lottery.user_rounds['dapiguabc'], [1])
        self.assertEqual(self.lottery.rounds[1, 'betInfo', 'Banana'][0], {
            'buyer': 'dapiguabc',
            'amount': 10
        })

    # Test whether we can end current round and start next
    def test_run_next_round(self):
        self.lottery.run()
        self.currency.approve(amount=1000, to='lottery', signer='dapiguabc')
        self.lottery.buy(ticket = 'Banana', amount = 10, round_num = 1, signer='dapiguabc')
        print(self.lottery.quick_read('current_round'))
        env = {'now': self.lottery.now() + Timedelta(seconds=100000)}
        self.lottery.run(environment=env)
        self.assertEqual(self.lottery.quick_read('current_round'), 2)

    # Test whether we can claim the prize
    def test_claim(self):
        self.lottery.run()
        self.currency.approve(amount=1000, to='lottery', signer='dapiguabc')

        # Buy the all tickets to make we can be the winner.
        self.lottery.buy(ticket = 'Banana', amount = 10, round_num = 1, signer='dapiguabc')
        self.lottery.buy(ticket = 'Grape', amount = 10, round_num = 1, signer='dapiguabc')
        self.lottery.buy(ticket = 'Lemon', amount = 10, round_num = 1, signer='dapiguabc')
        self.lottery.buy(ticket = 'Orange', amount = 10, round_num = 1, signer='dapiguabc')
        self.lottery.buy(ticket = 'Peach', amount = 10, round_num = 1, signer='dapiguabc')
        self.lottery.buy(ticket = 'Pineapple', amount = 10, round_num = 1, signer='dapiguabc')

        # Mock the env time to make the current round ended. 
        env = {'now': self.lottery.now() + Timedelta(seconds=100000)}
        self.lottery.run(environment=env)

        self.assertFalse(self.lottery.rounds[1, 'dapiguabc', "claimed"])

        self.lottery.claim(round_num=1, signer='dapiguabc')

        self.assertTrue(self.lottery.rounds[1, 'dapiguabc', "claimed"])


if __name__ == '__main__':
    unittest.main()  