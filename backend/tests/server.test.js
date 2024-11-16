const { describe, expect, beforeAll, afterAll } = require("@jest/globals");
const { app } = require("../server");
const request = require("supertest");
const Account = require("../models/accountdb");
const bcrypt = require("bcrypt");
jest.mock("../models/accountdb");
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
});
