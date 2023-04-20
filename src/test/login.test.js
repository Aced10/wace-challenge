const { loginUser } = require("../entities/authEntity");
const { tokenSign } = require("../middleware/generateToken");
const { compare } = require("../helpers/handleBcrypt");
const userModel = require("../models/user");

jest.mock("../middleware/generateToken");
jest.mock("../helpers/handleBcrypt");
jest.mock("../models/user");

describe("Auth entity", () => {
  const email = "test@example.com";
  const password = "password";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 404 if user is not found", async () => {
    userModel.findOne.mockReturnValueOnce(null);

    const result = await loginUser(email, password);

    expect(userModel.findOne).toHaveBeenCalledWith(
      { email },
      { password: 1, role: 1, name: 1, email: 1 }
    );
    expect(result).toEqual({ status: 404, message: "User not found!" });
  });

  test("should return 403 if password is incorrect", async () => {
    userModel.findOne.mockReturnValueOnce({
      email,
      password: "hashedPassword",
    });
    compare.mockReturnValueOnce(false);

    const result = await loginUser(email, password);

    expect(compare).toHaveBeenCalledWith(password, "hashedPassword");
    expect(result).toEqual({
      status: 403,
      message: "Password and user don't match!",
    });
  });

  test("should return 200 and token if login successful", async () => {
    const user = {
      email,
      password: "hashedPassword",
      name: "Test Admin",
      role: "admin",
    };
    userModel.findOne.mockReturnValueOnce(user);
    compare.mockReturnValueOnce(true);
    tokenSign.mockReturnValueOnce("token");

    const result = await loginUser(email, password);

    expect(compare).toHaveBeenCalledWith(password, "hashedPassword");
    expect(tokenSign).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      status: 200,
      message: "Login success!",
      user: {
        email,
        name: "Test Admin",
        password: "hashedPassword",
        role: "admin",
      },
      token: "token",
    });
  });

  test("should return 500 if an error occurs", async () => {
    userModel.findOne.mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const result = await loginUser(email, password);
    expect(result).toEqual({ status: 500, message: "Error: Database error" });
  });
});
