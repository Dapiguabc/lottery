const LotteryMap = {
    Banana: {
        id: 1,
        emoji: "🍌",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f34c.svg"
    },
    Grape: {
        id: 2,
        emoji: "🍇",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f347.svg"
    },
    Lemon: {
        id: 3,
        emoji: "🍋",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f34b.svg"
    },
    Orange: {
        id: 4,
        emoji: "🍊",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f34a.svg"
    },
    Peach: {
        id: 5,
        emoji: "🍑",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f351.svg"
    },
    Pineapple: {
        id: 6,
        emoji: "🍍",
        img: "https://twemoji.maxcdn.com/v/latest/svg/1f34d.svg"
    },
}

const Network = {
    development: {
        blockService: "165.22.47.195:3535",
        currencySymbol: "dTau",
        contractName: "con_tttt_lottery",
        networkType: "mainnet"
    },
    production: {
        blockService: "165.22.47.195:3535",
        currencySymbol: "Tau",
        contractName: "con_tttt_lottery",
        networkType: "mainnet"
    }
}

const AppInfo = {
    appName: 'Lottery dApp',
    version: '1.0.0',
    logo: './Images/logo.svg',
}

export { LotteryMap, Network, AppInfo } 