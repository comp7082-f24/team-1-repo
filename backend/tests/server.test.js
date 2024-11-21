const { describe, expect, beforeAll, afterAll } = require("@jest/globals");
const { app } = require("../server");
const request = require("supertest");
const Account = require("../models/accountdb");
const SavedQuery = require("../models/savedquerydb");
const bcrypt = require("bcrypt");
jest.mock("../models/accountdb");
jest.mock("../models/savedquerydb");
jest.mock("bcrypt");

describe("REST APIs GET requests", () => {
    it("GET /test should return works", async () => {
        const response = await request(app)
            .get("/test")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty("test");
        expect(response.body.test).toEqual("works");
    });

    it("GET /popularqueries should return an array", async () => {
        SavedQuery.aggregate.mockResolvedValueOnce([]);
        const response = await request(app)
            .get("/popularqueries")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it.skip("GET /searchhistory/:userId should return an array", async () => {
        const response = await request(app)
            .get("/searchhistory/132")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("GET /getcoordinates should return latitude and longitutde", async () => {
        const response = await request(app)
            .get("/getcoordinates?location=vancouver")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("latitude");
        expect(typeof response.body.latitude).toBe("number");
        expect(response.body).toHaveProperty("longitude");
        expect(typeof response.body.longitude).toBe("number");
    });

    it("GET /popularquerieswiki should return an array of city wiki", async () => {
        const response = await request(app)
            .get("/popularquerieswiki")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body?.[0]).toHaveProperty("title");
        expect(typeof response.body?.[0].title).toBe("string");
        expect(response.body?.[0]).toHaveProperty("extract");
        expect(typeof response.body?.[0].extract).toBe("string");
        expect(response.body?.[0]).toHaveProperty("description");
        expect(typeof response.body?.[0].description).toBe("string");
        expect(response.body?.[0]).toHaveProperty("count");
        expect(typeof response.body?.[0].count).toBe("number");
    });

    it("GET /get-time should return current time for the coordinates provided", async () => {
        const vancouverCoorindates = new URLSearchParams("");
        vancouverCoorindates.append("latitude", 49.246292);
        vancouverCoorindates.append("longitude", -123.116226);
        const response = await request(app)
            .get(`/get-time?${vancouverCoorindates.toString()}`)
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("time");
        expect(typeof response.body.time).toBe("string");
    });

    it("GET /wiki-summary should return summary of location given", async () => {
        const location = new URLSearchParams("");
        location.append("location", "vancouver");
        const response = await request(app)
            .get(`/wiki-summary?${location.toString()}`)
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("thumbnail");
        expect(response.body).toHaveProperty("originalimage");
        expect(response.body.originalimage).toHaveProperty("source");
        expect(typeof response.body.originalimage.source).toBe("string");
        expect(response.body).toHaveProperty("title");
        expect(typeof response.body.title).toBe("string");
        expect(response.body).toHaveProperty("extract");
        expect(typeof response.body.extract).toBe("string");
    });

    it("GET /wiki-image should return summary of location given", async () => {
        const location = new URLSearchParams("");
        location.append("location", "vancouver");
        const response = await request(app)
            .get(`/wiki-image?${location.toString()}`)
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("imageUrl");
        expect(typeof response.body.imageUrl).toBe("string");
    });

    it("GET /wiki-image should return summary of location given", async () => {
        const location = new URLSearchParams("");
        location.append("location", "vancouver");
        const response = await request(app)
            .get(`/wiki-image?${location.toString()}`)
            .set("Accept", "application/json");

        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("imageUrl");
        expect(typeof response.body.imageUrl).toBe("string");
    });
});

describe("REST APIs POST requests", () => {
    describe("Account requests", () => {
        const mockUser = {
            _id: "test",
            email: "test@mail.com",
            username: "test",
            password: "test",
        };

        it("POST /signup should return already registered error when user is found", async () => {
            Account.findOne.mockResolvedValueOnce(mockUser);
            const response = await request(app)
                .post("/signup")
                .send(mockUser)
                .set("Accept", "application/json");
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Email is already registered");
        });

        it("POST /signup should return registration error when fields are missing", async () => {
            Account.findOne.mockResolvedValueOnce(null);
            Account.mockImplementationOnce(({ email, password, username }) => {
                if (!email || !password || !username) throw Error;
            });
            const response = await request(app)
                .post("/signup")
                .set("Accept", "application/json");
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Error registering user");
        });

        it("POST /signup should return success when user is not found", async () => {
            Account.findOne.mockResolvedValueOnce(null);
            Account.mockImplementationOnce(() => ({
                ...mockUser,
                save: jest.fn().mockResolvedValueOnce(2),
            }));
            const response = await request(app)
                .post("/signup")
                .send(mockUser)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toEqual(
                "User registered successfully!"
            );
        });

        it("POST /signin should return error when user is not found", async () => {
            Account.findOne.mockResolvedValueOnce(null);
            const response = await request(app)
                .post("/signin")
                .send(mockUser)
                .set("Accept", "application/json");
            expect(response.status).toEqual(401);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Invalid credentials");
        });

        it("POST /signin should return error when password is wrong", async () => {
            Account.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.compare.mockImplementationOnce((a, b) => a === b);
            const response = await request(app)
                .post("/signin")
                .send({ ...mockUser, password: "wrong_password" })
                .set("Accept", "application/json");
            expect(response.status).toEqual(401);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Invalid credentials");
        });

        it("POST /signin should return success when user is found", async () => {
            Account.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.compare.mockImplementationOnce((a, b) => a === b);
            const response = await request(app)
                .post("/signin")
                .send(mockUser)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toEqual("Sign in successful");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toStrictEqual(mockUser);
        });

        it("POST /signin should return error when internal error happens", async () => {
            Account.findOne.mockImplementationOnce(() => {
                throw Error;
            });

            const response = await request(app)
                .post("/signin")
                .send(mockUser)
                .set("Accept", "application/json");
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Sign in error");
        });

        it("POST /isauth should fail authentication when token is not provided", async () => {
            const response = await request(app)
                .post("/isauth")
                .set("Accept", "application/json");
            expect(response.status).toEqual(401);
            expect(response.body).toHaveProperty("authenticated");
            expect(response.body.authenticated).toEqual(false);
        });

        it("POST /isauth should fail authentication when malformed token is provided", async () => {
            const response = await request(app)
                .post("/isauth")
                .set("Accept", "application/json")
                .set("Cookie", ["token=12345667"]);

            expect(response.status).toEqual(403);
            expect(response.body).toHaveProperty("authenticated");
            expect(response.body.authenticated).toEqual(false);
        });

        it("POST /isauth should succeed authentication when token is provided", async () => {
            Account.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.compare.mockImplementationOnce((a, b) => a === b);
            const signin = await request(app)
                .post("/signin")
                .send(mockUser)
                .set("Accept", "application/json");
            const token = signin.header["set-cookie"][0].split(";")[0];

            const response = await request(app)
                .post("/isauth")
                .set("Accept", "application/json")
                .set("Cookie", [token]);

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("authenticated");
            expect(response.body.authenticated).toEqual(true);
        });

        it("POST /signout should return success", async () => {
            const response = await request(app)
                .post("/signout")
                .set("Accept", "application/json");

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toEqual("Logged out successfully");
        });
    });

    describe("Weather and query requests", () => {
        it("POST /savequery should return error if any of the required fields are missing", async () => {
            SavedQuery.mockImplementationOnce(
                ({ userId, searchQuery, startDate, endDate }) => {
                    if (
                        userId == undefined ||
                        searchQuery == undefined ||
                        startDate == undefined ||
                        endDate == undefined
                    )
                        throw Error;
                    return {
                        save: jest.fn(),
                    };
                }
            );
            const response = await request(app)
                .post("/savequery")
                .set("Accept", "application/json");
            expect(response.status).toEqual(500);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Error during saving");
        });

        it("POST /savequery should return success when all fields are provided", async () => {
            const mockQuery = {
                userId: 1,
                searchQuery: "vancouver",
                startDate: new Date(),
                endDate: new Date(),
            };
            const response = await request(app)
                .post("/savequery")
                .send(mockQuery)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toEqual("Query Saved!");
        });

        it("POST /getweather should return error when coordinates are not provided", async () => {
            const mockQuery = {
                latitude: null,
                longitude: null,
                startDate: new Date(),
                endDate: new Date(),
            };
            const response = await request(app)
                .post("/getweather")
                .send(mockQuery)
                .set("Accept", "application/json");
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Error fetching weather data");
        });

        it("POST /getweather should return error when date format is invalid", async () => {
            const mockQuery = {
                latitude: 49.246292,
                longitude: -123.116226,
                startDate: new Date(),
                endDate: new Date(),
            };
            const response = await request(app)
                .post("/getweather")
                .send(mockQuery)
                .set("Accept", "application/json");
            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toEqual("Error fetching weather data");
        });

        it("POST /getweather should return success when all fields are provided", async () => {
            const mockQuery = {
                latitude: 49.246292,
                longitude: -123.116226,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
            };
            const response = await request(app)
                .post("/getweather")
                .send(mockQuery)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("averagedData");
            expect(
                Object.keys(response.body.averagedData).length
            ).toBeGreaterThanOrEqual(1);
            Object.keys(response.body.averagedData).forEach((key) => {
                expect(response.body.averagedData[key]).toHaveProperty("date");
                expect(response.body.averagedData[key]).toHaveProperty(
                    "averageTemperature"
                );
                expect(response.body.averagedData[key]).toHaveProperty(
                    "averagePrecipitation"
                );
            });
        });

        it("POST /getrealweather should return success when all fields are provided", async () => {
            const mockQuery = {
                latitude: 49.246292,
                longitude: -123.116226,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
                averagedData: {},
            };
            const response = await request(app)
                .post("/getrealweather")
                .send(mockQuery)
                .set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("weatherDataResult");
            expect(response.body.weatherDataResult).toHaveProperty(
                "forecast_start"
            );
            expect(
                response.body.weatherDataResult[
                    response.body.weatherDataResult.forecast_start
                ]
            ).toHaveProperty("weatherCode");
            expect(response.body.weatherDataResult).toHaveProperty(
                "forecast_end"
            );
        });
    });
});

describe("REST APIs PUT requests", () => {
    it("PUT /updateusername should return error when user is not found", async () => {
        Account.findByIdAndUpdate.mockResolvedValueOnce(null);
        const mockQuery = {
            userId: 1,
            newUsername: "test",
        };
        const response = await request(app)
            .put("/updateusername")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(404);
        expect(response).toHaveProperty("error");
    });

    it("PUT /updateusername should return success when user is found", async () => {
        Account.findByIdAndUpdate.mockResolvedValueOnce({
            username: "test",
        });
        const mockQuery = {
            userId: 1,
            newUsername: "test",
        };
        const response = await request(app)
            .put("/updateusername")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual("Username updated successfully");
        expect(response.body.user).toStrictEqual({
            username: "test",
        });
    });

    it("PUT /updatepassword should return error when user is not found", async () => {
        Account.findById.mockResolvedValueOnce(null);
        bcrypt.compare.mockImplementationOnce((a, b) => a === b);
        const mockQuery = {
            userId: 1,
            oldPassword: "oldtest",
            newPassword: "newtest",
        };
        const response = await request(app)
            .put("/updatepassword")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toEqual("User not found");
    });
    
    it("PUT /updatepassword should return success when user is found and fields are provided", async () => {
        Account.findById.mockResolvedValueOnce({
            username: "test",
            password: "oldtest",
            save: jest.fn()
        });
        bcrypt.compare.mockImplementationOnce((a, b) => a === b);
        const mockQuery = {
            userId: 1,
            oldPassword: "oldtest2",
            newPassword: "newtest",
        };
        const response = await request(app)
            .put("/updatepassword")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toEqual("Old password is incorrect");
    });
    
    it("PUT /updatepassword should return error when old password provided is incorrect", async () => {
        Account.findById.mockResolvedValueOnce({
            username: "test",
            password: "oldtest",
            save: jest.fn()
        });
        bcrypt.compare.mockImplementationOnce((a, b) => a === b);
        const mockQuery = {
            userId: 1,
            oldPassword: "oldtest2",
            newPassword: "newtest",
        };
        const response = await request(app)
            .put("/updatepassword")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toEqual("Old password is incorrect");
    });

    it("PUT /updatepassword should return success when user is found and all fields are provided", async () => {
        Account.findById.mockResolvedValueOnce({
            username: "test",
            password: "oldtest",
            save: jest.fn()
        });
        bcrypt.compare.mockImplementationOnce((a, b) => a === b);
        const mockQuery = {
            userId: 1,
            oldPassword: "oldtest",
            newPassword: "newtest",
        };
        const response = await request(app)
            .put("/updatepassword")
            .send(mockQuery)
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toEqual("Password updated successfully");
    });
});