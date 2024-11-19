const Account = require("./models/accountdb");
const SavedQuery = require("./models/savedquerydb");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const saltRounds = 10;
const app = express();

require("dotenv").config();
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = process.env.ATLAS_URI;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const secretKey = process.env.JWT_SECRET_KEY;
app.use(express.static(path.join(__dirname, "..", "frontend/build")));

// GET ROUTES
{
    app.get("/test", (req, res) => {
        res.send({
            test: "works",
        });
    });

    // popular queries
    app.get("/popularqueries", async (req, res) => {
        try {
            await mongoose.connect(uri);

            const popularQueries = await SavedQuery.aggregate([
                {
                    $group: {
                        _id: { $toLower: "$searchQuery" },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: 4, // can change limit
                },
            ]);

            res.status(200).json(popularQueries);
        } catch (err) {
            console.error("Error fetching popular queries:", err);
            res.status(500).json({ error: "Error fetching popular queries" });
        } finally {
            mongoose.connection.close();
        }
    });

    // get search history using user id
    app.get("/searchhistory/:userId", async (req, res) => {
        const userId = req.params.userId;

        try {
            await mongoose.connect(uri);

            const searchHistory = await SavedQuery.find({
                userId: userId,
            }).sort({ startDate: -1 });

            if (searchHistory.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No search history found" });
            }

            res.status(200).json(searchHistory);
        } catch (err) {
            console.error("Error fetching search history:", err);
            res.status(500).json({ error: "Error fetching search history" });
        } finally {
            mongoose.connection.close();
        }
    });

    // Get Coordinates
    app.get("/getcoordinates", (req, res) => {
        const location = req.query.location;

        let URL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;

        fetch(URL)
            .then((response) => response.json())
            .then(async (data) => {
                let latitude = data.results[0].latitude;
                let longitude = data.results[0].longitude;

                res.status(200).json({
                    latitude: latitude,
                    longitude: longitude,
                });
            })
            .catch((error) => {
                console.error("Error fetching location data:", error);
                res.status(400).json({ error: "Error fetching location data" });
            });
    });

    // get popular query data from wikipedia
    app.get("/popularquerieswiki", async (req, res) => {
        const baseUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/`;
        const dummyData = [
            { _id: "vancouver", count: 4 },
            { _id: "bangkok", count: 2 },
            { _id: "stockholm", count: 1 },
            { _id: "rome", count: 1 },
        ];

        try {
            await mongoose.connect(uri);

            // fetch popular queries from the database
            const popularQueries = await SavedQuery.aggregate([
                {
                    $group: {
                        _id: { $toLower: "$searchQuery" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 4 },
            ]);

            // use dummy data if no results were found in the database
            const queriesToUse =
                popularQueries.length > 0 ? popularQueries : dummyData;

            // fetch wikipedia data for each query
            const wikiDataArray = await Promise.all(
                queriesToUse.map(async (query) => {
                    const wikiResponse = await fetch(
                        baseUrl + encodeURIComponent(query._id)
                    );
                    if (!wikiResponse.ok) {
                        throw new Error("Location not found.");
                    }
                    const wikiData = await wikiResponse.json();
                    return { ...wikiData, count: query.count };
                })
            );

            res.status(200).json(wikiDataArray);
        } catch (error) {
            console.error(
                "Error fetching popular queries or Wikipedia data:",
                error
            );

            // Use dummy data if there's an error
            const dummyWikiDataArray = await Promise.all(
                dummyData.map(async (query) => {
                    const wikiResponse = await fetch(
                        baseUrl + encodeURIComponent(query._id)
                    );
                    if (!wikiResponse.ok) {
                        throw new Error("Location not found.");
                    }
                    const wikiData = await wikiResponse.json();
                    return { ...wikiData, count: query.count };
                })
            );

            res.status(200).json(dummyWikiDataArray);
        } finally {
            mongoose.connection.close();
        }
    });

    // get time
    app.get("/get-time", async (req, res) => {
        const { latitude, longitude } = req.query;
        const url = `https://timeapi.io/api/time/current/coordinate?latitude=${latitude}&longitude=${longitude}`;

        try {
            const timeResponse = await fetch(url);
            if (!timeResponse.ok) {
                throw new Error("Couldn't fetch result");
            }

            const timeResponseData = await timeResponse.json();
            let temp = parseInt(timeResponseData.time.substring(0, 2), 10);
            let time;

            if (temp > 12) {
                time =
                    (temp - 12).toString() +
                    timeResponseData.time.substring(2) +
                    " p.m";
            } else {
                time = timeResponseData.time + " a.m";
            }

            res.status(200).json({ time });
        } catch (error) {
            console.error("Error fetching time:", error);
            res.status(500).json({ error: "Error fetching time" });
        }
    });

    // get wiki summary
    app.get("/wiki-summary", async (req, res) => {
        const location = req.query.location;
        if (!location) {
            return res
                .status(400)
                .json({ error: "Location parameter is required" });
        }

        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${location}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Location not found.");
            }
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching Wikipedia data:", error);
            res.status(500).json({ error: "Error fetching Wikipedia data" });
        }
    });

    // get wiki image
    app.get("/wiki-image", async (req, res) => {
        const location = req.query.location;
        if (!location) {
            return res
                .status(400)
                .json({ error: "Location parameter is required" });
        }

        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            location
        )}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Location not found.");
            }

            const data = await response.json();
            const imageUrl = data.originalimage?.source || null;

            res.status(200).json({ imageUrl });
        } catch (error) {
            console.error("Error fetching Wikipedia data:", error);
            res.status(500).json({ error: "Error fetching Wikipedia data" });
        }
    });

    app.get("/getplaces", async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            const url = `https://api.geoapify.com/v2/places?categories=entertainment,tourism&limit=30&apiKey=${GEOAPIFY_API_KEY}&filter=circle:${longitude},${latitude},20000`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error fetching places");
            } else {
                console.log("SUCCESS");
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching places:", error);
            res.status(500).json({ error: "Error fetching places", error });
        }
    });

    app.get("/*", function (req, res) {
        res.sendFile(
            path.join(__dirname, "..", "frontend/build", "index.html"),
            function (err) {
                if (err) {
                    res.status(500).send(err);
                }
            }
        );
    });
}

