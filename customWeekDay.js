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
        type: "channel",
        title: "Channel for display"
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
        title: "Text for each day (only first array texts will be used!)",
        vars: [{
            name: "sunday",
            type: "string",
            title: "Sunday",
            placeholder: "My Sunday"
        },
        {
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
        }]
    }]
}, (_, config, { name, version, author }) => {
    const backend = require('backend');
    const engine = require('engine');

    if (!doesConfigExist(config))
        return logError("Plugin is not configured properly.");

    let customWeekDayText = [];
    let texts = config.texts[0];
    customWeekDayText.push(texts.sunday);
    customWeekDayText.push(texts.monday);
    customWeekDayText.push(texts.tuesday);
    customWeekDayText.push(texts.wednesday);
    customWeekDayText.push(texts.thursday);
    customWeekDayText.push(texts.friday);
    customWeekDayText.push(texts.saturday);

    var currentDay = new Date().getDay();
    updateDayText(customWeekDayText[currentDay]);

    setInterval(() => {
        let today = new Date().getDay();

        if (today !== currentDay) {
            currentDay = today;
            updateDayText(customWeekDayText[currentDay]);
        }
    }, 1000)

    function updateDayText(dayText) {
        let channel = backend.getChannelByID(config.channelId);
        let channelText = config.textFormat.replace("%text%", dayText);

        if (!channel)
            return logError(`Updating text failed: Could not find channel with ID ${config.channelId}`);

        log(`Updating name of channel ${channel.id()} [${config.channelId}] ${config.channelId} to ${channelText}`);
        channel.update({name: channelText});
    }

    function doesConfigExist(config) {
        return (config || config.channelId || config.textFormat || config.texts || config.texts[0]);
    }

    function log(text) {
        return engine.log(`[${name} v${version}] ${text}`);
    }

    function logError(text) {
        return log(`ERR:: ${text}`)
    }

    engine.log(`\n\t${name} v${version} by ${author} loaded!`);
})
