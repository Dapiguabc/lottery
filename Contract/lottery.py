import currency

owner = Variable() # the owner of this contract
current_round = Variable() # Indicates the current lottery round
min_amount = Variable() # Minimum purchase amount for a ticket
interval_seconds = Variable() # 
genesis_round_run =  Variable() # Indicates whether the first round of the lottery has started
total = Variable() # The lottery jackpot
tickets = Variable() # self-explanatory

rounds = Hash() # Lottery info
user_rounds = Hash() # Save the round number of the lotteries we've played so far

@construct
def seed():
    owner.set(ctx.caller) # set owner to the submitter of this contract
    min_amount.set(1) # set min purchase amount to 1 tau
    interval_seconds.set(3600) # one hour
    current_round.set(1) # set initial round number to 1
    genesis_round_run.set(False) # default false
    total.set(0) # default 0
    tickets.set(['Banana', 'Grape', 'Lemon', 'Orange', 'Peach', 'Pineapple'])

@export    
def transfer_ownership(new: str):
    assert owner.get() == ctx.caller, 'Only owner can execute transfer_ownership method.'
    owner.set(new)


@export
def buy(ticket: str, amount: float, round_num: int):
    # Check whether the ticket is correct.
    assert ticket in tickets.get(), f'Ticket #{ticket} not exists'
    # Ensure the amount is larger than or equal to the minimum purchase amount.
    assert amount >= min_amount.get(), f'At least {min_amount.get()} Taus are required.'
    
    # nsure the specified round has started
    assert rounds[round_num, "startTime"] is not None and rounds[round_num, "startTime"] <= now, \
        f'Round #{round_num} not started'
    # Ensure the specified round not ended
    assert rounds[round_num, "endTime"] is not None and rounds[round_num, "endTime"] >= now, \
        f'Round #{round_num} has ended'

    caller = ctx.caller

    # transfer the funds of the caller to this contract
    currency.transfer_from(amount=amount, to=ctx.this, main_account=caller)

    # Store bet info 
    rounds[round_num, "betInfo", ticket].append({
        'buyer': caller,
        'amount': amount
    })
    rounds[round_num, "betInfo", ticket] = rounds[round_num, "betInfo", ticket]

    # Inital
    if user_rounds[caller] is None:
        user_rounds[caller] = []
    
    # Store the round numbers that the caller played
    if round_num not in user_rounds[caller]:
        user_rounds[caller].append(round_num)
        # Ensure data stored 
        user_rounds[caller] = user_rounds[caller]

    
@export         
def run():
    # Only owner can call this method
    assert owner.get() == ctx.caller, 'Only owner can execute start method.' 

    current = current_round.get()

    # For genesis round, don't need to end last round and calculate the rewards.
    if not genesis_round_run.get():
        start_round(current)
        genesis_round_run.set(True)
        return

    # End last round
    end_round(current)

    # Calculate rewards
    calculate_rewards()

    # Increment current round to next round
    next_round = current + 1
    current_round.set(next_round)

    # start next round
    start_round(next_round)
    

@export
def claim(round_num: int):
    caller = ctx.caller
    # Check whether the round is ended 
    assert rounds[round_num, "status"] == "Ended", f"Claim failed, round #{round_num} not ended"
    # Check whether you have claimed your winnings
    assert not rounds[round_num, caller, "claimed"], "You have claimed for this round"

    # Do calculations
    winning_ticket = rounds[round_num, "winTicket"]
    bet_amount = 0
    for value in rounds[round_num, "betInfo", winning_ticket]:
        if value.get('buyer') == caller:
            bet_amount = bet_amount + value.get('amount')

    # Check whether you won the prize
    assert bet_amount > 0, "Not eligible for claim"

    winner_bet_amount = rounds[round_num, "winnerBetAmount"]
    total_amount = rounds[round_num, "totalAmount"]
    rewards = (bet_amount / winner_bet_amount) * total_amount
    rounds[round_num, caller, "claimed"] = True

    # transfer the prizes to caller
    currency.transfer(amount=rewards, to=caller)

def start_round(round_num: int):
    # Get current time
    now_time = now
    # Set start time
    rounds[round_num, "startTime"] = now_time
    # Set end time
    rounds[round_num, "endTime"] = now_time + datetime.timedelta(seconds=interval_seconds.get())
    rounds[round_num, "status"] = "Starting"

    for ticket in tickets.get():
        rounds[round_num, "betInfo", ticket] = []

def end_round(round_num: int):
    # Make sure this round can be ended.
    assert rounds[round_num, "endTime"] is not None and rounds[round_num, "endTime"] < now, \
        f"Round #{round_num} not ended"

    # Mark this round is ended
    rounds[round_num, "status"] = "Ended"


def calculate_rewards():

    current = current_round.get()

    # Called once per transaction
    random.seed()
    # Calculate the winning ticket
    winning_ticket = tickets.get()[random.randint(1,6)]

    winner_bet_amount = 0
    total_amount = 0

    for ticket in tickets.get():
        for value in rounds[current, "betInfo", ticket]:
            if winning_ticket == ticket:
                winner_bet_amount = winner_bet_amount + value.get('amount')
            total_amount = total_amount + value.get('amount')
    # total amount of all winners in this round
    rounds[current, "winnerBetAmount"] = winner_bet_amount
    # total sales this round
    rounds[current, "totalAmount"] = total_amount
    # total prize in this round
    rounds[current, "totalAwards"] = total_amount + total.get()
    # Winning tickets
    rounds[current, "winTicket"] = winning_ticket

    if winner_bet_amount > 0:
        # If winner exists, empty the prize pool
        total.set(0)
    else: 
        # If there is no winner, the bonus will be accumulated into the prize pool
        total.set(total.get() + total_amount)
    


