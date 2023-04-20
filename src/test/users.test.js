const usersModel = require("../models/user");
const { encrypt } = require("../helpers/handleBcrypt");
const {
  newUser,
  allUsers,
  userById,
  modifyUser,
  deleteOneUser,
} = require("../entities/usersEntity");

jest.mock("../models/user");
jest.mock("../helpers/handleBcrypt");

describe("Users", () => {
  describe("newUser", () => {
    test("returns 400 status if any required field is missing", async () => {
      // Arrange
      const dataUser = {
        name: "Driver Test",
        email: "driver@test.com",
        password: "password123",
        address: "123 Main St",
        phone: "555-555-5555",
      };

      // Act
      const result = await newUser(dataUser);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe(
        "Todos los campos del usuario son requeridos"
      );
    });

    test("encrypts the password and creates a new user if all fields are present", async () => {
      // Arrange
      const dataUser = {
        name: "Driver Test",
        email: "driver@test.com",
        password: "password123",
        address: "123 Main St",
        phone: "555-555-5555",
        role: "driver",
      };
      const encryptedPassword = "encrypted-password";
      const createdUser = {
        _id: "user-id",
      };
      usersModel.create.mockResolvedValue(createdUser);
      encrypt.mockResolvedValue(encryptedPassword);

      // Act
      const result = await newUser(dataUser);

      // Assert
      expect(result.status).toBe(200);
      expect(result.message).toBe("Usuario creado exitosamente!");
      expect(result.data).toBe(createdUser._id);
      expect(usersModel.create).toHaveBeenCalledWith({
        ...dataUser,
        password: encryptedPassword,
      });
    });

    test("returns 500 status and error message if an error occurs while creating the user", async () => {
      // Arrange
      const dataUser = {
        name: "Driver Test",
        email: "driver@test.com",
        password: "password123",
        address: "123 Main St",
        phone: "555-555-5555",
        role: "driver",
      };
      const errorMessage = "Error creating user";
      usersModel.create.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await newUser(dataUser);

      // Assert
      expect(result.status).toBe(500);
      expect(result.message).toBe("Se presento un error al crear el usuario!");
      expect(result.data.message).toBe(errorMessage);
    });
  });

  describe("allUsers", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return all users when there is no search parameter", async () => {
      const users = [
        { name: "John", email: "john@example.com" },
        { name: "Jane", email: "jane@example.com" },
      ];
      const mockFind = jest.spyOn(usersModel, "find").mockResolvedValue(users);
      const queryString = {};

      const result = await allUsers(queryString);

      expect(mockFind).toHaveBeenCalledWith({});
      expect(result.status).toBe(200);
      expect(result.message).toBe(
        "Se encontraron los usuarios de manera exitosa!"
      );
      expect(result.data).toBe(users);
    });

    test("should return an error message when there is an error with the database query", async () => {
      const mockFind = jest
        .spyOn(usersModel, "find")
        .mockRejectedValue(new Error("Database error"));
      const queryString = {};

      const result = await allUsers(queryString);

      expect(mockFind).toHaveBeenCalledWith({});
      expect(result.status).toBe(500);
      expect(result.message).toBe("Se presento un error al buscar usuarios!");
      expect(result.data.message).toBe("Database error");
    });
  });

  describe("userById", () => {
    let testUserId;

    beforeAll(async () => {
      // Create a test user to retrieve later
      const testUserData = {
        name: "Test User",
        email: "testuser@test.com",
        password: "password123",
        address: "123 Test St",
        phone: "3200000000",
        role: "rider",
      };
      const newUserResult = await newUser(testUserData);
      testUserId = newUserResult.data;
    });

    afterAll(async () => {
      // Delete the test user created in beforeAll
      await deleteOneUser(testUserId);
    });

    test("should return a status of 400 if no userId is provided", async () => {
      const result = await userById();
      expect(result.status).toBe(400);
      expect(result.message).toBe("El ID del usuario es requerido!");
    });

    test("should return a status of 200 and the correct user data for a valid userId", async () => {
      const result = await userById(testUserId);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Se encontro el usuario de manera exitosa!");
    });
  });

  describe("modifyUser", () => {
    const mockUser = {
      _id: "user-id",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "encryptedpassword",
      address: "123 Calle",
      phone: "3200000000",
      role: "drive",
    };

    beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      usersModel.mockClear();
    });

    test("should return an error message if userId is not provided", async () => {
      const expectedResponse = {
        status: 400,
        message: "El ID del usuario es requerido!",
      };
      const response = await modifyUser();
      expect(response).toEqual(expectedResponse);
    });

    test("should update the user and return a success message", async () => {
      // Mock the findByIdAndUpdate function to return the updated user
      usersModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      const updatedUserData = { name: "Driver Change" };
      const userId = "user-id";
      const expectedResponse = {
        status: 200,
        message: "Usuario Actualizado!",
        data: mockUser,
      };
      const response = await modifyUser(userId, updatedUserData);
      expect(usersModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updatedUserData
      );
      expect(response).toEqual(expectedResponse);
    });

    test("should return an error message if there is an error updating the user", async () => {
      const error = new Error("Error updating user");
      // Mock the findByIdAndUpdate function to throw an error
      usersModel.findByIdAndUpdate.mockRejectedValue(error);

      const updatedUserData = { name: "Jane Doe" };
      const userId = "user-id";
      const expectedResponse = {
        status: 500,
        message: "Se presento un error al actualizar el usuario!",
        data: error,
      };
      const response = await modifyUser(userId, updatedUserData);
      expect(usersModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updatedUserData
      );
      expect(response).toEqual(expectedResponse);
    });
  });

  describe("deleteOneUser", () => {
    test("should return status 400 if userId is not provided", async () => {
      const result = await deleteOneUser();
      expect(result.status).toBe(400);
    });

    test("should call usersModel.findByIdAndRemove with correct userId", async () => {
      const userId = "abc123";
      await deleteOneUser(userId);
      expect(usersModel.findByIdAndRemove).toHaveBeenCalledWith(userId);
    });

    test("should return status 200 with success message if user is deleted", async () => {
      const userId = "abc123";
      usersModel.findByIdAndRemove.mockResolvedValueOnce("user deleted");
      const result = await deleteOneUser(userId);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Usuario Eliminado!");
    });

    test("should return status 500 with error message if there is an error", async () => {
      const userId = "abc123";
      const error = new Error("some error");
      usersModel.findByIdAndRemove.mockRejectedValueOnce(error);
      const result = await deleteOneUser(userId);
      expect(result.status).toBe(500);
      expect(result.message).toBe("Se presento un error al eliminar usuario!");
      expect(result.data).toBe(error);
    });
  });
});
