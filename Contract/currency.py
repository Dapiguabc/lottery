supply = Variable()
balances = Hash(default_value=0)

@construct
def seed():
    supply.set(1_000_000)
    balances['dapiguabc'] = 1000
    pass
    
@export
def transfer(amount: float, to: str):
    sender = ctx.caller
    assert balances[sender] >= amount, 'Not enough coins to send!'

    balances[sender] -= amount
    balances[to] += amount

@export
def balance_of(account: str):
    return balances[account]

@export
def total_supply():
    return supply.get()

@export
def allowance(owner: str, spender: str):
    return balances[owner, spender]

@export
def approve(amount: float, to: str):
    sender = ctx.caller
    balances[sender, to] += amount
    return balances[sender, to]

@export
def transfer_from(amount: float, to: str, main_account: str):
    sender = ctx.caller

    assert balances[main_account, sender] >= amount, 'Not enough coins approved to send! You have {} and are trying to spend {}'\
        .format(balances[main_account, sender], amount)
    assert balances[main_account] >= amount, 'Not enough coins to send!'

    balances[main_account, sender] -= amount
    balances[main_account] -= amount

    balances[to] += amount