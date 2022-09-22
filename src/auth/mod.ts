export type {
  AuthenticatedUser,
  IAuthController,
  IAuthService,
  UserDTO,
  UserPayload,
} from "./typings.d.ts";

export { Controller, Service };

// imports for dep injection
import { Service } from "./service.ts";
import { Controller } from "./controller.ts";
import { Repository as UserRepository } from "/src/users/mod.ts";
import { Service as UserService } from "/src/users/mod.ts";
import { Service as TokenService } from "/src/tokenizer/mod.ts";

// manual dep injection
const userRepository = new UserRepository();
const userService = new UserService({ userRepository });
const tokenService = new TokenService({
  configuration: {
    key: "secret",
    algorithm: "HS512",
    tokenExpirationInSeconds: 3600,
  },
});
const authService = new Service({ userService, tokenService });
export const authController = new Controller({ authService });
