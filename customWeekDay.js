registerPlugin({
    name: "Custom Week Day Text",
    version: "0.0.1",
    author: "Humenius <contact[at]humenius.me>",
    description: "Displays a custom set text for specific days",
    backends: ["ts3"],
    engine: ">= 1.0",
    autorun: false,
    enableWeb: false,
    hidden: false,
    vars: [{
        name: "channelId",
        type: "string",
        title: "Channel for display:",
        placeholder: "1"
    }, 
    {
        name: "textFormat",
        type: "string",
        title: "Text formatting (Placeholder: %text%)",
        placeholder: "Today is %text%"
    },
    {
        name: "texts",
        type: "array",
        title: "Text for each day",
        vars: [{
            name: "monday",
            type: "string",
            title: "Monday",
            placeholder: "My Monday"
        },
        {
            name: "tuesday",
            type: "string",
            title: "Tuesday",
            placeholder: "My Tuesday"
        },
        {
            name: "wednesday",
            type: "string",
            title: "Wednesday",
            placeholder: "My Wednesday"
        },
        {
            name: "thursday",
            type: "string",
            title: "Thursday",
            placeholder: "My Thursday"
        },
        {
            name: "friday",
            type: "string",
            title: "Friday",
            placeholder: "My Friday"
        },
        {
            name: "saturday",
            type: "string",
            title: "Saturday",
            placeholder: "My Saturday"
        },
        {
            name: "sunday",
            type: "string",
            title: "Sunday",
            placeholder: "My Sunday"
        }]
    }]
}, (_, config, { name, version, author }) => {
    const backend = require('backend');
    const engine = require('engine');

    if (!doesConfigExist())
        return logError("Plugin is not configured properly.");

    let weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var currentDay = weekDay[new Date().getDay()];

    setInterval(() => {
        let today = new Date().getDay();

        if (weekDay[today] !== currentDay) {
            currentDay = weekDay[today]
            updateDayText(currentDay);
        }
    }, 1000)

    function updateDayText(dayText) {
        let channel = backend.getChannelByID(config.channelId);
        let channelText = config.textFormat.replace("%text%", dayText);
        channel.update({name: channelText});
    }

    function doesConfigExist(config) {
        return !(config === undefined
            || config.channelId === undefined 
            || config.textFormat === undefined 
            || config.texts === undefined);
    }

    function log(text) {
        return engine.log(`[${name} v${version}] ${text}`);
    }

    function logError(text) {
        return log(`ERR:: ${text}`)
    }

    engine.log(`\n\t${name} v${version} by ${author} loaded!`);
})