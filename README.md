## What is AutoMatch? 🚘
Buying a car is an exciting time: it's a large purchase that will stay by your side for years. But there's so many different aspects to consider, from the make, model, and color of the car to how you're going to pay for it. How do you balance what you want with what you can afford?
That's where AutoMatch comes in. We'll show you plenty of cars and their specs, help you predict if you can get a loan for your car, and get you started scheduling test drives with a dealership. 
- **A Portfolio of Cars**: See a wide range of cars and their details. If that gets overwhelming, switch to our Swipe View, where you can swipe through recommended cars like everyone's favorite dating app. You can then take a closer look at the cars you liked, comparing the expected weekly gas cost. 
- **Financial Planning**: After completing our short quiz with your information, you can predict whether your loan for a specific car will be approved using our trained model. Looking to trade in your current car? Get an estimate based on your car and location.
- **In-person Scheduling**: Once you've selected a car, our AI-powered agentic assistant Alex can make a call to a dealership on your behalf, scheduling a test drive using ElevenLabs.
- **AI-Powered Suggestions**: Autobot, your personal car-buying assistant, can show you specific cars based on your specifications.  

## What makes us different?
- **One Stop Shop**: Get assistance throughout your car-buying journey, from the search to the finances to the test drive. We even estimate gas prices, provide trade-in estimations, and call the dealership on behalf of the user.
- **Automated Data Pipeline**: For every new car model added, images are automatically found and added without the need for manual searching.
- **Enriched Historical Data**: Our car database includes **real** models from 2020 to present day, making it possible to search for **both** older and newer car models, unlike many current catalogs.

## Framework & Tech Stack 🚦
- **React, Recharts, and Tailwind CSS**: Front-end developed with React and Tailwind CSS, ensuring a visually pleasing platform that is easily scalable. Recharts allows you to compare two cars side by side, even taking into account your commute to estimate gas costs.
- **Kelley Blue Book and Serp API**: Retrieves accurate information on hundreds of cars to build the dashboard, including finding images for each one, to make the search for your car run smoothly.
- **Loan Prediction Model**: Using RandomForest, we built and trained a model that predicts whether or not your loan will be approved for car with 97% accuracy, reducing the impact on your credit score.
- **MarketCheck API**: Gives an approximate evaluation for trading in your current car based on current market valuations.
- **ElevenLabs**: Have Alex make phone calls for you with 11ElevenLabs, and AI-voice generation platform.
- **Gemini API**: Prompted to respond based on the data we obtained, Autobot uses Natural Language Processing (NLP) and RAG to recommend you a car.
- **Chroma and Sentence Transformers**: Encode and save car data in a vector database for our RAG model
- **Flask**: Our backend connected with Flask, making it easy to link together our various features.

## Obstacles ⛰️
- **Obtaining Data**: Leveraging the APIs listed above to get data on currently-available cars proved more difficult than we expected, as there was a large quantity of items to correctly select.
- **RAG Chatbot**: We encountered a series of challenges while building Autobot, including difficult integration with our dashboard and data.
- **Frontend**: The Swipe View and Quiz features provided challenges to formatting and implementation.

## Accomplishments 🏆
- **Accurate, Updated Database**: Successfully obtained a large amount of information about the cars available on the market today, making our product useful and efficient.
- **Trained Loan Model**: The loan prediction model works off of real loan data, giving reliable estimations and saving time.
- **AI Phone Calls**: Alex can start, hold, and end an entire conversation to schedule a logical test drive appointment.

## Future Plans 💭
- **Maintenance Costs**: Allow users to enter data about their daily habits: dangerous areas, insurance, weather, lifestyle, anything that could cause their car to require further funding past the purchase date. This would allow them to plan their finances ahead of time.
- **Dealership Dashboard**: Create a dashboard for dealerships to see requests for appointments and hat with customers about cars they are interested in.
