const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
        
    } else {
        speak("Good Evening sir...");
    }
}


/*window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});*/
window.addEventListener('load', () => {
    if (!sessionStorage.getItem('jarvisInitialized')) {
        speak("Initializing GYAAN BOT...");
        wishMe();
        sessionStorage.setItem('GYANN BOT Initialized', 'true');
    }
});



const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function convertCurrency(amount, from, to) {
    const apiUrl = `https://api.exchangerate.host/convert?from=${from.toUpperCase()}&to=${to.toUpperCase()}&amount=${amount}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.result) {
            speak(`The converted amount is ${data.result.toFixed(2)} ${to.toUpperCase()}`);
        } else {
            speak("Sorry, I couldn't fetch the conversion rate. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        speak("An error occurred while fetching the exchange rate.");
    }
}

async function getWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const temp = data.main.temp;
            const weatherDesc = data.weather[0].description;
            const finalText = `The current temperature in ${location} is ${temp}°C with ${weatherDesc}.`;
            speak(finalText);
        } else {
            speak(`Sorry, I couldn't find the weather for ${location}. Please check the location.`);
        }
    } catch (error) {
        speak("Sorry, there was an error fetching the weather information.");
    }
}

function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

// Function to Get Directions
function getDirections(destination) {
    if (!destination) {
        speak("Please specify a destination.");
        return;
    }

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude; // Current latitude
            const lon = position.coords.longitude; // Current longitude

            // Construct Google Maps Directions URL
            const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

            // Speak and Open URL
            speak(`Getting directions from your location to ${destination}.`);
            window.open(url, "_blank");
        },
        (error) => {
            // Handle location access error
            speak("Sorry, I couldn't access your location. Please enable location services and try again.");
        }
    );
}

// Function to Process Voice Command
function processCommand(command) {
    if (command.includes("I'm going to")) {
        const destination = command.replace("I'm going to", "").trim(); // Extract destination
        getDirections(destination);
    } else {
        speak("Sorry, I didn't understand that command. Please try again.");
    }
}

// Function to Start Voice Recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
        speak("Listening for your command.");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the voice input
        processCommand(transcript); // Process the command
    };

    recognition.onerror = (event) => {
        speak("An error occurred. Please try again.");
    };

    recognition.start();
}

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    }else if (message.includes("convert currency")) {
        // Example command: "Convert 100 USD to INR"
        const regex = /convert (\d+(\.\d+)?) (\w{3}) to (\w{3})/;
        const match = message.match(regex);
        if (match) {
            const amount = parseFloat(match[1]);
            const fromCurrency = match[3];
            const toCurrency = match[4];
            speak(`Converting ${amount} ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()}`);
            convertCurrency(amount, fromCurrency, toCurrency);
        } else {
            speak("Please specify the amount and currencies to convert, like 'Convert 100 USD to INR'.");
        }
    }else if (message.includes("weather in")) {
        const location = message.replace("weather in", "").trim();
        if (location) {
            speak(`Fetching weather information for ${location}...`);
            getWeather(location);
        } else {
            speak("Please specify a location to get the weather information.");
        }
    }else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://www.youtube.com/", "_blank");
        speak("Opening Youtube...");
    }else if (message.includes(" play song")) {
        window.open("https://www.youtube.com/watch?v=zIvKigQ9cVY", "_blank");
        speak("play song on  Youtube...");
    }else if (message.includes("play music")) {
        window.open("https://www.youtube.com/watch?v=w9Qo6p4XsXE&list=PLJvw2iL08t_Eyy6nIiNQ7wmcafbunegWn", "_blank");
        speak("play music on Youtube...");
    }else if (message.includes("play punjabi music")) {
        window.open("https://www.youtube.com/watch?v=n_FCrCQ6-bA&list=PLc9yVhQnlBj3eSxZgREY-7TZn5J7LZNlz", "_blank");
        speak("play punjabi music on Youtube...");
    }
    else if (message.includes("open whatsapp")) {
        window.open("https://web.whatsapp.com/", "_blank");
        speak("Opening whatsapp...");
    }else if (message.includes("chat with mom")) {
        window.open("https://wa.me/916232899904", "_blank"); 
        speak("Opening chat with Mom...");
    }else if (message.includes("chat with aditya")) {
        window.open("https://wa.me/918839076135", "_blank"); 
        speak("Opening chat with aditya...");
    }else if (message.includes("chat with satypal")) {
        window.open("https://wa.me/919302781206", "_blank"); 
        speak("Opening chat with satyapal...");
    }else if (message.includes("chat with aditya")) {
        window.open("https://wa.me/918839076135", "_blank"); 
        speak("Opening chat with aditya...");
    }else if (message.includes("call aditya")) {
        window.open("https://wa.me/918839076135", "_blank"); 
        speak("calling aditya...");
    }
    else if (message.includes("call mom")) {
        window.open("https://wa.me/916232899904?call=true", "_blank");
        speak("Calling mom...");
    } else if (message.includes("call devanshi")) {
        window.open("https://wa.me/919406521181?call=true", "_blank");
        speak("Calling madamji...");
    }else if (message.includes("call vishwas")) {
        window.open("https://wa.me/919630272580?call=true", "_blank");
        speak("Calling Vissu...");
    } else if (message.includes("call dolly")) {
        window.open("https://wa.me/917509770624?call=true", "_blank");
        speak("Calling dolly...");
    } 
    else if (message.includes("call siddharth")) {
        window.open("https://wa.me/916265736255?call=true", "_blank");
        speak("Calling sid...");
    } 
    else if (message.includes("call papa")) {
        window.open("https://wa.me/919685655842?call=true", "_blank");
        speak("Calling papa...");
    } 
     else if (message.includes("call pankaj")) {
        window.open("https://wa.me/919302781206?call=true", "_blank");
        speak("Calling Satyapal...");
    } else if (message.includes("open github")) {
        window.open("https://github.com/Anshraj11111", "_blank");
        speak("Opening github...");
    } else if (message.includes("open my channel")) {
        window.open("https://youtube.com/@keystrokescoffee?si=q1ovNa5UyW87GknN", "_blank");
        speak("Opening my channel...");
    } else if (message.includes("open my channel")) {
        window.open("UCuW67DFguemJ2jc3ZkIKlCg", "_blank");
        speak("Opening my channel...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    }else if (message.includes("go back")) {
        window.location.href.includes("https://web.whatsapp.com/")
        window.location.href = "index.html"; // Replace with the actual URL of your bot's main page
        speak("Going back to the main page...");
    }/*else if (message.includes("call")) {
        const contacts = {
            mom: "916232899904",
            aditya: "918839076135",
            satyapal: "919302781206"
        };
    
        const contactName = message.split("call ")[1]?.trim();
        const phoneNumber = contacts[contactName];
    
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
            speak(`Calling ${contactName}...`);
        } else {
            speak("Sorry, I could not find the person you want to call.");
        }
    }*/else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}



/*"What's the weather in New York?"
"Tell me the weather in Paris."
"Weather in Tokyo."*/


