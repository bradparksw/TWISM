# TWISM - Twitter's Influence on Stock Market
## _Web app that visualizes how twitter influencers affect the stock market_

Have you seen Elon Musk's tweets pumping up the market? 
Recently, social media has been able to make great impacts to the stock market (e.g., Elon Musk, r/WallStreetBets).
From that idea, TWISM was built to better visualize the impacts of such social media posts.

## Instructions

##### Search for tweets by username, keyword, or tweet ID

![Search By Username](https://i.ibb.co/RNTWfVJ/Search-By-Username.png)

In the case of searching by tweet ID, you can retrieve the ID from any tweet's numerical portion of the link:

![TweetID](https://i.ibb.co/fq2rv1M/TweetID.png)

##### Pick a tweet and wait for it to output related stock ticker 

![Analyze Tweet](https://i.ibb.co/FK9Dpw4/Analyze-Tweet.png)

##### Pick or manually enter a stock symbol to analyze the change in price since the tweet was posted

![Tweet-Influence](https://i.ibb.co/Cmnx8Kx/Tweet-Influence.png)

## Installation

As Twitter API isn't available from the client side, an express backend was required to make server-side calls.

Install the dependencies and start the server. From the main directory...

```sh
cd api
npm install
npm start
```

Again for the react frontend...

```sh
cd client
npm install
npm start
```

And you're good to go!

## Docker

Lazy to always start two servers manually? Use the docker image and containers!

From the main directory, simply run the command:

```sh
docker-compose up
```

And you're good to go!

## Future Features

- Cryptocurrency
- Visualization range of dates (day, week, month)
- Support for non-US stocks

## License

MIT

