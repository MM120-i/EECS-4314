// ok so now we will get into the forecasting stuff
// theres bare models to choose from but for now im gonna use the easiest one
// EMA (Exponential Moving Average) cus im too stupid for anything else
// also EMA gives more weight to recent spending patterns

// First of all the formula :-) :
// EM A(t) = (Price(t) x a) + (EM A(t - 1) x (1 - a))
// Where:
// EM A(t) = EMA at time t
// Price(t) = spending at time t
// a = smoothing factor which is usually a = 2 / (N + 1) where N is the window (like 3 months or sum shi)
// smoothing factor is basically how much weight the recent transactions will hold
// higher smoothing factor gives more weight to recent transactions
async function EMA_forecastNextMonth(monthlyData, alpha = 0.3) {
  // lets check if the monhtly data even exists
  if (monthlyData.length === 0) {
    return null;
  }

  // lets get all the amounts from monthlyData
  // amount will be an array that just stores all the money spent in that month
  const amount = monthlyData.map((month) => month.totalSpent);
  console.log(amount);

  // this is just to format the output a little more
  const lastData = monthlyData[monthlyData.length - 1]; // just gets the last data point
  let nextMonth = lastData._id.month + 1;
  let nextYear = lastData._id.year;
  // ok so to check if the year changes
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  const nextMonthDate = new Date(nextYear, nextMonth - 1, 1);
  const nextMonthName = nextMonthDate.toLocaleString("default", {
    month: "long",
  });

  // initialize the first EMA which is just the first data point
  let EMA = amount[0];

  // now we gotta calculate the EMA for all the months
  for (let i = 1; i < amount.length; i++) {
    EMA = amount[i] * alpha + EMA * (1 - alpha);
  }

  return {
    forecast: EMA,
    nextMonth: nextMonth,
    nextYear: nextYear,
    nextMonthName: nextMonthName,
  };
}

export async function EMA_forecastCategorical(categoricalData, alpha = 0.3) {
  // what we want to do is, get the total amount spent on each category
  // we already have an aggregator from mongo for that so we just call it here
  // then, for each category we can just run the normal EMA alg
  // store them in an array as an object(?) and return it

  //   console.log("Raw data");
  //   console.log(categoricalData);

  // lets check if the data even exists
  if (categoricalData.length === 0) {
    return null;
  }

  // ok so we gotta iterate thru each category and then add the totalSpent to a new array
  // then run ema on that new array
  // but we need to do it for every category
  // so im thinking ab using forEach - category - make a new array and run ema on that
  // this shud technically work but lets see
  // we also need a way to store the forecast so lets just make an array that stores objects ig

  // problem: forEach can only be used for arrays but the data we send is an object
  // use for...in instead
  let forecastData = [];

  // basically what we are looping thru is
  // each category within the input data
  for (const categories in categoricalData) {
    const element = categoricalData[categories]; // this basically just gets the array that each category holds
    // console.log(element); // was for debugging
    // so for each element in the array
    // store the totalSpent amount in a new array
    const amount = element.map((spent) => spent.totalSpent);
    // console.log(amount); // was for debugging

    // run ema with the new array
    // initialize the first EMA which is just the first data point
    let EMA = amount[0];

    // now we gotta calculate the EMA for all the months
    for (let i = 1; i < amount.length; i++) {
      EMA = Math.abs(amount[i]) * alpha + EMA * (1 - alpha);
    }

    forecastData.push({
      category: categories,
      forecast: EMA.toFixed(2),
    });
  }

  return {
    message: {
      summary: `You are predicted to spend the following amounts on each category next month`,
    },
    forecastData,
  };
}

export default EMA_forecastNextMonth;