// POST ROUTES
{
    // signup route
    app.post("/signup", async (req, res) => {
        const fields = req.body;

        try {
            await mongoose.connect(uri, { useNewUrlParser: true });

            const existingUser = await Account.findOne({ email: fields.email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ error: "Email is already registered" });
            }

            const hashedPassword = await bcrypt.hash(
                fields.password,
                saltRounds
            );
            const newUser = new Account({
                email: fields.email,
                username: fields.username,
                password: hashedPassword,
            });
            await newUser.save();

            const token = jwt.sign(
                {
                    id: newUser._id,
                    email: newUser.email,
                    username: newUser.username,
                },
                secretKey,
                { expiresIn: "1h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
                .status(200)
                .json({ message: "User registered successfully!" });
        } catch (err) {
            console.error("Error registering user: ", err);
            res.status(500).json({ error: "Error registering user" });
        } finally {
            mongoose.connection.close();
        }
    });

    // signin route
    app.post("/signin", async (req, res) => {
        const fields = req.body;

        try {
            await mongoose.connect(uri);
            const user = await Account.findOne({ email: fields.email });

            if (user) {
                const isMatch = await bcrypt.compare(
                    fields.password,
                    user.password
                );

                if (isMatch) {
                    const token = jwt.sign(
                        {
                            id: user._id,
                            email: user.email,
                            username: user.username,
                        },
                        secretKey,
                        { expiresIn: "1h" }
                    );
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                    })
                        .status(200)
                        .json({ message: "Sign in successful", user });
                } else {
                    res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } catch (err) {
            console.error("Error during login:", err);
            res.status(500).json({ error: "Sign in error" });
        } finally {
            mongoose.connection.close();
        }
    });

    // check if user is auth route
    app.post("/isauth", (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send({ authenticated: false });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).send({ authenticated: false });
            }

            res.send({ authenticated: true, user });
        });
    });

    // signout route
    app.post("/signout", (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
    });

    //save query
    app.post("/savequery", async (req, res) => {
        const fields = req.body;

        try {
            await mongoose.connect(uri);
            const newSavedQuery = new SavedQuery({
                userId: fields.userId,
                searchQuery: fields.searchQuery,
                startDate: fields.startDate,
                endDate: fields.endDate,
            });
            await newSavedQuery.save();
            res.status(200).json({ message: "Query Saved!" });
        } catch (err) {
            console.error("Error during saving: ", err);
            res.status(500).json({ error: "Error during saving" });
        } finally {
            mongoose.connection.close();
        }
    });

    // Get historic weather data
    app.post("/getweather", (req, res) => {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        // The +T00:00:00 is to deal with a possible of by one bug, related to javascript Date objects, and timezones.
        const startYear = new Date(startDate + "T00:00:00").getFullYear();
        const endYear = new Date(endDate + "T00:00:00").getFullYear();
        const years_of_data = 5; // We'll gather data for the last 5 years

        const startDay = startDate.split("-")[2];
        const endDay = endDate.split("-")[2];
        const startMonth = startDate.split("-")[1];
        const endMonth = endDate.split("-")[1];
        const start = `${startMonth}-${startDay}`;
        const end = `${endMonth}-${endDay}`;
        const queryEndYear = new Date().getFullYear() - 1; // queryEndYear is one year less than the current year. This is to prevent querying the api for dates that don't have weather data yet, because they are in the future.
        const queryStartYear = startYear - (endYear - queryEndYear); // queryStartYear is found by getting the diffrence between endYear and queryEndYear, and applying the same diffrence to startYear.

        let promises = []; // Array to store the promises from the multiple weather api calls in the next block.

        for (let i = 0; i < years_of_data; i++) {
            const URL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${
                queryStartYear - i
            }-${start}&end_date=${
                queryEndYear - i
            }-${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum`;

            promises[i] = fetch(URL).then((Response) => Response.json()); // This will have the resolved promise be a json object instead of a response object.
        }

        /* Promise.all accepts an iterable of promises, like an array, and will run the .then code, once all of the promises in the iterable have resolved,
         or it will run the .catch code if any of the promises reject or if there is an error in the .then block. Using Promise.all means we can send our api
         requests at the same time instead of sequentionally, and also don't need to worry about the order they resolve in.*/
        Promise.all(promises)
            .then(async (responses) => {
                const date = new Date(startDate + "T00:00:00"); // The +T00:00:00 is to deal with a possible of by one bug, related to javascript Date objects, and timezones.
                const averagedData = {};

                // For each day of data, initialize the array entry for the given day.
                for (let day = 0; day < responses[0].daily.time.length; day++) {
                    const dateIndex = date.toISOString()?.split("T")?.[0];
                    averagedData[dateIndex] = {
                        date: date.toDateString(),
                        averageTemperature: 0,
                        averagePrecipitation: 0,
                    };

                    // For each year of data, add the data to the days average, while dividing it by the number of years of data, so the average will be accurate.
                    for (let year = 0; year < years_of_data; year++) {
                        averagedData[dateIndex].averageTemperature +=
                            responses[year].daily.temperature_2m_mean[day] /
                            years_of_data;
                        averagedData[dateIndex].averagePrecipitation +=
                            responses[year].daily.precipitation_sum[day] /
                            years_of_data;
                    }
                    date.setDate(date.getDate() + 1); // Increment the date by 1.
                }

                res.status(200).json({ averagedData: averagedData });
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
                res.status(400).json({ error: "Error fetching weather data" });
            });
    });

    // Get real weather data
    app.post("/getrealweather", async (req, res) => {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const averagedData = req.body.averagedData;

        // The +T00:00:00 is to deal with a possible of by one bug, related to javascript Date objects, and timezones.
        const startYear = new Date(startDate + "T00:00:00").getFullYear();
        const endYear = new Date(endDate + "T00:00:00").getFullYear();

        const startDay = startDate.split("-")[2];
        const endDay = endDate.split("-")[2];
        const startMonth = startDate.split("-")[1];
        const endMonth = endDate.split("-")[1];
        const start = `${startMonth}-${startDay}`;
        const end = `${endMonth}-${endDay}`;
        const queryEndYear = new Date().getFullYear() - 1; // queryEndYear is one year less than the current year. This is to prevent querying the api for dates that don't have weather data yet, because they are in the future.
        const queryStartYear = startYear - (endYear - queryEndYear); // queryStartYear is found by getting the diffrence between endYear and queryEndYear, and applying the same diffrence to startYear.

        try {
            const dailyWeatherData = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=92&forecast_days=16&daily=weather_code&timezone=auto`
            ).then((res) => res.json());
            const weatherDataResult = averagedData;
            if (
                dailyWeatherData?.daily?.time?.length &&
                dailyWeatherData?.daily?.weather_code?.length
            ) {
                dailyWeatherData?.daily?.time.forEach((d, i) => {
                    if (i === 0) {
                        weatherDataResult["forecast_start"] = d;
                    }
                    if (i === dailyWeatherData?.daily?.time.length - 1) {
                        weatherDataResult["forecast_end"] = d;
                    }
                    weatherDataResult[d] = {
                        ...(weatherDataResult?.[d] ?? {}),
                        weatherCode: dailyWeatherData?.daily?.weather_code?.[i],
                    };
                });
            }
            res.status(200).json({ weatherDataResult: weatherDataResult });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Error fetching real weather data" });
        }
    });
}

// PUT ROUTES
{
    // update username
    app.put("/updateusername", async (req, res) => {
        const { userId, newUsername } = req.body;

        try {
            await mongoose.connect(uri);
            const updatedUser = await Account.findByIdAndUpdate(
                userId,
                { username: newUsername },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({
                message: "Username updated successfully",
                user: updatedUser,
            });
        } catch (err) {
            console.error("Error updating username:", err);
            res.status(500).json({ error: "Error updating username" });
        } finally {
            mongoose.connection.close();
        }
    });

    // update password
    app.put("/updatepassword", async (req, res) => {
        const { userId, oldPassword, newPassword } = req.body;

        try {
            await mongoose.connect(uri);
            const user = await Account.findById(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // check to see if passwords match
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ error: "Old password is incorrect" });
            }

            // hash new password
            const hashedNewPassword = await bcrypt.hash(
                newPassword,
                saltRounds
            );
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: "Password updated successfully" });
        } catch (err) {
            console.error("Error updating password:", err);
            res.status(500).json({ error: "Error updating password" });
        } finally {
            mongoose.connection.close();
        }
    });
}

module.exports = { app, mongoose, uri };
